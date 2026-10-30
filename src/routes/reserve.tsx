// Table reservation page: pick a date, time and party size, choose a table
// in the 3D floor plan (or the list below it), then confirm with name + phone.
// The booking rules live in src/lib/bookings.ts and the layout in src/data/tables.ts.

import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Eye, Map, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site-config";
import { floors, tables, type Floor, type RestaurantTable } from "@/data/tables";
import type { CameraView, TableStatus } from "@/components/restaurant-3d";
import {
  cancelBooking,
  isTableTaken,
  isValidSlot,
  lastBookableDate,
  loadBookings,
  MAX_GUESTS,
  NAME_MAX,
  normalisePhone,
  NOTE_MAX,
  openTimes,
  saveBooking,
  toDateString,
  todayString,
  validateForm,
  type Booking,
  type FormErrors,
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

const emptyForm = { name: "", phone: "", note: "" };

function ReservePage() {
  // Browser-only things (saved bookings, today's date, WebGL) are set up after
  // the page loads, because the HTML is pre-built without a browser.
  const [ready, setReady] = useState(false);
  const [has3D, setHas3D] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [floor, setFloor] = useState<Floor>("ground");
  const [selected, setSelected] = useState<RestaurantTable | null>(null);
  const [view, setView] = useState<CameraView>("overview");

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveError, setSaveError] = useState("");
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

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

  // If the chosen time is no longer offered (new date, more guests, or it just
  // got booked), move to the first open time.
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
      setSelected(null);
      setView("overview");
    }
  }, [selected, slotOk, date, time, guests, bookings]);

  function selectTable(table: RestaurantTable) {
    setSelected(table);
    setFloor(table.floor);
    setView("seat");
    setSaveError("");
  }

  function changeFloor(next: Floor) {
    setFloor(next);
    setView("overview");
    if (selected?.floor !== next) setSelected(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !slotOk) return;
    const found = validateForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    try {
      const { booking, all } = saveBooking({
        tableId: selected.id,
        date,
        time,
        guests,
        name: form.name.trim(),
        phone: normalisePhone(form.phone) ?? "",
        note: form.note.trim(),
      });
      setBookings(all);
      setConfirmed(booking);
      setForm(emptyForm);
      setSelected(null);
      setView("overview");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save the booking.");
      setBookings(loadBookings());
    }
  }

  const floorTables = tables.filter((t) => t.floor === floor);
  const myUpcoming = bookings
    .filter((b) => ready && b.date >= todayString())
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Reservations</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">
          Pick your <span className="text-gradient-gold">table</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Choose when you're coming, then explore the restaurant in 3D and tap a glowing table to
          see the view from your seat.
        </p>
        <p className="mt-3 inline-block rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary">
          Demo version: bookings are saved only in this browser and are not sent to the restaurant.
        </p>
      </header>

      {/* Step 1: when and how many */}
      <section className="mt-10 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
        <Field icon={CalendarDays} label="Date" htmlFor="date">
          <Input
            id="date"
            type="date"
            value={date}
            min={ready ? todayString() : undefined}
            max={ready ? lastBookableDate() : undefined}
            onChange={(e) => setDate(e.target.value)}
            disabled={!ready}
          />
        </Field>
        <Field icon={Clock} label="Time" htmlFor="time">
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={!ready || times.length === 0}
            className={selectClass}
          >
            {times.length === 0 && <option value="">Fully booked</option>}
            {times.map((t) => (
              <option key={t} value={t}>
                {formatTime(t)}
              </option>
            ))}
          </select>
        </Field>
        <Field icon={Users} label="Guests" htmlFor="guests">
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            disabled={!ready}
            className={selectClass}
          >
            {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </Field>
      </section>
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
          className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/50 bg-primary/10 p-5"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="flex-1 text-sm">
            <p className="font-display text-xl">You're booked!</p>
            <p className="mt-1 text-muted-foreground">
              Table {confirmed.tableId} for {confirmed.guests} on {formatDate(confirmed.date)} at{" "}
              {formatTime(confirmed.time)}. Reference{" "}
              <span className="font-semibold text-foreground">{confirmed.id}</span>.
            </p>
          </div>
          <button aria-label="Close" onClick={() => setConfirmed(null)}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Step 2: choose a table */}
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {floors.map((f) => (
              <Button
                key={f.id}
                size="sm"
                variant={floor === f.id ? "default" : "outline"}
                className={floor === f.id ? "bg-gradient-gold text-primary-foreground" : ""}
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
                {view === "seat" ? (
                  <>
                    <Map className="mr-1.5 h-4 w-4" /> Back to floor plan
                  </>
                ) : (
                  <>
                    <Eye className="mr-1.5 h-4 w-4" /> View from seat
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border bg-[#1a1512] sm:h-[520px]">
            {ready && has3D ? (
              <Suspense fallback={<CenterNote>Loading 3D view…</CenterNote>}>
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
              <CenterNote>
                {ready
                  ? "Your browser can't show the 3D view. Please pick a table from the list below."
                  : "Loading 3D view…"}
              </CenterNote>
            )}
            <Legend />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Drag to look around, scroll or pinch to zoom.
          </p>

          {/* The same tables as buttons: works on every device and with a keyboard. */}
          <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {floorTables.map((t) => {
              const status = statusOf(t);
              const clickable = status === "free" || status === "selected";
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => selectTable(t)}
                    aria-pressed={status === "selected"}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left text-sm transition-colors",
                      status === "selected" && "border-[#ff7a2f] bg-[#ff7a2f]/15",
                      status === "free" && "border-primary/40 hover:bg-primary/10",
                      !clickable && "cursor-not-allowed border-border opacity-50",
                    )}
                  >
                    <span className="font-semibold">{t.id}</span> · {t.seats} seats
                    <span className="block text-xs text-muted-foreground">
                      {t.zone} ·{" "}
                      {status === "taken"
                        ? "Booked"
                        : status === "too-small"
                          ? "Too small"
                          : "Available"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Step 3: details */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6">
          {selected ? (
            <form onSubmit={submit} noValidate>
              <h2 className="font-display text-2xl">{selected.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.zone} · {selected.seats} seats ·{" "}
                {floors.find((f) => f.id === selected.floor)?.label}
              </p>
              <p className="mt-3 text-sm">
                {formatDate(date)} at {formatTime(time)} · {guests}{" "}
                {guests === 1 ? "guest" : "guests"}
              </p>

              <div className="mt-5 space-y-4">
                <TextField
                  id="name"
                  label="Your name"
                  value={form.name}
                  maxLength={NAME_MAX}
                  autoComplete="name"
                  error={errors.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                />
                <TextField
                  id="phone"
                  label="Mobile number"
                  type="tel"
                  placeholder="01712345678"
                  value={form.phone}
                  maxLength={20}
                  autoComplete="tel"
                  error={errors.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />
                <div>
                  <label htmlFor="note" className="text-sm font-medium">
                    Special requests <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="note"
                    rows={3}
                    maxLength={NOTE_MAX}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.note && <p className="mt-1 text-xs text-destructive">{errors.note}</p>}
                </div>
              </div>

              {saveError && <p className="mt-4 text-sm text-destructive">{saveError}</p>}
              <Button
                type="submit"
                className="shimmer mt-6 w-full bg-gradient-gold text-primary-foreground hover:opacity-90"
              >
                Confirm booking
              </Button>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setView("overview");
                }}
                className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Choose a different table
              </button>
            </form>
          ) : (
            <div className="text-sm text-muted-foreground">
              <h2 className="font-display text-2xl text-foreground">Choose a table</h2>
              <p className="mt-2">
                Gold tables are free for your time. Grey ones are booked or too small for your
                group.
              </p>
            </div>
          )}

          {myUpcoming.length > 0 && (
            <div className="mt-8 border-t border-border pt-5">
              <h3 className="font-display text-lg">Your bookings</h3>
              <ul className="mt-3 space-y-2">
                {myUpcoming.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-xs"
                  >
                    <span>
                      <span className="font-semibold text-foreground">{b.id}</span>
                      <br />
                      Table {b.tableId} · {formatDate(b.date)} · {formatTime(b.time)}
                    </span>
                    <button
                      onClick={() => {
                        setBookings(cancelBooking(b.id));
                        if (confirmed?.id === b.id) setConfirmed(null);
                      }}
                      className="text-destructive hover:underline"
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

// ---------- Small helpers ----------

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";

function Field({
  icon: Icon,
  label,
  htmlFor,
  children,
}: {
  icon: typeof Clock;
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </label>
      {children}
    </div>
  );
}

function TextField(props: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  maxLength: number;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={props.id} className="text-sm font-medium">
        {props.label}
      </label>
      <Input
        id={props.id}
        type={props.type ?? "text"}
        value={props.value}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        autoComplete={props.autoComplete}
        aria-invalid={!!props.error}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-1.5"
      />
      {props.error && <p className="mt-1 text-xs text-destructive">{props.error}</p>}
    </div>
  );
}

function Legend() {
  const items = [
    ["#d9a441", "Available"],
    ["#ff7a2f", "Your pick"],
    ["#4a4541", "Booked / too small"],
  ];
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-lg bg-black/50 px-3 py-2 text-xs">
      {items.map(([color, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> {label}
        </span>
      ))}
    </div>
  );
}

function CenterNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full place-items-center p-6 text-center text-sm text-muted-foreground">
      {children}
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

function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
