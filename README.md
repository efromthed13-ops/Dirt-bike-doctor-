# Dirt Bike Doctor 🏍️🔧

**Diagnose. Repair. Ride.**

A cross-platform mobile repair companion for dirt-bike owners and mechanics.

## MVP

- Home dashboard
- Bike brand and model selection
- Symptom-based diagnosis
- Working "Won't Start" diagnostic flow
- Diagnosis result screen
- Interactive repair guide library
- Expo/EAS build configuration

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

1. Expand diagnostic decision trees.
2. Add exact model/year selection and model-specific service data.
3. Add maintenance schedules and repair history.
4. Add photo-based troubleshooting.
5. Add offline guides.
6. Add authenticated cloud garage storage.
7. Add premium features and subscriptions.
8. Prepare App Store and Google Play releases.

Repair guidance, torque values, and service limits should be verified against the service manual for the user's exact year/model before performing a repair.
