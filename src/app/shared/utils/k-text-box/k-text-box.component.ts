import { Component, OnInit, ViewChild, Input, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { Orientation } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'k-text-box',
  templateUrl: './k-text-box.component.html',
  styleUrls: ['./k-text-box.component.scss']
})
export class KTextBoxComponent implements OnInit{

  public form: FormGroup;
  constructor(public controlContainer: ControlContainer) { }


  @Input() control: FormControl;
  @Input() focusTex: any;
  @Input() label: HTMLLabelElement;

  @Input() textLabel: any = 'TextLabel';
  @Input() name: any = 'TextLabel';
  @Input() id: any = 'TextLabel';
  @Input() tipo: any = 'text';
  @Input() size: any = 'small';
  @Input() clearButton: boolean=true;
  @Input() required: boolean=true;
  @Input() orientation: Orientation = 'vertical';
  @Input() eye: boolean = true;
  @Input() errorMsj: boolean = true;
  @Input() hintMsj: boolean = true;

  @ViewChild("password", {static: false}) password: any;
  @ViewChild("textbox") text: any;
  public events: string[] = [];
  ngOnInit(): void {
    console.log(this.control);
  }

  public ngAfterViewInit(): void {
    if(this.tipo=='password'){
      this.password.input.nativeElement.type = "password";
    }
  }

  OnChangeInput(control: any){
    console.log(control);
  }

  toggleVisibility(){
    console.log(this.password)
    const inputEl = this.password.input.nativeElement;
    inputEl.type = inputEl.type === "password" ? "text" : "password";
    // const inputEl = this.textbox.input.nativeElement;
    // inputEl.type = inputEl.type === "password" ? "text" : "password";
  }

  public onChange(value: string): void {
    this.log(`valueChange ${value}`);
  }

  public onFocus(): void {
    this.log("TextBox is focused");
  }

  public onBlur(): void {
    this.log("TextBox is blurred");
  }

  public inputFocus(): void {
    this.log("Input Element is focused");
  }

  public inputBlur(): void {
    this.log("Input Element is blurred");
  }

  private log(event: string): void {
    this.events.unshift(`${event}`);
  }
}
