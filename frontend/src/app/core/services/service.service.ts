import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Service } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getServices(filters?: { category?: string; search?: string; sort?: string }): Observable<{ success: boolean; count: number; services: Service[] }> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.sort) params = params.set('sort', filters.sort);

    return this.http.get<{ success: boolean; count: number; services: Service[] }>(this.apiUrl, { params });
  }

  getServiceById(id: string): Observable<{ success: boolean; service: Service }> {
    return this.http.get<{ success: boolean; service: Service }>(`${this.apiUrl}/${id}`);
  }

  // Admin
  createService(data: Partial<Service>): Observable<{ success: boolean; message: string; service: Service }> {
    return this.http.post<{ success: boolean; message: string; service: Service }>(`${this.apiUrl}/admin`, data);
  }

  updateService(id: string, data: Partial<Service>): Observable<{ success: boolean; message: string; service: Service }> {
    return this.http.put<{ success: boolean; message: string; service: Service }>(`${this.apiUrl}/admin/${id}`, data);
  }

  deleteService(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/admin/${id}`);
  }
}
