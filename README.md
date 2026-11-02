# The Zero — Restaurant Website

Marketing site for **The Zero**, a family restaurant at the BAFWWA Shopping Complex, Dhaka.

Built with [TanStack Start](https://tanstack.com/start) (React 19 + SSR), Tailwind CSS v4, and a handful of [shadcn/ui](https://ui.shadcn.com) components. Originally scaffolded in Lovable and cleaned up here into a standard, portable project with no dependency on Lovable's editor tooling.

## Project structure

```
src/
  routes/          # One file per page (file-based routing via TanStack Router)
    __root.tsx     # Shared HTML shell, header/footer, global <head> tags
    index.tsx      # Home page
    menu.tsx       # Menu page
    about.tsx      # About page
    contact.tsx    # Contact / directions page
    reserve.tsx    # Book a Table page (date/time/guests -> pick table -> confirm)
  components/
    site-header.tsx / site-footer.tsx
    restaurant-3d.tsx  # The 3D restaurant model used on the booking page
    booking/       # Pieces of the Book a Table page:
      when-picker.tsx    #   1. date, time and guests
      table-list.tsx     #   2. tables as buttons (same as clicking in 3D)
      booking-form.tsx   #   3. name + phone, saves the booking
      my-bookings.tsx    #   the guest's bookings, with Cancel
    ui/            # shadcn/ui primitives (button, input)
  data/
    menu.ts        # Menu items, prices, descriptions
    tables.ts      # Seating plan: every table, its seats, floor and position
  lib/
    bookings.ts    # Booking rules: opening times, availability, form checks, saving
    format.ts      # Friendly date and time text ("Tue 3 Nov", "6:30 PM")
    site-config.ts # The site's address (domain + base path)
    utils.ts       # `cn()` class-merging helper used by ui/ components
  assets/          # Photos used across the site
public/            # Static files served as-is (favicon, robots.txt, llms.txt)
.github/workflows/deploy.yml  # Publishes the site to GitHub Pages on every push to main
```

## Getting started

Requires Node 20+.

```bash
npm install
npm run dev       # http://localhost:8080/thezerobd/
npm run build     # builds static HTML for every page into dist/client
npm run lint
npm run format    # prettier --write
```

## Design

Colours and fonts live in `src/styles.css`. The palette comes from the restaurant itself:
concrete (`bg-concrete`), plaster (`bg-plaster`), slate (`text-slate`), teal velvet for
buttons and links (`bg-velvet`), brass for thin lines only (`border-brass`) and oak.
Headings use Gloock, body text uses Hanken Grotesk (loaded from Google Fonts in `__root.tsx`).
The `arch` class gives photos the rounded-top shape of the storefront and staircase arches.

## Table booking (demo)

The **Book a Table** page (`/reserve`) lets a guest choose a date, time and party size,
explore a 3D model of both floors, click a table to see the view from that seat, and
confirm with their name and mobile number.

- Only times with at least one free table big enough for the group are offered.
- A booking holds a table for 2 hours (`BOOKING_HOURS` in `src/lib/bookings.ts`).
- **This is a demo:** bookings are stored only in the visitor's browser (localStorage)
  and are not sent to the restaurant. To make it real, replace `loadBookings`,
  `saveBooking` and `cancelBooking` in `src/lib/bookings.ts` with calls to a backend,
  and delete `takenByOtherGuests` (it marks some tables as booked so the demo looks busy).
- To change the layout, edit `src/data/tables.ts`. The 3D view updates automatically.

## Deployment

The site is built as static files and hosted on **GitHub Pages** at
https://supanega-gif.github.io/thezerobd/. Every push to `main` rebuilds and publishes it
automatically (see the Actions tab on GitHub).

**Moving to a custom domain:** change `SITE_ORIGIN` and `BASE_PATH` in
`src/lib/site-config.ts` (e.g. `"https://thezerobd.com"` and `""`), update the
`Sitemap:` line in `public/robots.txt`, and set the domain under the repo's
Settings → Pages.
