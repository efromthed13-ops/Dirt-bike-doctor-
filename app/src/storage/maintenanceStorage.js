const maintenance = [];

export function addMaintenance(record) {
  maintenance.push(record);
}

export function getMaintenance() {
  return maintenance;
}
