import { Component, OnInit } from '@angular/core';
import { Student, Chat, ViewState } from '../models/models';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-calificacion-chat-bot',
  templateUrl: './calificacion-chat-bot.component.html',
  styleUrls: ['./calificacion-chat-bot.component.scss']
})
export class CalificacionChatBotComponent implements OnInit {
  currentView: ViewState = ViewState.STUDENTS;
  selectedStudent: Student | null = null;
  selectedChat: Chat | null = null;

  readonly viewStates = ViewState;

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.chatService.loadStudents();
  }

  onStudentSelected(student: Student): void {
    this.selectedStudent = student;
    this.currentView = ViewState.CHATS;
  }

  onChatSelected(chat: Chat): void {
    this.selectedChat = chat;
    this.currentView = ViewState.EVALUATION;
  }

  onBackToStudents(): void {
    this.clearSelection();
    this.chatService.clearChats();
    this.currentView = ViewState.STUDENTS;
  }

  onBackToChats(): void {
    this.selectedChat = null;
    this.currentView = ViewState.CHATS;
  }

  onEvaluationSubmitted(): void {
    this.refreshData();
    this.onBackToChats();
  }

  private refreshData(): void {
    if (this.selectedStudent) {
      this.chatService.loadStudentChats(this.selectedStudent.id);
    }
    this.chatService.loadStudents();
  }

  private clearSelection(): void {
    this.selectedStudent = null;
    this.selectedChat = null;
  }
}