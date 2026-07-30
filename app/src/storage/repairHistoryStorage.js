const repairHistory = [];

export function saveRepair(record) {
  repairHistory.push(record);
}

export function getRepairHistory() {
  return repairHistory;
}
