import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { Student, Chat, Evaluation, FilterOptions } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl = 'api/chats';

  private readonly studentsSubject = new BehaviorSubject<Student[]>([]);
  private readonly chatsSubject = new BehaviorSubject<Chat[]>([]);
  private readonly filtersSubject = new BehaviorSubject<FilterOptions>({});
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly students$ = this.studentsSubject.asObservable();
  readonly chats$ = this.chatsSubject.asObservable();
  readonly filters$ = this.filtersSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadStudents(): void {
    this.loadingSubject.next(true);
    this.http.get<Student[]>(`${this.apiUrl}/students`)
      .pipe(
        tap(students => this.studentsSubject.next(students)),
        catchError(this.handleError),
        tap(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  getStudentChats(studentId: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/students/${studentId}/chats`)
      .pipe(
        catchError(this.handleError),
        shareReplay(1)
      );
  }

  loadStudentChats(studentId: string): void {
    this.loadingSubject.next(true);
    this.getStudentChats(studentId)
      .pipe(
        tap(chats => this.chatsSubject.next(chats)),
        tap(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  submitEvaluation(evaluation: Evaluation): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/evaluations`, evaluation)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateFilters(filters: FilterOptions): void {
    this.filtersSubject.next(filters);
  }

  getStudents(): Observable<Student[]> {
    return this.students$;
  }

  clearChats(): void {
    this.chatsSubject.next([]);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error ${error.status}: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
