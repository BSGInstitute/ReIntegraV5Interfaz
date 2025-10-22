import { Injectable } from '@angular/core';
import { Student, FilterOptions } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  applyFilters(students: Student[], filters: FilterOptions): Student[] {
    return students.filter(student => 
      this.matchesRegistrationFilter(student, filters) &&
      this.matchesRatingFilter(student, filters) &&
      this.matchesSearchFilter(student, filters)
    );
  }

  private matchesRegistrationFilter(student: Student, filters: FilterOptions): boolean {
    if (filters.isRegistered === undefined) {
      return true;
    }
    return student.isRegistered === filters.isRegistered;
  }

  private matchesRatingFilter(student: Student, filters: FilterOptions): boolean {
    if (filters.isRated === undefined) {
      return true;
    }
    const hasRating = student.averageRating > 0;
    return filters.isRated ? hasRating : !hasRating;
  }

  private matchesSearchFilter(student: Student, filters: FilterOptions): boolean {
    if (!filters.searchTerm) {
      return true;
    }
    return student.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
  }
}

