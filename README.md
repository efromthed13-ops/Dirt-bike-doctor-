# Dirt Bike Doctor 🏍️🔧

**Diagnose. Repair. Ride.**

A cross-platform mobile repair companion for dirt-bike owners and mechanics.

## MVP

- Home dashboard
- Bike brand, model, and model-year selection
- Model-family diagnostic profiles
- Model-year data architecture with safe fallback to model-family data
- Symptom-based diagnosis with branching decision trees
- Diagnosis result screen
- Interactive repair guide library
- Expo/EAS build configuration

## Model and year data

The app now asks for the exact model year after the brand/model selection. It checks `app/src/data/model_year_profiles.json` first and falls back to `model_profiles.json` when an exact year profile has not been verified.

The year database intentionally starts empty. Exact clearances, torque values, electrical tests, fuel pressure, service limits, and other specifications will only be added after verification against authoritative service documentation. The UI labels an exact verified profile separately from a model-family baseline so the app does not present guesses as factory specifications.

## Run locally

Install Node.js, then from the repository root:

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on a compatible phone, or use the Android/iOS simulator when installed.

## Build

The repository includes `eas.json` with development, preview, and production profiles. After installing the EAS CLI and signing in, use the appropriate profile to create an installable build.

## Roadmap

1. Expand diagnostic decision trees. ✅
2. Add model-family diagnostic profiles. ✅
3. Add exact model/year selection and verified model-year service data. 🔄
4. Add maintenance schedules and repair history.
5. Add photo-based troubleshooting.
6. Add offline guides.
7. Add authenticated cloud garage storage.
8. Add premium features and subscriptions.
9. Prepare App Store and Google Play releases.

Repair guidance, torque values, and service limits should be verified against the service manual for the user's exact year/model before performing a repair.
