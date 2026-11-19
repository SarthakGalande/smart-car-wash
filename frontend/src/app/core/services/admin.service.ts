import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, User, DashboardStats, ContactMessage } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<{
    success: boolean;
    stats: DashboardStats;
    recentBookings: Booking[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  getAllBookings(filters?: {
    status?: string;
    search?: string;
    date?: string;
    centerId?: string;
    page?: number;
    limit?: number;
  }): Observable<{
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    bookings: Booking[];
  }> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.date) params = params.set('date', filters.date);
    if (filters?.centerId) params = params.set('centerId', filters.centerId);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<any>(`${this.apiUrl}/bookings`, { params });
  }

  updateBookingStatus(id: string, status: string, notes?: string): Observable<{
    success: boolean;
    message: string;
    booking: Booking;
  }> {
    return this.http.put<any>(`${this.apiUrl}/bookings/${id}/status`, { status, notes });
  }

  getAllUsers(filters?: { search?: string; role?: string; status?: string }): Observable<{
    success: boolean;
    count: number;
    users: User[];
  }> {
    let params = new HttpParams();
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.role) params = params.set('role', filters.role);
    if (filters?.status) params = params.set('status', filters.status);

    return this.http.get<any>(`${this.apiUrl}/users`, { params });
  }

  toggleUserStatus(id: string, status?: string): Observable<{
    success: boolean;
    message: string;
    user: User;
  }> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/status`, { status });
  }

  getReports(): Observable<{
    success: boolean;
    dailyRevenue: Array<{ _id: string; revenue: number; bookingsCount: number }>;
    packageStats: Array<{ name: string; count: number; totalRevenue: number }>;
    statusStats: Array<{ _id: string; count: number }>;
    vehicleTypeStats: Array<{ _id: string; count: number }>;
  }> {
    return this.http.get<any>(`${this.apiUrl}/reports`);
  }

  getInquiries(status?: string): Observable<{ success: boolean; count: number; messages: ContactMessage[] }> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<any>(`${this.apiUrl}/contact`, { params });
  }

  updateInquiry(id: string, data: { status?: string; adminNotes?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/contact/${id}`, data);
  }
}
