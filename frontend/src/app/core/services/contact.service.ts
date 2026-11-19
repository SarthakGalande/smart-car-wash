import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  submitMessage(messageData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Observable<{ success: boolean; message: string; contactId: string }> {
    return this.http.post<any>(this.apiUrl, messageData);
  }
}
