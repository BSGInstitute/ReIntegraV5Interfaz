import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[inputValidSpaceDir]'
})
export class InputValidSpaceDirective {

  constructor(public elementRef: ElementRef) {

  }

  @Input()

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    // console.log(this.elementRef.nativeElement.value);
    // console.log(event);
    const input = event.target as HTMLInputElement;
    // console.log(input.value);
    // console.log(input.selectionStart);
    // console.log(input.selectionEnd);
    let currentValue: any = input.value;
    let key: any = event.key;
    let keyCode: any = event.keyCode;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const ultimoCaracter = currentValue.substr(-1);
    const lengthValue: number = currentValue.length;
    // console.log(currentValue.length);
    if(keyCode == 32 && selectionStart == 0){
      event.preventDefault();
    }

    if(keyCode == 32 && ultimoCaracter == ' ' && selectionEnd == lengthValue && selectionStart == lengthValue){
      event.preventDefault();
    }

    let nextCaracter = currentValue.substr(selectionStart, 1);
    let prevCaracter = currentValue.substr(selectionStart-1, 1);
    // console.log(currentValue.substr(selectionStart, 1));
    // console.log(prevCaracter);
    // console.log(nextCaracter);

    if(keyCode == 32 && (nextCaracter == ' ' || prevCaracter == ' ')){
      event.preventDefault();
    }

    input.value = currentValue.replace(/  /g, " ")

  }
  @HostListener("keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    // console.log(this.elementRef.nativeElement.value);
    // console.log(event);
    const input = event.target as HTMLInputElement;
    // console.log(input.value);
    // console.log(input.selectionStart);
    // console.log(input.selectionEnd);
    let currentValue: any = input.value;
    let key: any = event.key;
    let keyCode: any = event.keyCode;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const ultimoCaracter = currentValue.substr(-1);
    const lengthValue: number = currentValue.length;
    // console.log(currentValue.length);
    if(keyCode == 32 && selectionStart == 0){
      event.preventDefault();
    }

    if(keyCode == 32 && ultimoCaracter == ' ' && selectionEnd == lengthValue && selectionStart == lengthValue){
      event.preventDefault();
    }

    let nextCaracter = currentValue.substr(selectionStart, 1);
    let prevCaracter = currentValue.substr(selectionStart-1, 1);
    // console.log(currentValue.substr(selectionStart, 1));
    // console.log(prevCaracter);
    // console.log(nextCaracter);

    if(keyCode == 32 && (nextCaracter == ' ' || prevCaracter == ' ')){
      event.preventDefault();
    }

    input.value = currentValue.replace(/  /g, " ")
  }

  @HostListener("keyup", ["$event"])
  onKeyUp(event: KeyboardEvent) {
    // console.log(this.elementRef.nativeElement.value);
    // console.log(event);
    const input = event.target as HTMLInputElement;
    // console.log(input.value);
    // console.log(input.selectionStart);
    // console.log(input.selectionEnd);
    let currentValue: any = input.value;
    let key: any = event.key;
    let keyCode: any = event.keyCode;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const ultimoCaracter = currentValue.substr(-1);
    const lengthValue: number = currentValue.length;
    // console.log(currentValue.length);
    if(keyCode == 32 && selectionStart == 0){
      event.preventDefault();
    }

    if(keyCode == 32 && ultimoCaracter == ' ' && selectionEnd == lengthValue && selectionStart == lengthValue){
      event.preventDefault();
    }

    let nextCaracter = currentValue.substr(selectionStart, 1);
    let prevCaracter = currentValue.substr(selectionStart-1, 1);
    // console.log(currentValue.substr(selectionStart, 1));
    // console.log(prevCaracter);
    // console.log(nextCaracter);

    if(keyCode == 32 && (nextCaracter == ' ' || prevCaracter == ' ')){
      event.preventDefault();
    }

    // console.log(currentValue.indexOf('  '));
    input.value = currentValue.replace(/  /g, " ")
  }
}
