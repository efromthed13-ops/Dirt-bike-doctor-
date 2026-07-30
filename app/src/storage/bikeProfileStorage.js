const bikes = [];

export function saveBikeProfile(profile) {
  bikes.push(profile);
}

export function getBikeProfiles() {
  return bikes;
}
