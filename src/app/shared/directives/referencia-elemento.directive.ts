import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[refElement]',
  exportAs: "refElement",
})
export class ReferenciaElementoDirective {

  constructor(public element: ElementRef) { }

}
