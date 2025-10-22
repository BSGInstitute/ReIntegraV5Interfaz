import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { FilterService } from '../services/filter.service';
import { Student, FilterOptions, RATING_THRESHOLDS, STATUS_COLORS } from '../models/models';

@Component({
  selector: 'app-lista-alumno',
  templateUrl: './lista-alumno.component.html',
  styleUrls: ['./lista-alumno.component.scss']
})
export class ListaAlumnoComponent implements OnInit, OnDestroy {
  @Output() selectStudent = new EventEmitter<Student>();

  students: Student[] = [];
  filteredStudents: Student[] = [];
  displayedColumns: string[] = ['name', 'totalChats', 'averageRating', 'actions'];

  searchTerm = '';
  isRegisteredFilter = '';
  isRatedFilter = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly chatService: ChatService,
    private readonly filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudents(): void {
    this.chatService.getStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(students => {
        this.students = students;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    const filters = this.buildFilters();
    this.chatService.updateFilters(filters);
    this.filteredStudents = this.filterService.applyFilters(this.students, filters);
  }

  private buildFilters(): FilterOptions {
    const filters: FilterOptions = {};

    if (this.isRegisteredFilter !== '') {
      filters.isRegistered = this.isRegisteredFilter === 'true';
    }

    if (this.isRatedFilter !== '') {
      filters.isRated = this.isRatedFilter === 'true';
    }

    if (this.searchTerm) {
      filters.searchTerm = this.searchTerm;
    }

    return filters;
  }

  onSelectStudent(student: Student): void {
    this.selectStudent.emit(student);
  }

  getStudentType(isRegistered: boolean): string {
    return isRegistered ? 'Registrado' : 'No Registrado';
  }

  getRatingColor(rating: number): string {
    if (rating >= RATING_THRESHOLDS.HIGH) return STATUS_COLORS.SUCCESS;
    if (rating >= RATING_THRESHOLDS.MEDIUM) return STATUS_COLORS.WARNING;
    return STATUS_COLORS.ERROR;
  }
}
