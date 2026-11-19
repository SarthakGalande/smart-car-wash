import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, WashCenter, TimeSlotOption } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getWashCenters(): Observable<{ success: boolean; count: number; centers: WashCenter[] }> {
    return this.http.get<{ success: boolean; count: number; centers: WashCenter[] }>(`${environment.apiUrl}/wash-centers`);
  }

  getAvailability(centerId: string, date: string): Observable<{
    success: boolean;
    centerId: string;
    centerName: string;
    date: string;
    slots: TimeSlotOption[];
  }> {
    const params = new HttpParams().set('centerId', centerId).set('date', date);
    return this.http.get<any>(`${environment.apiUrl}/availability`, { params });
  }

  createBooking(bookingData: any): Observable<{ success: boolean; message: string; booking: Booking }> {
    return this.http.post<{ success: boolean; message: string; booking: Booking }>(this.apiUrl, bookingData);
  }

  getMyBookings(filter?: string, page = 1, limit = 20): Observable<{
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    bookings: Booking[];
  }> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (filter) params = params.set('filter', filter);
    return this.http.get<any>(this.apiUrl, { params });
  }

  getBookingById(id: string): Observable<{ success: boolean; booking: Booking }> {
    return this.http.get<{ success: boolean; booking: Booking }>(`${this.apiUrl}/${id}`);
  }

  cancelBooking(id: string, reason?: string): Observable<{ success: boolean; message: string; booking: Booking }> {
    return this.http.put<{ success: boolean; message: string; booking: Booking }>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  rescheduleBooking(id: string, newDate: string, newTimeSlot: string, newSlotId?: string): Observable<{
    success: boolean;
    message: string;
    booking: Booking;
  }> {
    return this.http.put<{ success: boolean; message: string; booking: Booking }>(`${this.apiUrl}/${id}/reschedule`, {
      newDate,
      newTimeSlot,
      newSlotId
    });
  }

  getInvoice(id: string): Observable<{ success: boolean; invoice: any }> {
    return this.http.get<{ success: boolean; invoice: any }>(`${this.apiUrl}/${id}/invoice`);
  }

  validateCoupon(code: string, amount: number): Observable<{
    success: boolean;
    message: string;
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  }> {
    return this.http.post<any>(`${environment.apiUrl}/coupons/validate`, { code, amount });
  }
}
