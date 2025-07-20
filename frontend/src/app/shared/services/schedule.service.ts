import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { format } from 'date-fns';
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
        const dateFormatted = format(date, 'yyyy-MM-dd');
        params = params.append('dates', dateFormatted);
      }
    } else if (options.start && options.end) {
      const startFormatted = format(options.start, 'yyyy-MM-dd');
      const endFormatted = format(options.end, 'yyyy-MM-dd');
      params = params
        .set('start', startFormatted)
        .set('end', endFormatted);
    }

    return this.http.get<{ [date: string]: Appointment[] }>(this.apiUrl, { params }).pipe(
      map(result => new Map(Object.entries(result)))
    );
  }
}
