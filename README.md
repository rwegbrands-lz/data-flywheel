# Data Flywheel — Guardian Risk App

Internal tool for defining, tracking, and consuming risk signals across the LegalZoom customer data flywheel.

## What it does

Each risk in the system moves through three stages:

| Stage | Description |
|-------|-------------|
| **Ingest** | What data points are required, where they come from, and their availability status |
| **Reason** | Green / Yellow / Red logic, impact quantification, and the review/deployment lifecycle |
| **Consume** | Which surfaces (MyLZ, Salesforce, LCM) display the risk signal and at what status |

The risk detail page includes an interactive flywheel diagram, inline-editable metadata, and a History tab for notes and future change tracking.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Building

```bash
npm run build       # production build → dist/
npm run preview     # preview the production build locally
```

## Stack

- **React 19** + **Vite 8**
- Inline styles throughout (no CSS framework)
- Risk data lives in `src/data/risks.json` — edit there to add or update risks

## Contributing

All changes go through a pull request. Direct pushes to `main` are blocked.

1. Create a feature branch: `git checkout -b your-name/description`
2. Make changes and commit
3. Open a PR against `main`
