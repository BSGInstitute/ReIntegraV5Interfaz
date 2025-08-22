import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class KendoUrlValidator {
    static url(): ValidatorFn {
        return (control: AbstractControl): Promise<{ [key: string]: any } | null> => {
            const value = control.value;
      
        if (!value) {
            return Promise.resolve(null);
        }
  
        const urlPattern: RegExp = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/;
  
        if (urlPattern.test(value)) {
            return Promise.resolve(null);// La URL es válida
        } else {
            return Promise.resolve({ 'invalidUrl': true });; // La URL es inválida
        }
      };
    }
  }
  