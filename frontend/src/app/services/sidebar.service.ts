import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  
  public sidebarVisibleSource = new BehaviorSubject<boolean>(false);
  // sidebarVisible = this.sidebarVisibleSource.asObservable();

  toggleSidebar() {
    this.sidebarVisibleSource.next(!this.sidebarVisibleSource.value);
  }

  setSidebarVisible(value: boolean) {
    this.sidebarVisibleSource.next(value);
  }

  constructor() { }
}
