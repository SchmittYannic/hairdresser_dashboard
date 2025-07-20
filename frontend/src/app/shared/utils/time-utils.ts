export function generateTimeLabels(
  startHour: number = 8,
  endHour: number = 18,
  intervalMinutes: number = 30
): string[] {
  const times: string[] = [];
  for (let minutes = startHour * 60; minutes <= endHour * 60; minutes += intervalMinutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const label = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    times.push(label);
  }
  return times;
}

type getAppointmentTopParams = {
  appointmentStart: Date
  startHour?: number
  startMinute?: number
  unitPerMinute?: number
}

export function getAppointmentTop({
  appointmentStart,
  startHour = 8,
  startMinute = 0,
  unitPerMinute = 1,
}: getAppointmentTopParams): string {
  if (startHour < 0 || startHour > 24) {
    throw new Error(`Invalid startHour: ${startHour}. Must be between 0 and 24.`);
  }

  if (startMinute < 0 || startMinute >= 60) {
    throw new Error(`Invalid startMinute: ${startMinute}. Must be between 0 and 59.`);
  }

  const minutes = appointmentStart.getHours() * 60 + appointmentStart.getMinutes();
  const dayStart = startHour * 60 + startMinute;
  const offset = minutes - dayStart;
  return `${offset * unitPerMinute}px`;
}
