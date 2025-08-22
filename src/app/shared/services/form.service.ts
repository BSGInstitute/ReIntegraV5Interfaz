import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}
  formControl: FormControl;
  formGroup: FormGroup;
  erroMsj: any;
  iconInputValidation: string =
    'k-input-validation-icon k-icon k-i-check text-valid-success';

  showSuccessIcon(formControl: FormControl): boolean {
    return (
      !this.validControl(formControl) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  validControl(formControl: FormControl): boolean {
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  errorMessage(formControl: FormControl, nameControl: string): string {
    if(this.erroMsj != null){
      if (formControl.hasError('required')) {
        return this.erroMsj[nameControl] ? this.erroMsj[nameControl].required : null;
      }
      if (formControl.hasError('noStartSpace')) {
        return this.erroMsj[nameControl] ? this.erroMsj[nameControl].noStartSpace: null;
      }
      if (formControl.hasError('noEndSpace')) {
        return this.erroMsj[nameControl] ? this.erroMsj[nameControl].noEndSpace: null;
      }
      if (formControl.hasError('minlength')) {
        return this.erroMsj[nameControl] ? this.erroMsj[nameControl].minlength: null;
      }
      if (formControl.hasError('maxlength')) {
        return this.erroMsj[nameControl] ? this.erroMsj[nameControl].maxlength: null;
      }
      if (formControl.hasError('min')) {
        return this.erroMsj[nameControl] ? this.erroMsj[nameControl].min: null;
      }
      if (formControl.hasError('noEsMayorFechaActual')) {
        return this.erroMsj[nameControl] ? this.erroMsj[nameControl].noEsMayorFechaActual: null;
      }
      if (formControl.hasError('matchValidator')) {
        return this.erroMsj[nameControl] ? this.erroMsj[nameControl].matchValidator: null;
      }
      if (formControl.hasError('noMatchValidator')) {
        return this.erroMsj[nameControl] ? this.erroMsj[nameControl].noMatchValidator: null;
      }
      return null;
    }else{
      return null;
    }
  }
}
