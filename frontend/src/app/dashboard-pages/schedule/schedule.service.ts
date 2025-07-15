import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Appointment } from '@app/shared/models/appointment.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private readonly apiUrl = `${environment.apiUrl}/appointment/grouped`;

  constructor(private http: HttpClient) { }

  getGroupedAppointments(options: {
    employeeId: string;
    dates?: Date[];
    start?: Date;
    end?: Date;
  }): Observable<Map<string, Appointment[]>> {
    let params = new HttpParams().set('employeeId', options.employeeId);

    if (options.dates && options.dates.length) {
      for (const date of options.dates) {
        const dateStr = date.toISOString().split('T')[0];
        params = params.append('dates', dateStr);
      }
    } else if (options.start && options.end) {
      params = params
        .set('start', options.start.toISOString().split('T')[0])
        .set('end', options.end.toISOString().split('T')[0]);
    }

    return this.http.get<{ [date: string]: Appointment[] }>(this.apiUrl, { params }).pipe(
      map(result => new Map(Object.entries(result)))
    );
  }
}
