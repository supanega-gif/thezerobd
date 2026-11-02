// The guest's upcoming bookings (saved in this browser), with a Cancel button.

import type { Booking } from "@/lib/bookings";
import { formatDate, formatTime } from "@/lib/format";

type Props = {
  bookings: Booking[];
  onCancel: (id: string) => void;
};

export function MyBookings({ bookings, onCancel }: Props) {
  if (bookings.length === 0) return null;

  return (
    <div className="mt-8 border-t border-slate/15 pt-5">
      <h3 className="text-xl">Your bookings</h3>
      <ul className="mt-3">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between gap-2 border-b border-slate/15 py-3 text-sm"
          >
            <span>
              <span className="font-semibold">{b.id}</span>
              <br />
              Table {b.tableId}, {formatDate(b.date)} at {formatTime(b.time)}
            </span>
            <button
              onClick={() => onCancel(b.id)}
              className="px-2 py-2 text-destructive hover:underline"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
