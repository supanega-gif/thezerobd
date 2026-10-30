// Interactive 3D model of the restaurant, built with three.js via
// @react-three/fiber (React components for 3D) and @react-three/drei (helpers).
//
// - "overview": a bird's-eye view of the floor you can drag to rotate and scroll/pinch to zoom.
// - "seat": the camera sits in a chair at the selected table so guests see their view.
//
// This file only draws things. Which tables are free/taken is decided by the
// reservation page and passed in through `statusOf`.

import { createContext, useContext, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Floor, RestaurantTable } from "@/data/tables";

export type TableStatus = "free" | "taken" | "too-small" | "selected";
export type CameraView = "overview" | "seat";

type Props = {
  floor: Floor;
  tables: RestaurantTable[]; // tables on this floor
  statusOf: (table: RestaurantTable) => TableStatus;
  selected: RestaurantTable | null;
  view: CameraView;
  onSelect: (table: RestaurantTable) => void;
};

const COLORS: Record<TableStatus, string> = {
  free: "#d9a441", // gold, matches the site's brand colour
  selected: "#ff7a2f",
  taken: "#4a4541",
  "too-small": "#6b5d48",
};

// Text labels (table numbers, signs) are drawn as normal HTML in this overlay
// layer on top of the 3D canvas. Keeping them outside the canvas's own
// container avoids a React error when the page is closed.
const LabelLayer = createContext<RefObject<HTMLDivElement | null> | null>(null);

function Label({
  position,
  children,
}: {
  position: [number, number, number];
  children: React.ReactNode;
}) {
  const layer = useContext(LabelLayer);
  return (
    <Html
      position={position}
      center
      distanceFactor={12}
      portal={layer as RefObject<HTMLElement>}
      style={{ pointerEvents: "none" }}
    >
      {children}
    </Html>
  );
}

// Room size in metres (see src/data/tables.ts for the coordinate layout).
const ROOM = { width: 16, depth: 10, height: 3 };

export default function Restaurant3D(props: Props) {
  const labelLayer = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 11, 12], fov: 45 }}
        dpr={[1, 2]}
        style={{ touchAction: "none" }}
        aria-label="3D floor plan of The Zero"
      >
        <color attach="background" args={["#1a1512"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 10, 6]} intensity={0.9} />
        <pointLight position={[0, 2.6, 0]} intensity={18} distance={14} color="#ffc27a" />

        <LabelLayer.Provider value={labelLayer}>
          <Room floor={props.floor} />
          {props.tables.map((table) => (
            <TableModel
              key={table.id}
              table={table}
              status={props.statusOf(table)}
              showLabel={props.view === "overview"}
              onSelect={props.onSelect}
            />
          ))}
        </LabelLayer.Provider>

        <CameraRig selected={props.selected} view={props.view} floor={props.floor} />
      </Canvas>
      <div ref={labelLayer} className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  );
}

// ---------- Camera ----------

// Where the camera should be for each view.
function cameraGoal(selected: RestaurantTable | null, view: CameraView) {
  if (view === "seat" && selected) {
    // Sit on the side of the table facing away from the room centre, so the
    // guest looks across their table into the restaurant.
    const away = new THREE.Vector2(selected.x, selected.z);
    if (away.length() < 0.1) away.set(0, 1);
    away.normalize();
    const back = tableSize(selected).reach + 0.5;
    return {
      position: new THREE.Vector3(selected.x + away.x * back, 1.25, selected.z + away.y * back),
      target: new THREE.Vector3(selected.x - away.x * 3, 0.9, selected.z - away.y * 3),
    };
  }
  return { position: new THREE.Vector3(0, 11, 12), target: new THREE.Vector3(0, 0, 0) };
}

// Smoothly moves the camera when the view, table or floor changes. Stops as
// soon as it arrives (or the user drags) so it never fights the user.
function CameraRig({
  selected,
  view,
  floor,
}: {
  selected: RestaurantTable | null;
  view: CameraView;
  floor: Floor;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const moving = useRef(true);
  const { camera } = useThree();
  const goal = useMemo(() => cameraGoal(selected, view), [selected, view]);

  useEffect(() => {
    moving.current = true;
  }, [goal, floor]);

  useFrame((_, delta) => {
    const c = controls.current;
    if (!moving.current || !c) return;
    const t = 1 - Math.exp(-delta * 4); // same speed on any frame rate
    camera.position.lerp(goal.position, t);
    c.target.lerp(goal.target, t);
    c.update();
    if (camera.position.distanceTo(goal.position) < 0.02) moving.current = false;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      minDistance={view === "seat" ? 0.5 : 4}
      maxDistance={22}
      maxPolarAngle={Math.PI / 2.1} // don't go under the floor
      onStart={() => (moving.current = false)}
    />
  );
}

// ---------- Tables ----------

// Size of a table top, based on its seats.
function tableSize(table: RestaurantTable) {
  if (table.shape === "round") {
    const radius = table.seats <= 2 ? 0.45 : 0.65;
    return { length: radius * 2, width: radius * 2, reach: radius + 0.35 };
  }
  const length = Math.ceil(table.seats / 2) * 0.75 + 0.3;
  return { length, width: 1, reach: 0.85 };
}

// Chair positions around a table, relative to its centre.
function chairPositions(table: RestaurantTable): [number, number, number][] {
  const { length, width, reach } = tableSize(table);
  if (table.shape === "round") {
    return Array.from({ length: table.seats }, (_, i) => {
      const angle = (i / table.seats) * Math.PI * 2 + Math.PI / 4;
      return [Math.cos(angle) * reach, 0, Math.sin(angle) * reach];
    });
  }
  // Rectangular: chairs split along the two long sides.
  const perSide = Math.ceil(table.seats / 2);
  const step = (length - 0.3) / perSide;
  return Array.from({ length: table.seats }, (_, i) => {
    const side = i < perSide ? 1 : -1;
    const slot = i % perSide;
    return [-length / 2 + 0.15 + step * (slot + 0.5), 0, side * (width / 2 + 0.35)];
  });
}

function TableModel({
  table,
  status,
  showLabel,
  onSelect,
}: {
  table: RestaurantTable;
  status: TableStatus;
  showLabel: boolean;
  onSelect: (table: RestaurantTable) => void;
}) {
  const clickable = status === "free" || status === "selected";
  const { length, width } = tableSize(table);
  const color = COLORS[status];
  const glow = status === "selected" ? 0.6 : status === "free" ? 0.15 : 0;

  return (
    <group
      position={[table.x, 0, table.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (clickable) onSelect(table);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = clickable ? "pointer" : "not-allowed";
      }}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {/* Table top */}
      <mesh position={[0, 0.75, 0]}>
        {table.shape === "round" ? (
          <cylinderGeometry args={[length / 2, length / 2, 0.06, 32]} />
        ) : (
          <boxGeometry args={[length, 0.06, width]} />
        )}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={glow} />
      </mesh>
      {/* Table leg */}
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 0.74, 12]} />
        <meshStandardMaterial color="#2b211b" />
      </mesh>
      {/* Chairs */}
      {chairPositions(table).map((pos, i) => (
        <Chair key={i} position={pos} faceTowards={[0, 0, 0]} dim={!clickable} />
      ))}
      {/* Pendant lamp above the table */}
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffd59a" emissive="#ffb54d" emissiveIntensity={1.5} />
      </mesh>

      {showLabel && (
        <Label position={[0, 1.35, 0]}>
          <div
            className="whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{
              background: clickable ? color : "#2a2522",
              color: clickable ? "#1a1512" : "#9a8f85",
            }}
          >
            {table.id} · {table.seats}
          </div>
        </Label>
      )}
    </group>
  );
}

function Chair({
  position,
  faceTowards,
  dim,
}: {
  position: [number, number, number];
  faceTowards: [number, number, number];
  dim: boolean;
}) {
  // Turn the chair so its back is away from the table.
  const angle = Math.atan2(faceTowards[0] - position[0], faceTowards[2] - position[2]);
  const color = dim ? "#3a302a" : "#7a5236";
  return (
    <group position={position} rotation={[0, angle, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.42, 0.06, 0.42]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.75, -0.19]}>
        <boxGeometry args={[0.42, 0.55, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
        <meshStandardMaterial color="#1f1915" />
      </mesh>
    </group>
  );
}

// ---------- Room ----------

function Room({ floor }: { floor: Floor }) {
  const { width, depth, height } = ROOM;
  const wall = "#3b2f28";
  return (
    <group>
      {/* Wooden floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#5a4030" />
      </mesh>
      {/* Back, left and right walls (front is open so we can look in) */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, 0.15]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, depth]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, depth]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      {/* Windows on the left wall */}
      {[-3, 0, 3].map((z) => (
        <mesh key={z} position={[-width / 2 + 0.09, 1.6, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2, 1.6]} />
          <meshStandardMaterial color="#9cc7e0" emissive="#5d8fb0" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* Plants in the corners */}
      {[
        [-7.4, -4.4],
        [7.4, -4.4],
        [7.4, 4.4],
      ].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.25, 0.2, 0.5, 16]} />
            <meshStandardMaterial color="#2b211b" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#3f6b3a" />
          </mesh>
        </group>
      ))}

      {floor === "ground" ? (
        <>
          {/* Order counter at the back */}
          <mesh position={[4, 0.55, -4.3]}>
            <boxGeometry args={[5, 1.1, 0.8]} />
            <meshStandardMaterial color="#6e4a2f" />
          </mesh>
          <Sign position={[4, 1.6, -4.3]} text="Counter" />
          <Sign position={[0, 0.3, 4.7]} text="Entrance" />
          <Stairs />
        </>
      ) : (
        <Stairs />
      )}
    </group>
  );
}

function Stairs() {
  return (
    <group position={[-1.5, 0, -4.3]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[i * 0.4, 0.1 + i * 0.2, 0]}>
          <boxGeometry args={[0.4, 0.2 + i * 0.4, 0.9]} />
          <meshStandardMaterial color="#4a3a30" />
        </mesh>
      ))}
      <Sign position={[0.8, 1.6, 0]} text="Stairs" />
    </group>
  );
}

function Sign({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <Label position={position}>
      <div className="whitespace-nowrap text-xs uppercase tracking-widest text-[#d9a441]/80">
        {text}
      </div>
    </Label>
  );
}
