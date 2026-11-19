import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviews(filters?: { serviceId?: string; packageId?: string; limit?: number }): Observable<{
    success: boolean;
    count: number;
    reviews: Review[];
  }> {
    let params = new HttpParams();
    if (filters?.serviceId) params = params.set('serviceId', filters.serviceId);
    if (filters?.packageId) params = params.set('packageId', filters.packageId);
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  createReview(reviewData: {
    bookingId: string;
    rating: number;
    comment: string;
    serviceId?: string;
    packageId?: string;
  }): Observable<{ success: boolean; message: string; review: Review }> {
    return this.http.post<any>(this.apiUrl, reviewData);
  }

  deleteReview(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
