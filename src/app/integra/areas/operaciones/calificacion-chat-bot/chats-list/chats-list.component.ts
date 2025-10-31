import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { Student, Chat, RatingStatus, DATE_FORMAT_OPTIONS, STATUS_COLORS } from '../models/models';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent implements OnInit, OnDestroy {
  @Input() student!: Student;
  @Output() selectChat = new EventEmitter<Chat>();
  @Output() backToStudents = new EventEmitter<void>();

  chats: Chat[] = [];
  displayedColumns: string[] = ['content', 'createdAt', 'isRated', 'actions'];

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    if (this.student) {
      this.loadChats();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadChats(): void {
    this.chatService.loadStudentChats(this.student.id);
    this.chatService.chats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(chats => {
        this.chats = chats;
      });
  }

  onSelectChat(chat: Chat): void {
    this.selectChat.emit(chat);
  }

  onBack(): void {
    this.backToStudents.emit();
  }

  getRatingStatus(isRated: boolean): string {
    return isRated ? 'Calificado' : 'Pendiente';
  }

  getRatingStatusColor(isRated: boolean): string {
    return isRated ? STATUS_COLORS.SUCCESS : STATUS_COLORS.WARNING;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', DATE_FORMAT_OPTIONS);
  }
}

