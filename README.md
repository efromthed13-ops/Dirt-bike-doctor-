# Dirt Bike Doctor 🏍️🔧

**Diagnose. Repair. Ride.**

A cross-platform mobile repair companion for dirt-bike owners and mechanics.

## MVP

- Home dashboard
- Bike brand and model selection
- Model-family diagnostic profiles
- Symptom-based diagnosis with branching decision trees
- Diagnosis result screen
- Interactive repair guide library
- Expo/EAS build configuration

## Model data

The app now attaches a model-family profile to the selected bike, including engine type, likely fueling system, and diagnostic focus areas. Because dirt-bike specifications can change between model years, exact clearances, torque values, electrical tests, fuel pressure, and service limits are intentionally not hard-coded until verified against the exact year/model service documentation.

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
3. Add exact model/year selection and verified model-year service data.
4. Add maintenance schedules and repair history.
5. Add photo-based troubleshooting.
6. Add offline guides.
7. Add authenticated cloud garage storage.
8. Add premium features and subscriptions.
9. Prepare App Store and Google Play releases.

Repair guidance, torque values, and service limits should be verified against the service manual for the user's exact year/model before performing a repair.
