// Step 3 of booking: the guest's name and phone for the chosen table.
// Checks the details, saves the booking, and tells the page when it's done.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { floors, type RestaurantTable } from "@/data/tables";
import { formatDate, formatTime } from "@/lib/format";
import {
  NAME_MAX,
  normalisePhone,
  NOTE_MAX,
  saveBooking,
  validateForm,
  type Booking,
  type FormErrors,
} from "@/lib/bookings";

type Props = {
  table: RestaurantTable;
  date: string;
  time: string;
  guests: number;
  onBooked: (booking: Booking, allBookings: Booking[]) => void;
  onCancel: () => void; // "Choose a different table"
  onSaveFailed: () => void; // e.g. the table was just booked in another tab
};

export function BookingForm(props: Props) {
  const { table, date, time, guests } = props;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveError, setSaveError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateForm({ name, phone, note });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      const { booking, all } = saveBooking({
        tableId: table.id,
        date,
        time,
        guests,
        name: name.trim(),
        phone: normalisePhone(phone) ?? "",
        note: note.trim(),
      });
      props.onBooked(booking, all);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save the booking.");
      props.onSaveFailed();
    }
  }

  const floorName = floors.find((f) => f.id === table.floor)?.label;

  return (
    <form onSubmit={submit} noValidate>
      <h2 className="text-3xl">{table.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {table.zone}, {table.seats} seats, {floorName}
      </p>
      <p className="mt-3 text-sm">
        {formatDate(date)} at {formatTime(time)}, {guests} {guests === 1 ? "guest" : "guests"}
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Your name
          </label>
          <Input
            id="name"
            value={name}
            maxLength={NAME_MAX}
            autoComplete="name"
            aria-invalid={!!errors.name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5"
          />
          <ErrorText text={errors.name} />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Mobile number
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="01712345678"
            value={phone}
            maxLength={20}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5"
          />
          <ErrorText text={errors.phone} />
        </div>

        <div>
          <label htmlFor="note" className="text-sm font-medium">
            Special requests <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="note"
            rows={3}
            maxLength={NOTE_MAX}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-input bg-concrete/40 px-3 py-2"
          />
          <ErrorText text={errors.note} />
        </div>
      </div>

      <ErrorText text={saveError} />
      <Button type="submit" size="lg" className="mt-6 w-full">
        Confirm booking
      </Button>
      <button
        type="button"
        onClick={props.onCancel}
        className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Choose a different table
      </button>
    </form>
  );
}

function ErrorText({ text }: { text?: string }) {
  return text ? <p className="mt-1 text-sm text-destructive">{text}</p> : null;
}
