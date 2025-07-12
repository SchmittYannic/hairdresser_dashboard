import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DropdownService {
  private dropdownOpenedSource = new Subject<string>();

  dropdownOpened$ = this.dropdownOpenedSource.asObservable();

  notifyDropdownOpened(id: string) {
    this.dropdownOpenedSource.next(id);
  }
}
