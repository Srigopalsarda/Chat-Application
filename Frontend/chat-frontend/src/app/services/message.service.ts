import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { ChatUser } from '../models/chat-user.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/api/messages';
  private chatApiUrl = 'http://localhost:8080/api/chat'; // New base URL for chat contacts

  constructor(private http: HttpClient) {}

  sendMessage(senderId: string, receiverId: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, {
      senderId,
      receiverId,
      content,
    });
  }

  getChatMessages(senderId: string, receiverId: string): Observable<Message[]> {
    const params = new HttpParams().set('senderId', senderId).set('receiverId', receiverId);

    return this.http.get<Message[]>(`${this.apiUrl}/chat`, { params });
  }

  uploadFile(senderId: string, receiverId: string, file: File): Observable<Message> {
    const formData = new FormData();
    formData.append('senderId', senderId);
    formData.append('receiverId', receiverId);
    formData.append('file', file);

    return this.http.post<Message>(`${this.apiUrl}/upload`, formData);
  }

  // ✅ Add a new chat contact
  // addChatUser(userId: string, contactUserId: string): Observable<any> {
  //   return this.http.post(`${this.chatApiUrl}/add-contact`, {
  //     userId,
  //     contactUserId
  //   });
  // }

  addChatUser(userId: string, contactUserId: string): Observable<ChatUser> {
    return this.http.post<ChatUser>(`${this.apiUrl}/contacts/add`, { userId, contactUserId });
  }

  getChatUsers(userId: string): Observable<ChatUser[]> {
    return this.http.get<ChatUser[]>(`${this.chatApiUrl}/contacts/${userId}`);
  }
}
