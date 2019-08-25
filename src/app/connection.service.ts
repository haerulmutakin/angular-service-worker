import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private connectionChange = new Subject<boolean>();

  get connectionChanged() {
    return this.connectionChange.asObservable();
  }

  constructor() {
    window.addEventListener('online', () => this.updateConnectionStatus());
    window.addEventListener('offline', () => this.updateConnectionStatus());
  }

  updateConnectionStatus() {
    this.connectionChange.next(window.navigator.onLine);
  }
}
