# Polaris Metering Dashboard (React + TypeScript)

A small dashboard to **visualize and analyze electricity metering data** for meters **M1–M4**.

## Features

- **Visualization**
  - Line chart or stacked bar chart (configurable)
  - Arbitrary time window filtering (start/end)
  - Multi-meter selection (M1–M4)
  - Hover tooltips show **meter value at timestamp**
- **Alerts**
  - **Total power alert**: unique alert interval whenever \(\sum(M1..M4) > 1000W\)
  - **Leakage alert**: unique alert interval whenever \(Cluster - \sum(M1..M4) > 300W\)
  - Clicking an alert **highlights the corresponding time window** on the chart
  - Leakage windows are shaded on the chart when alerts are enabled
- **Configuration screen**
  - Choose chart type (line/stacked)
  - Toggle alert widget on/off

## Routes

- `http://<host>:<port>/visualize`
- `http://<host>:<port>/config`

## Data

The server hosts the CSV at `public/PolarisMetersData.csv` and the UI loads it from `/PolarisMetersData.csv`.

## Build and run

### Prerequisites

- Node.js 18+ (recommended 20+)
- npm (comes with Node)

### Install dependencies

```bash
cd my-app
npm install
```

### Run in development mode (hot reload)

```bash
cd my-app
npm run dev
```

Then open:

- `http://localhost:5173/visualize`
- `http://localhost:5173/config`

### Run dev server on your LAN (optional)

```bash
cd my-app
npm run dev -- --host 0.0.0.0
```

Then open:

- `http://<your-ip>:5173/visualize`

### Build for production

```bash
cd my-app
npm run build
```

### Preview the production build locally

```bash
cd my-app
npm run serve
```

By default it listens on `0.0.0.0:4173`.

### Custom host/port (Windows PowerShell)

```powershell
cd my-app
$env:HOST="0.0.0.0"
$env:PORT="8080"
npm run serve
```

Now you can access:

- `http://localhost:8080/visualize`

## Code overview (where to look)

### Pages

- **`src/pages/VisualizeScreen/`**
  - Main dashboard page.
  - Loads the series via `useMeteringSeries()`, filters to a user-selected time window, computes alert intervals, and renders:
    - `MeterChart` (graph)
    - Alerts list (click-to-highlight on the chart)
- **`src/pages/ConfigScreen/`**
  - Configuration page for:
    - chart type (line vs stacked)
    - toggling alerts on/off

### State (configuration)

- **`src/state/config.tsx`**
  - `ConfigProvider` + `useConfig()` React Context.
  - Persists `chartType` and `alertsEnabled` to `localStorage` under `polaris.config.v1`.

### Data loading + derivations

- **`src/data/loadMetersCsv.ts`**
  - Fetches `/PolarisMetersData.csv`, parses it with PapaParse, converts values to numbers/null, and sorts by timestamp.
- **`src/data/derive.ts`**
  - Produces derived fields used by the UI (like totals/leakage) from raw samples.
- **`src/data/alerts.ts`**
  - `computeAlerts()` groups consecutive “over threshold” samples into alert intervals (used for the alerts list and chart shading).

### Chart

- **`src/components/charts/MeterChart/`**
  - Recharts-based chart rendering line or stacked bar series for selected meters.
  - Displays shaded reference areas for leakage intervals and the currently selected alert window.

## Quality checks

```bash
cd my-app
npm run typecheck
npm run lint
```
