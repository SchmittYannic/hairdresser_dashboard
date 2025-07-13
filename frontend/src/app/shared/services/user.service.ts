import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { User } from '../models/user.model';

export interface UsersResponse {
  users: User[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(
    offset: number = 0,
    limit: number = 10,
    sortField: string = 'lastname',
    sortOrder: string = 'asc',
    lastname?: string,
    firstname?: string,
    roles: string[] = []
  ): Observable<UsersResponse> {
    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    if (lastname) params = params.set('lastname', lastname);
    if (firstname) params = params.set('firstname', firstname);
    roles.forEach(role => {
      params = params.append('roles', role);
    });

    return this.http.get<UsersResponse>(`${this.apiUrl}`, { withCredentials: true, params });
  }
}
