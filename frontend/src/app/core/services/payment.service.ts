import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentRecord } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  createOrder(bookingId: string): Observable<{
    success: boolean;
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    bookingReference: string;
  }> {
    return this.http.post<any>(`${this.apiUrl}/create-order`, { bookingId });
  }

  verifyPayment(payload: {
    bookingId: string;
    transactionId?: string;
    paymentMethod: string;
    orderId?: string;
    paymentId?: string;
    signature?: string;
  }): Observable<{ success: boolean; message: string; payment: PaymentRecord }> {
    return this.http.post<any>(`${this.apiUrl}/verify`, payload);
  }

  getPaymentHistory(): Observable<{ success: boolean; count: number; payments: PaymentRecord[] }> {
    return this.http.get<{ success: boolean; count: number; payments: PaymentRecord[] }>(`${this.apiUrl}/history`);
  }
}
