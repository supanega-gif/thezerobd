// The tables on the current floor as plain buttons. Does the same job as
// clicking in the 3D view, but works on every device and with a keyboard.

import { cn } from "@/lib/utils";
import type { RestaurantTable } from "@/data/tables";
import type { TableStatus } from "@/components/restaurant-3d";

const statusText: Record<TableStatus, string> = {
  free: "Available",
  selected: "Your pick",
  taken: "Booked",
  "too-small": "Too small",
};

type Props = {
  tables: RestaurantTable[];
  statusOf: (table: RestaurantTable) => TableStatus;
  onSelect: (table: RestaurantTable) => void;
};

export function TableList({ tables, statusOf, onSelect }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {tables.map((table) => {
        const status = statusOf(table);
        const canPick = status === "free" || status === "selected";
        return (
          <li key={table.id}>
            <button
              type="button"
              disabled={!canPick}
              onClick={() => onSelect(table)}
              aria-pressed={status === "selected"}
              className={cn(
                "w-full rounded-md border p-3 text-left text-sm",
                status === "selected" && "border-velvet bg-velvet text-plaster",
                status === "free" && "border-slate/25 bg-plaster hover:border-velvet",
                !canPick && "cursor-not-allowed border-transparent opacity-45",
              )}
            >
              <span className="font-semibold">{table.id}</span>, {table.seats} seats
              <span className="block text-xs opacity-75">
                {table.zone}, {statusText[status]}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
