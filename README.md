# Dirt Bike Doctor 🏍️🔧

**Diagnose. Repair. Ride.**

A cross-platform Expo / React Native prototype for dirt-bike owners and DIY mechanics.

## Current prototype features

- Rugged dark motocross-inspired UI
- Home dashboard and bottom navigation
- Bike brand/model selection for several major brands
- Optional bike year and engine-hour fields
- Symptom-based guided checks for:
  - Won't start
  - No spark
  - No fuel
  - Low compression
  - Overheating
  - Backfiring
  - Strange noise
- Searchable starter repair-guide library
- Interactive maintenance checklist
- Planned Pro features screen (purchases are not enabled)

## Run locally

Install a current Node.js LTS version, then from the repository root:

```bash
npm install
npx expo start
```

Open the project with Expo Go on a compatible phone, or run it in an installed Android/iOS simulator.

## Important limitations

This is an early prototype. Bike details and checklist completion currently live only in app memory and are not synced or reliably saved after closing the app. User accounts, cloud backup, push notifications, ads, subscriptions, AI/photo diagnosis, and a verified all-years model database are not implemented yet.

Repair guidance is general and not a substitute for the official service manual. Always verify fluid types, service intervals, clearances, torque values, and procedures for the exact year and model. Stop troubleshooting if the engine locks, makes a deep metallic knock, leaks fuel, or has a serious brake issue.

## Roadmap

1. Test and refine the diagnosis flows.
2. Persist garage and maintenance data locally.
3. Expand repair guides and model/year data with verified references.
4. Add offline access and photo-assisted troubleshooting.
5. Add accounts/cloud sync only after the local MVP is stable.
6. Integrate monetization and prepare store submissions.
