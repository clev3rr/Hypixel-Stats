# Hypixel Stats

A web application for viewing Hypixel player and guild statistics with a comparison feature.

## Project structure

- `server.js` — Express server serving static files and proxying API requests to Hypixel and Mojang
- `package.json` — npm dependencies and startup script
- `.env.example` — example environment variables
- `public/` — frontend assets
  - `index.html` — main HTML page
  - `style.css` — main stylesheet
  - `styles/` — additional CSS files
  - `js/` — frontend JavaScript modules
    - `main.js` — initialization and global page setup
    - `core.js` — shared utilities and helper functions
    - `navigation.js` — page navigation and menu handling
    - `player.js` — player lookup and display logic
    - `guild.js` — guild lookup and display logic
    - `compare.js` — player comparison logic
    - `stats-render.js` — rendering of statistics sections

## Technology stack

- Backend: `Node.js`, `Express`, `Axios`, `CORS`, `dotenv`
- Frontend: Vanilla JavaScript, HTML, CSS
- Module system: CommonJS

## API endpoints

- `GET /api/stats/:username` — fetches player statistics by username
- `GET /api/guild/:name` — fetches guild statistics by guild name or player name

The server caches API responses in memory (`API_CACHE_TTL_MS`) to reduce calls to the Hypixel API.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set your Hypixel API key:

```env
HYPIXEL_API_KEY=your_hypixel_api_key_here
PORT=3000
API_CACHE_TTL_MS=300000
```

3. Start the server:

```bash
npm start
```

4. Open the app in a browser:

```text
http://localhost:3000
```

## Notes

- Keep `HYPIXEL_API_KEY` private and do not commit `.env`.
- This project is unofficial and not affiliated with Hypixel.
- Use the API key responsibly.
