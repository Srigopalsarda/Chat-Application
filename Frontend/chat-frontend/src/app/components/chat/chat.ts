import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { Message, User } from '../../models/message.model';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth';
import { ChatUser } from '../../models/chat-user.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  selectedFile: File | null = null;

  private pollingSubscription?: Subscription;
  chatUsers: ChatUser[] = [];
  selectedUser: ChatUser | null = null;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) return;

    this.messageService.getChatUsers(this.currentUser.userId).subscribe({
      next: (users: ChatUser[]) => {
        this.chatUsers = users;

        if (this.chatUsers.length > 0) {
          this.selectedUser = this.chatUsers[0];
          this.loadMessages();
        } else {
          this.selectedUser = null;
          this.messages = [];
        }
      },
      error: (err) => console.error(err),
    });

    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  openAddChat(): void {
    const newUserId = prompt('Enter User ID to chat with:');
    if (!newUserId || newUserId.trim() === '') return;

    this.messageService.addChatUser(this.currentUser!.userId, newUserId).subscribe({
      next: (newChatUser: ChatUser) => {
        this.chatUsers.push(newChatUser);

        if (!this.selectedUser) {
          this.selectedUser = newChatUser;
          this.loadMessages();
        }
      },
      error: () => {
        alert('This user does not exist or chat already exists.');
      },
    });
  }

  loadMessages(): void {
    if (!this.currentUser || !this.selectedUser) return;

    this.messageService
      .getChatMessages(this.currentUser.userId, this.selectedUser.userId)
      .subscribe({
        next: (messages) => {
          this.messages = messages;
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (error) => console.error('Failed to load messages:', error),
      });
  }

  onFileSelected(event:any){

  }
  sendMessage(): void {
    if (!this.newMessage.trim() || !this.currentUser || !this.selectedUser) return;

    this.isLoading = true;

    this.messageService
      .sendMessage(this.currentUser.userId, this.selectedUser.userId, this.newMessage)
      .subscribe({
        next: (message) => {
          this.messages.push(message);
          this.newMessage = '';
          this.scrollToBottom();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to send message:', error);
          this.isLoading = false;
        },
      });
  }

  selectUser(user: ChatUser): void {
    this.selectedUser = user;
    this.messages = [];
    this.loadMessages();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private startPolling(): void {
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
