import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vehicle } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<{ success: boolean; count: number; vehicles: Vehicle[] }> {
    return this.http.get<{ success: boolean; count: number; vehicles: Vehicle[] }>(this.apiUrl);
  }

  addVehicle(vehicleData: Partial<Vehicle>): Observable<{ success: boolean; message: string; vehicle: Vehicle }> {
    return this.http.post<{ success: boolean; message: string; vehicle: Vehicle }>(this.apiUrl, vehicleData);
  }

  updateVehicle(id: string, vehicleData: Partial<Vehicle>): Observable<{ success: boolean; message: string; vehicle: Vehicle }> {
    return this.http.put<{ success: boolean; message: string; vehicle: Vehicle }>(`${this.apiUrl}/${id}`, vehicleData);
  }

  deleteVehicle(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
