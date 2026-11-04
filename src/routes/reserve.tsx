// Book a Table page. The guest goes through three steps:
//   1. WhenPicker   - choose date, time and number of guests
//   2. 3D view or TableList - choose a table (and see the view from it)
//   3. BookingForm  - enter name and phone, then confirm
//
// This file holds the shared state and lays the steps out. The pieces live in
// src/components/booking/, the rules in src/lib/bookings.ts, and the seating
// plan in src/data/tables.ts.

import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, Map, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhenPicker } from "@/components/booking/when-picker";
import { TableList } from "@/components/booking/table-list";
import { BookingForm } from "@/components/booking/booking-form";
import { MyBookings } from "@/components/booking/my-bookings";
import type { CameraView, TableStatus } from "@/components/restaurant-3d";
import { floors, tables, type Floor, type RestaurantTable } from "@/data/tables";
import { SITE_URL } from "@/lib/site-config";
import { formatDate, formatTime } from "@/lib/format";
import {
  cancelBooking,
  isTableTaken,
  isValidSlot,
  loadBookings,
  openTimes,
  toDateString,
  todayString,
  type Booking,
} from "@/lib/bookings";

// The 3D code is large, so it only downloads when this page is opened.
const Restaurant3D = lazy(() => import("@/components/restaurant-3d"));

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "Book a Table — The Zero, Dhaka" },
      {
        name: "description",
        content: "Choose your table in a 3D view of The Zero and book it in under a minute.",
      },
      { property: "og:title", content: "Book a Table — The Zero" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/reserve` }],
  }),
  component: ReservePage,
});

function ReservePage() {
  // `ready` turns true once the page runs in the browser. Saved bookings,
  // today's date and 3D support can only be read there (the HTML is pre-built).
  const [ready, setReady] = useState(false);
  const [has3D, setHas3D] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // What the guest has chosen
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [floor, setFloor] = useState<Floor>("ground");
  const [selected, setSelected] = useState<RestaurantTable | null>(null);
  const [view, setView] = useState<CameraView>("overview");
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  // First load in the browser
  useEffect(() => {
    const saved = loadBookings();
    // Late in the evening there are no times left today, so start with tomorrow.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const today = todayString();
    setDate(openTimes(today, 2, saved).length ? today : toDateString(tomorrow));
    setBookings(saved);
    setHas3D(supportsWebGL());
    setReady(true);
  }, []);

  // Only times with a free table for this group are offered.
  const times = useMemo(
    () => (ready && date ? openTimes(date, guests, bookings) : []),
    [ready, date, guests, bookings],
  );
  const slotOk = ready && isValidSlot(date, time, guests, bookings);

  // If the chosen time is no longer offered, move to the first open one.
  useEffect(() => {
    if (ready && !times.includes(time)) setTime(times[0] ?? "");
  }, [ready, times, time]);

  function statusOf(table: RestaurantTable): TableStatus {
    if (selected?.id === table.id) return "selected";
    if (!slotOk || isTableTaken(table.id, date, time, bookings)) return "taken";
    if (table.seats < guests) return "too-small";
    return "free";
  }

  // If the chosen table stops being available (new date/time/guests), drop it.
  useEffect(() => {
    if (
      selected &&
      (!slotOk || selected.seats < guests || isTableTaken(selected.id, date, time, bookings))
    ) {
      clearTable();
    }
  }, [selected, slotOk, date, time, guests, bookings]);

  function selectTable(table: RestaurantTable) {
    setSelected(table);
    setFloor(table.floor);
    setView("seat");
  }

  function clearTable() {
    setSelected(null);
    setView("overview");
  }

  function changeFloor(next: Floor) {
    setFloor(next);
    if (selected?.floor !== next) clearTable();
    else setView("overview");
  }

  function handleBooked(booking: Booking, all: Booking[]) {
    setBookings(all);
    setConfirmed(booking);
    clearTable();
  }

  function handleCancel(id: string) {
    setBookings(cancelBooking(id));
    if (confirmed?.id === id) setConfirmed(null);
  }

  const floorTables = tables.filter((t) => t.floor === floor);
  const upcoming = bookings
    .filter((b) => ready && b.date >= todayString())
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="text-6xl md:text-7xl">Book a table</h1>
        <p className="mt-4 text-muted-foreground">
          Choose when you're coming, then walk through the restaurant in 3D. Tap a brass table to
          see the view from that seat.
        </p>
        <p className="mt-4 border-l-2 border-brass pl-3 text-sm text-muted-foreground">
          Demo version: bookings are saved only in this browser and are not sent to the restaurant.
        </p>
      </header>

      {/* Step 1: when and how many */}
      <div className="mt-10">
        <WhenPicker
          ready={ready}
          date={date}
          time={time}
          guests={guests}
          times={times}
          onDate={setDate}
          onTime={setTime}
          onGuests={setGuests}
        />
      </div>
      {ready && !slotOk && (
        <p className="mt-3 text-sm text-destructive">
          {times.length === 0
            ? "No tables are free for your group on this date. Please try another date."
            : "Please choose a date within the next 30 days."}
        </p>
      )}

      {confirmed && (
        <div
          role="status"
          className="slide-in mt-6 flex items-start gap-3 rounded-md bg-velvet p-5 text-plaster"
        >
          <CheckCircle2 className="tick-draw mt-1 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-display text-2xl">Your table is booked</p>
            <p className="mt-1 text-sm text-plaster/85">
              Table {confirmed.tableId} for {confirmed.guests} on {formatDate(confirmed.date)} at{" "}
              {formatTime(confirmed.time)}. Your reference is{" "}
              <span className="font-semibold text-plaster">{confirmed.id}</span>.
            </p>
          </div>
          <button aria-label="Close" className="p-2" onClick={() => setConfirmed(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Step 2: choose a table */}
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {floors.map((f) => (
              <Button
                key={f.id}
                size="sm"
                variant={floor === f.id ? "default" : "outline"}
                onClick={() => changeFloor(f.id)}
              >
                {f.label}
              </Button>
            ))}
            {selected && (
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                onClick={() => setView(view === "seat" ? "overview" : "seat")}
              >
                {view === "seat" ? <Map /> : <Eye />}
                {view === "seat" ? "Back to floor plan" : "View from seat"}
              </Button>
            )}
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-md bg-slate text-plaster sm:h-[520px]">
            {ready && has3D ? (
              <Suspense fallback={<CenterNote text="Loading 3D view…" />}>
                <Restaurant3D
                  floor={floor}
                  tables={floorTables}
                  statusOf={statusOf}
                  selected={selected}
                  view={view}
                  onSelect={selectTable}
                />
              </Suspense>
            ) : (
              <CenterNote
                text={
                  ready
                    ? "Your browser can't show the 3D view. Please pick a table from the list below."
                    : "Loading 3D view…"
                }
              />
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {view === "seat" && selected
              ? "You're seated at this table. Drag to turn your head, scroll or pinch to zoom."
              : "Drag to look around, scroll or pinch to zoom."}
          </p>

          {/* On phones the form is further down the page, so offer a shortcut to it. */}
          {selected && (
            <Button
              size="lg"
              className="mt-4 w-full lg:hidden"
              onClick={() => document.getElementById("details")?.scrollIntoView()}
            >
              Continue with {selected.name}
            </Button>
          )}

          <div className="mt-5">
            <TableList tables={floorTables} statusOf={statusOf} onSelect={selectTable} />
          </div>
        </div>

        {/* Step 3: guest details */}
        <aside
          id="details"
          className="h-fit scroll-mt-24 rounded-md bg-plaster p-6 lg:sticky lg:top-24"
        >
          {selected ? (
            <BookingForm
              key={selected.id}
              table={selected}
              date={date}
              time={time}
              guests={guests}
              onBooked={handleBooked}
              onCancel={clearTable}
              onSaveFailed={() => setBookings(loadBookings())}
            />
          ) : (
            <div>
              <h2 className="text-3xl">Choose a table</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Brass tables are free at your time. Grey ones are booked or too small for your
                group.
              </p>
            </div>
          )}
          <MyBookings bookings={upcoming} onCancel={handleCancel} />
        </aside>
      </section>
    </div>
  );
}

function CenterNote({ text }: { text: string }) {
  return (
    <div className="grid h-full place-items-center p-6 text-center text-sm text-plaster/70">
      {text}
    </div>
  );
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
