import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { Message, User } from '../../models/message.model';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  selectedUser: string = 'demoUser';
  messages: Message[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  selectedFile: File | null = null;
  
  // Mock users for sidebar
  users: string[] = ['demoUser', 'john', 'jane', 'alice', 'bob'];
  
  private pollingSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadMessages();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  loadMessages(): void {
    if (!this.currentUser) return;

    this.messageService.getChatMessages(this.currentUser.userId, this.selectedUser).subscribe({
      next: (messages) => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Failed to load messages:', error);
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.currentUser) return;

    this.isLoading = true;

    this.messageService.sendMessage(
      this.currentUser.userId,
      this.selectedUser,
      this.newMessage
    ).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.newMessage = '';
        this.scrollToBottom();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to send message:', error);
        alert('Failed to send message');
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.currentUser) return;

    this.isLoading = true;

    this.messageService.uploadFile(
      this.currentUser.userId,
      this.selectedUser,
      this.selectedFile
    ).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.selectedFile = null;
        this.scrollToBottom();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to upload file:', error);
        alert('Failed to upload file');
        this.isLoading = false;
      }
    });
  }

  selectUser(user: string): void {
    this.selectedUser = user;
    this.messages = [];
    this.loadMessages();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private startPolling(): void {
    // Poll for new messages every 3 seconds
    this.pollingSubscription = interval(3000).subscribe(() => {
      this.loadMessages();
    });
  }

  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private scrollToBottom(): void {
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
}