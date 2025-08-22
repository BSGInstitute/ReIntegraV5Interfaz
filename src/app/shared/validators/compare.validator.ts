import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CompareValidators {
  static matchValidator(otherControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null; // Control is not yet associated with a parent.
      }
      const thisValue = control.value;
      const otherValue = control.parent.get(otherControlName).value;
      control.parent.get(otherControlName).markAsDirty();
      if (thisValue.length > 0 && thisValue == otherValue) {
          return null;
      }
      if(thisValue.length > 0 ){
        return {
          'matchValidator': true
        }
      }else{
        return null;
      }
    };
  }

  static noMatchValidator(otherControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null; // Control is not yet associated with a parent.
      }
      const thisValue = control.value ?? '';
      const otherValue = control.parent.get(otherControlName).value ?? '';
      // control.parent.get(otherControlName).markAsTouched();
      control.parent.get(otherControlName).markAsPending();
      // control.parent.get(otherControlName).markAsPending();
      if (thisValue.trim() != otherValue.trim()) {
          return null;
      }
      if(thisValue.length > 0 ){
        return {
          'noMatchValidator': true
        }
      }else{
        return null;
      }
    };
  }

  // static NoMatchValidator(otherControl: string): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const sourceCtrl = control.get(source);
  //     const targetCtrl = control.get(target);
  //     let value = sourceCtrl?.value ?? ''
  //     let value2 = sourceCtrl?.value ?? ''
  //     return sourceCtrl && targetCtrl && value.trim() == value2.trim()
  //       ? { mismatch: true }
  //       : null;
  //   };
  // }
}
