// The restaurant's seating plan, used by the booking page and the 3D view.
//
// To change the layout, edit this list:
//  - x / z are positions in metres on that floor. The room runs from
//    x = -8 (window wall, left) to x = 8 (right wall), and
//    z = -5 (back wall) to z = 5 (front, open side facing the camera).
//  - shape "round" or "rect". Table size grows automatically with seats.

export type Floor = "ground" | "first";

export type RestaurantTable = {
  id: string;
  name: string;
  floor: Floor;
  seats: number;
  zone: string;
  shape: "round" | "rect";
  x: number;
  z: number;
};

export const floors: { id: Floor; label: string }[] = [
  { id: "ground", label: "Ground floor" },
  { id: "first", label: "First floor" },
];

export const tables: RestaurantTable[] = [
  // Ground floor
  {
    id: "G1",
    name: "Table G1",
    floor: "ground",
    seats: 2,
    zone: "Window",
    shape: "round",
    x: -6.5,
    z: -3,
  },
  {
    id: "G2",
    name: "Table G2",
    floor: "ground",
    seats: 2,
    zone: "Window",
    shape: "round",
    x: -6.5,
    z: 0,
  },
  {
    id: "G3",
    name: "Table G3",
    floor: "ground",
    seats: 2,
    zone: "Window",
    shape: "round",
    x: -6.5,
    z: 3,
  },
  {
    id: "G4",
    name: "Table G4",
    floor: "ground",
    seats: 4,
    zone: "Centre",
    shape: "round",
    x: -2.5,
    z: -2,
  },
  {
    id: "G5",
    name: "Table G5",
    floor: "ground",
    seats: 4,
    zone: "Centre",
    shape: "round",
    x: -2.5,
    z: 2,
  },
  {
    id: "G6",
    name: "Table G6",
    floor: "ground",
    seats: 4,
    zone: "Centre",
    shape: "round",
    x: 1.5,
    z: -2,
  },
  {
    id: "G7",
    name: "Table G7",
    floor: "ground",
    seats: 4,
    zone: "Centre",
    shape: "round",
    x: 1.5,
    z: 2,
  },
  {
    id: "G8",
    name: "Table G8",
    floor: "ground",
    seats: 6,
    zone: "Booth",
    shape: "rect",
    x: 5.8,
    z: -2.5,
  },
  {
    id: "G9",
    name: "Table G9",
    floor: "ground",
    seats: 6,
    zone: "Booth",
    shape: "rect",
    x: 5.8,
    z: 1.5,
  },

  // First floor
  {
    id: "F1",
    name: "Table F1",
    floor: "first",
    seats: 8,
    zone: "Family",
    shape: "rect",
    x: -4.5,
    z: -2.5,
  },
  {
    id: "F2",
    name: "Table F2",
    floor: "first",
    seats: 6,
    zone: "Family",
    shape: "rect",
    x: -4.5,
    z: 2,
  },
  {
    id: "F3",
    name: "Table F3",
    floor: "first",
    seats: 4,
    zone: "Centre",
    shape: "round",
    x: 0.5,
    z: -2,
  },
  {
    id: "F4",
    name: "Table F4",
    floor: "first",
    seats: 4,
    zone: "Centre",
    shape: "round",
    x: 0.5,
    z: 2,
  },
  {
    id: "F5",
    name: "Table F5",
    floor: "first",
    seats: 2,
    zone: "Corner",
    shape: "round",
    x: 5.5,
    z: -3,
  },
  {
    id: "F6",
    name: "Table F6",
    floor: "first",
    seats: 2,
    zone: "Corner",
    shape: "round",
    x: 5.5,
    z: 0,
  },
  {
    id: "F7",
    name: "Table F7",
    floor: "first",
    seats: 2,
    zone: "Corner",
    shape: "round",
    x: 5.5,
    z: 3,
  },
];
