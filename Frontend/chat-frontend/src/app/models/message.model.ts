export interface Message {
  id?: number;
  senderId: string;
  receiverId: string;
  content?: string;
  fileName?: string;
  fileUrl?: string;
  sentAt?: string;
}

export interface User {
  userId: string;
  username: string;
}

export interface AuthResponse {
  message: string;
  userId: string;
  username: string;
}