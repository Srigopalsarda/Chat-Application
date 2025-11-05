import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) {}

  sendMessage(senderId: string, receiverId: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, {
      senderId,
      receiverId,
      content
    });
  }

  getChatMessages(senderId: string, receiverId: string): Observable<Message[]> {
    const params = new HttpParams()
      .set('senderId', senderId)
      .set('receiverId', receiverId);

    return this.http.get<Message[]>(`${this.apiUrl}/chat`, { params });
  }

  uploadFile(senderId: string, receiverId: string, file: File): Observable<Message> {
    const formData = new FormData();
    formData.append('senderId', senderId);
    formData.append('receiverId', receiverId);
    formData.append('file', file);

    return this.http.post<Message>(`${this.apiUrl}/upload`, formData);
  }
}