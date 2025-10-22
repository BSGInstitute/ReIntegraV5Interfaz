import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { 
  Chat, 
  Evaluation, 
  EvaluationCriteria, 
  RatingLevel, 
  RATING_LABELS, 
  CRITERIA_LABELS 
} from '../models/models';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss']
})
export class EvaluationFormComponent implements OnInit, OnDestroy {
  @Input() chat!: Chat;
  @Output() backToChats = new EventEmitter<void>();
  @Output() evaluationSubmitted = new EventEmitter<void>();

  evaluationForm!: FormGroup;
  isSubmitting = false;

  private readonly destroy$ = new Subject<void>();
  private readonly DEFAULT_RATING = RatingLevel.MEDIUM;

  constructor(
    private readonly fb: FormBuilder,
    private readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.evaluationForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(RatingLevel.VERY_LOW), Validators.max(RatingLevel.VERY_HIGH)]],
      comments: ['', [Validators.required, Validators.minLength(10)]],
      clarity: [this.DEFAULT_RATING, [Validators.required, Validators.min(RatingLevel.VERY_LOW), Validators.max(RatingLevel.VERY_HIGH)]],
      relevance: [this.DEFAULT_RATING, [Validators.required, Validators.min(RatingLevel.VERY_LOW), Validators.max(RatingLevel.VERY_HIGH)]],
      completeness: [this.DEFAULT_RATING, [Validators.required, Validators.min(RatingLevel.VERY_LOW), Validators.max(RatingLevel.VERY_HIGH)]],
      accuracy: [this.DEFAULT_RATING, [Validators.required, Validators.min(RatingLevel.VERY_LOW), Validators.max(RatingLevel.VERY_HIGH)]]
    });
  }

  onSubmit(): void {
    if (this.evaluationForm.invalid) {
      this.evaluationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const evaluation = this.buildEvaluation();

    this.chatService.submitEvaluation(evaluation)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => this.evaluationSubmitted.emit(),
        error: (error) => console.error('Error submitting evaluation:', error)
      });
  }

  private buildEvaluation(): Evaluation {
    const formValue = this.evaluationForm.value;
    
    return {
      chatId: this.chat.id,
      studentId: this.chat.studentId,
      rating: formValue.rating,
      comments: formValue.comments,
      criteria: this.buildCriteria(formValue)
    };
  }

  private buildCriteria(formValue: any): EvaluationCriteria {
    return {
      clarity: formValue.clarity,
      relevance: formValue.relevance,
      completeness: formValue.completeness,
      accuracy: formValue.accuracy
    };
  }

  onBack(): void {
    this.backToChats.emit();
  }

  getRatingLabel(value: number): string {
    return RATING_LABELS[value] || '';
  }

  getCriteriaLabel(value: number): string {
    return CRITERIA_LABELS[value] || '';
  }
}

