import { tables } from "@/data/tables";

// Booking logic for the DEMO reservation system.
//
// Bookings are saved in the visitor's own browser (localStorage). Nothing is
// sent to the restaurant. To make it real, replace loadBookings / saveBooking /
// cancelBooking with calls to a backend (database or booking API) and keep the
// rest of the page as it is.

export type Booking = {
  id: string; // reference shown to the guest, e.g. "TZ-4K7Q2M"
  tableId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  guests: number;
  name: string;
  phone: string;
  note: string;
};

const STORAGE_KEY = "thezero-bookings";

// Opening hours are 10:00–23:00 and a booking holds a table for 2 hours,
// so the last booking starts at 21:00.
export const BOOKING_HOURS = 2;
export const TIME_SLOTS = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];
export const MAX_GUESTS = 8;
export const MAX_DAYS_AHEAD = 30;
export const NAME_MAX = 60;
export const NOTE_MAX = 200;

// ---------- Dates (always the visitor's local time) ----------

export function toDateString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayString(): string {
  return toDateString(new Date());
}

export function lastBookableDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + MAX_DAYS_AHEAD);
  return toDateString(d);
}

function minutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Slots that can still be booked on a given date (past times today are hidden).
export function availableTimes(date: string): string[] {
  if (date !== todayString()) return TIME_SLOTS;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return TIME_SLOTS.filter((t) => minutes(t) > nowMinutes);
}

// ---------- Availability ----------

// Two bookings clash if they are on the same table and day, and less than
// BOOKING_HOURS apart.
function overlaps(a: { date: string; time: string }, b: { date: string; time: string }) {
  return a.date === b.date && Math.abs(minutes(a.time) - minutes(b.time)) < BOOKING_HOURS * 60;
}

// DEMO ONLY: marks about 1 in 4 tables as taken by "other guests" so the demo
// floor plan doesn't look empty. The result is fixed for a given table, date
// and time. Delete this (and its use below) when using real bookings.
function takenByOtherGuests(tableId: string, date: string, time: string): boolean {
  const text = `${tableId}|${date}|${time.slice(0, 2)}`;
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash % 4 === 0;
}

export function isTableTaken(
  tableId: string,
  date: string,
  time: string,
  bookings: Booking[],
): boolean {
  if (takenByOtherGuests(tableId, date, time)) return true;
  return bookings.some((b) => b.tableId === tableId && overlaps(b, { date, time }));
}

// Times on a date when at least one table big enough for the group is free.
// Fully booked times are left out, so guests can only pick a time that works.
export function openTimes(date: string, guests: number, bookings: Booking[]): string[] {
  return availableTimes(date).filter((time) =>
    tables.some((t) => t.seats >= guests && !isTableTaken(t.id, date, time, bookings)),
  );
}

// ---------- Form checks ----------

export type BookingForm = { name: string; phone: string; note: string };
export type FormErrors = Partial<Record<keyof BookingForm, string>>;

// Accepts Bangladeshi mobile numbers like 01712345678, 017-1234-5678 or
// +8801712345678 and returns them as 01712345678. Returns null if invalid.
export function normalisePhone(input: string): string | null {
  let digits = input.replace(/[\s-]/g, "");
  if (digits.startsWith("+880")) digits = "0" + digits.slice(4);
  else if (digits.startsWith("880")) digits = "0" + digits.slice(3);
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null;
}

export function validateForm(form: BookingForm): FormErrors {
  const errors: FormErrors = {};
  const name = form.name.trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > NAME_MAX) errors.name = `Name must be under ${NAME_MAX} characters.`;
  if (!normalisePhone(form.phone)) errors.phone = "Enter a valid mobile number, e.g. 01712345678.";
  if (form.note.length > NOTE_MAX) errors.note = `Note must be under ${NOTE_MAX} characters.`;
  return errors;
}

// Checks the date/time/guests chosen at the top of the page: the date must be
// in range and the time must still have a free table for the group.
export function isValidSlot(
  date: string,
  time: string,
  guests: number,
  bookings: Booking[],
): boolean {
  return (
    date >= todayString() &&
    date <= lastBookableDate() &&
    Number.isInteger(guests) &&
    guests >= 1 &&
    guests <= MAX_GUESTS &&
    openTimes(date, guests, bookings).includes(time)
  );
}

// ---------- Storage (browser only) ----------

function isBooking(value: unknown): value is Booking {
  const b = value as Booking;
  return (
    typeof b === "object" &&
    b !== null &&
    typeof b.id === "string" &&
    typeof b.tableId === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
    /^\d{2}:\d{2}$/.test(b.time) &&
    typeof b.guests === "number" &&
    typeof b.name === "string" &&
    typeof b.phone === "string" &&
    typeof b.note === "string"
  );
}

export function loadBookings(): Booking[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    // Ignore anything that doesn't look like a booking (old or edited data).
    return Array.isArray(parsed) ? parsed.filter(isBooking) : [];
  } catch {
    return []; // storage blocked (private mode) or corrupted
  }
}

function storeBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // Storage full or blocked: the booking still shows for this visit.
  }
}

function newReference(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I mix-ups
  const random = crypto.getRandomValues(new Uint32Array(6));
  return "TZ-" + Array.from(random, (n) => letters[n % letters.length]).join("");
}

// Saves a booking and returns the updated list. Throws if the table was
// taken in the meantime (e.g. booked in another tab).
export function saveBooking(details: Omit<Booking, "id">): { booking: Booking; all: Booking[] } {
  const current = loadBookings();
  const table = tables.find((t) => t.id === details.tableId);
  if (
    !table ||
    table.seats < details.guests ||
    !isValidSlot(details.date, details.time, details.guests, current)
  ) {
    throw new Error("Sorry, that time is no longer available. Please choose another.");
  }
  if (isTableTaken(details.tableId, details.date, details.time, current)) {
    throw new Error("Sorry, that table was just booked. Please choose another.");
  }
  const booking: Booking = { ...details, id: newReference() };
  const all = [...current, booking];
  storeBookings(all);
  return { booking, all };
}

export function cancelBooking(id: string): Booking[] {
  const remaining = loadBookings().filter((b) => b.id !== id);
  storeBookings(remaining);
  return remaining;
}
