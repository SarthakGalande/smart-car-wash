import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationItem } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<{ success: boolean; unreadCount: number; notifications: NotificationItem[] }> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap((res) => {
        if (typeof res.unreadCount === 'number') {
          this.unreadCountSubject.next(res.unreadCount);
        }
      })
    );
  }

  markAsRead(id: string): Observable<{ success: boolean; notification: NotificationItem }> {
    return this.http.put<any>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const current = Math.max(0, this.unreadCountSubject.value - 1);
        this.unreadCountSubject.next(current);
      })
    );
  }

  markAllAsRead(): Observable<{ success: boolean; message: string }> {
    return this.http.put<any>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap(() => {
        this.unreadCountSubject.next(0);
      })
    );
  }
}
