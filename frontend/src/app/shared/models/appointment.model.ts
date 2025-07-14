export interface Appointment {
  id: string;
  start: string;
  end: string;
  serviceName: string;
  customer: string;
  employee: string;
  duration: number;
  remarks?: string;
}
