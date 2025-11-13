# DC Motor Performance Visualizer

An interactive React + Vite experience for exploring the behavior of an R550-type DC motor. Slide the input voltage, estimate the voltage required to sustain a target RPM/Torque pair, and inspect the resulting torque, speed, and efficiency curves that are generated on the fly.

## Features
- Real-time charting of torque, speed, efficiency, and current using Recharts
- Voltage slider with live updates to the simulated motor curve
- Calculator that estimates the voltage needed for a requested RPM/Torque pair and explains the formula used
- Modern, responsive UI that works well on large dashboards and smaller viewports

## Tech Stack
- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/) for dev/build tooling
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Recharts](https://recharts.org/) for data visualization

## Getting Started

### Prerequisites
- Node.js 18+ (20 LTS recommended)
- npm (bundled with Node.js)

### Installation
```bash
npm install
```

### Local development
```bash
npm run dev
```
The development server starts on `http://localhost:3000` (configurable in `vite.config.ts`).

### Production build
```bash
npm run build
```
The optimized assets are emitted to `dist/`.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_BASE_PATH` | auto (`/<repo-name>/` in GitHub Actions) | Overrides Vite's `base` option. Set manually if you need a custom path (defaults to `/` locally). |


Create a `.env.local` (for local development) or rely on repository/Actions secrets to customize any of the variables above.

## Deploying to GitHub Pages

The repository includes `.github/workflows/deploy.yml`, which automates building and deploying the site to GitHub Pages.

1. Enable GitHub Pages in the repository settings and select the `GitHub Actions` deployment source.
2. (Optional) Add a repository variable or secret named `VITE_BASE_PATH` with the value `/<repo-name>/` if your project is not served from the root domain.
3. Push to `main` (or trigger the workflow manually via **Actions → Deploy to GitHub Pages → Run workflow**). The workflow will:
   - Install dependencies
   - Run `npm run build`
   - Upload the `dist/` artifacts and publish them via `actions/deploy-pages`

Once the workflow finishes, the published URL is available in the deployment summary.
