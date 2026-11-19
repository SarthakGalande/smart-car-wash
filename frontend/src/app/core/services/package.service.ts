import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Package } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = `${environment.apiUrl}/packages`;

  constructor(private http: HttpClient) {}

  getPackages(): Observable<{ success: boolean; count: number; packages: Package[] }> {
    return this.http.get<{ success: boolean; count: number; packages: Package[] }>(this.apiUrl);
  }

  getPackageById(id: string): Observable<{ success: boolean; package: Package }> {
    return this.http.get<{ success: boolean; package: Package }>(`${this.apiUrl}/${id}`);
  }

  // Admin
  createPackage(data: Partial<Package>): Observable<{ success: boolean; message: string; package: Package }> {
    return this.http.post<{ success: boolean; message: string; package: Package }>(`${this.apiUrl}/admin`, data);
  }

  updatePackage(id: string, data: Partial<Package>): Observable<{ success: boolean; message: string; package: Package }> {
    return this.http.put<{ success: boolean; message: string; package: Package }>(`${this.apiUrl}/admin/${id}`, data);
  }

  deletePackage(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/admin/${id}`);
  }
}
