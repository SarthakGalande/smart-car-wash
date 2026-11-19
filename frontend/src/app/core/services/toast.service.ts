import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(type: 'success' | 'danger' | 'warning' | 'info', message: string, title?: string, duration = 4000) {
    const id = ++this.counter;
    const current = this.toastsSubject.value;
    const newToast: ToastMessage = { id, type, title, message };
    this.toastsSubject.next([...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(message: string, title = 'Success') {
    this.show('success', message, title);
  }

  error(message: string, title = 'Error') {
    this.show('danger', message, title);
  }

  warning(message: string, title = 'Notice') {
    this.show('warning', message, title);
  }

  info(message: string, title = 'Info') {
    this.show('info', message, title);
  }

  remove(id: number) {
    const updated = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(updated);
  }
}
