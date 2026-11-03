// Step 1 of booking: date, time and number of guests.

import { CalendarDays, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { lastBookableDate, MAX_GUESTS, todayString } from "@/lib/bookings";
import { formatTime } from "@/lib/format";

type Props = {
  ready: boolean; // false until the page has loaded in the browser
  date: string;
  time: string;
  guests: number;
  times: string[]; // times that still have a free table
  onDate: (date: string) => void;
  onTime: (time: string) => void;
  onGuests: (guests: number) => void;
};

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-concrete/40 px-3 disabled:opacity-50";

export function WhenPicker(props: Props) {
  return (
    <section className="grid gap-4 rounded-md bg-plaster p-5 sm:grid-cols-3">
      <div>
        <Label htmlFor="date" icon={<CalendarDays />} text="Date" />
        <Input
          id="date"
          type="date"
          value={props.date}
          min={props.ready ? todayString() : undefined}
          max={props.ready ? lastBookableDate() : undefined}
          onChange={(e) => props.onDate(e.target.value)}
          disabled={!props.ready}
        />
      </div>

      <div className="relative">
        <Label htmlFor="time" icon={<Clock />} text="Time" />
        {/* Re-created whenever the list of open times changes, which plays a brief highlight. */}
        <span
          key={props.times.join()}
          aria-hidden
          className="flash pointer-events-none absolute inset-x-0 bottom-0 h-11 rounded-md"
        />
        <select
          id="time"
          value={props.time}
          onChange={(e) => props.onTime(e.target.value)}
          disabled={!props.ready || props.times.length === 0}
          className={selectClass}
        >
          {props.times.length === 0 && <option value="">Fully booked</option>}
          {props.times.map((t) => (
            <option key={t} value={t}>
              {formatTime(t)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="guests" icon={<Users />} text="Guests" />
        <select
          id="guests"
          value={props.guests}
          onChange={(e) => props.onGuests(Number(e.target.value))}
          disabled={!props.ready}
          className={selectClass}
        >
          {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

function Label(props: { htmlFor: string; icon: React.ReactNode; text: string }) {
  return (
    <label
      htmlFor={props.htmlFor}
      className="mb-1.5 flex items-center gap-1.5 text-sm font-medium [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-velvet"
    >
      {props.icon} {props.text}
    </label>
  );
}
