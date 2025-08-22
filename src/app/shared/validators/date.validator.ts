import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";


export class DateValidator {

  static noEsMayorFechaActual(control: AbstractControl): ValidationErrors| null {
    if (control.value != null  && control.value < new Date()) {
      return { noEsMayorFechaActual: true };
    }
    return null;
  }

  static noEsMenorFechaActual(control: AbstractControl): ValidationErrors| null {
    if (control.value != null  && control.value >= new Date()) {
      return { noEsMayorFechaActual: true };
    }
    return null;
  }

  // static validarQueSeanIguales(
  //   formGroup: FormGroup
  // ): ValidationErrors | null {
  //   const password = formGroup.get("password")
  //   const confirmarPassword = formGroup.get("confirmarPassword")

  //   return password.value === confirmarPassword.value
  //     ? null
  //     : { noSonIguales: true }
  // }
}
