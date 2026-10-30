# Glam & Glow Beauty Parlour

A website for a beauty salon, with online booking and a private page for the owner to see bookings.

## What it does

- Customers browse services, view a photo gallery and book an appointment
- The booking form checks the details and stops double-bookings for the same stylist, date and time
- A booking can be sent to the owner on WhatsApp
- Bookings are sent to a small Node.js server and saved there
- The owner opens `admin.html`, enters a password, and sees every booking

## Built with

HTML, CSS, JavaScript, Node.js and Express

## How to run it

1. Install Node.js
2. Install the packages:

```
npm install
```

3. Start the server:

```
node server.js
```

4. Open `index.html` with the VS Code Live Server extension

The owner password is read from the `ADMIN_PASSWORD` setting. Set your own before using this for real.

## Known limits

- Bookings are saved to a file, so they would be lost on free hosting. A real database is the next step.
- The server address in `script.js` points to localhost and must be changed when the server is hosted online.

Built by Waithera.