import { HttpResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiGlobal, constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { IntegraService } from '@shared/services/integra.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { GridPersonal } from './grid-personal';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})

export class PersonalComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private modalService: NgbModal
  ) {}

  public formGroup: FormGroup;
  formGroupPersonal: FormGroup = this.formBuilder.group({
    id: [0],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    idArea: ['', Validators.required],
    tipoPersonal: ['', Validators.required],
    email: ['', Validators.email],
    activo: [false, Validators.required],
    anexo: ['', Validators.required],
    central: ['', Validators.required],
    idJefe: ['', Validators.required],
    idFOP: ['', Validators.required],
    claveFOP: ['', Validators.required],
    claveAplicacion: ['', Validators.required],
  });;

  public listItems: Array<string> = [
    "Baseball",
    "Basketball",
    "Cricket",
    "Field Hockey",
    "Football",
    "Table Tennis",
    "Tennis",
    "Volleyball",
  ];

  public mask: string = "0000-0000-0000-0000";
  public cvcMask: string = "000";
  textFocus: any;
  loader: boolean = false;

  public submitForm(): void {
    console.log(this.formGroupPersonal.getRawValue());
    // this.formGroupPersonal.markAllAsTouched();
  }

  public clearForm(): void {
    this.formGroupPersonal.reset();
  }

  public removeConfirmationSubject: Subject<boolean> = new Subject<boolean>();
  public itemToRemove: any;

  public formGroupData: FormGroup = this.formBuilder.group({
    id: [0],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
  });

  public personalArray: any[] = [];

  gridPersonal = new GridPersonal();

  @ViewChild('template', { read: TemplateRef })
  public notificationTemplate: TemplateRef<unknown>;
  @ViewChild('appendTo', { read: ViewContainerRef, static: false })
  public appendTo: ViewContainerRef;
  @ViewChild('modalDatosPersonal') modalDatosPersonal: any;
  @ViewChild('modalHorario') modalHorario: any;
  // @ViewChild("myModalInfo", {static: false}) myModalInfo: TemplateRef<any>;

  public ngAfterViewInit(): void {
    // this.textbox.input.nativeElement.type = "password";
    console.log(this.modalDatosPersonal);
    // this.modalData.changes.subscribe((comps: QueryList<any>) =>
    //     {
    //         console.log(comps)
    //     });
  }

  getControlFormPersonal(campo: string){
    return this.formGroupPersonal.get(campo) as FormControl;
  }
  ngOnInit(): void {
    this.loader = true;
    this.integraService
      .obtenerTodo(constApiGlobal.PersonalObtenerPersonal)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.personalArray = response.body;
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  guardar(param: any) {
    this.loader = true;
    let areaTrabajo = this.procesarData(param, true);
    this.integraService
      .insertar(constApiPlanificacion.AreaTrabajoInsertar, areaTrabajo)
      .subscribe({
        next: (res) => {
          console.log(res);
          areaTrabajo = {
            id: res.body.id,
            nombre: res.body.nombre,
            estado: res.body.estado,
            fechaCreacion: res.body.fechaCreacion,
            fechaModificacion: res.body.fechaModificacion,
            usuarioCreacion: res.body.usuarioCreacion,
            usuarioModificacion: res.body.usuarioModificacion,
          };
          this.personalArray.splice(0, 0, areaTrabajo);
          this.personalArray = this.personalArray.slice();
          this.loader = false;
          this.showSuccess();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  procesarData(dataItem: any, isNew: boolean) {
    let areaTrabajo = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      estado: true,
      fechaCreacion: isNew ? new Date() : dataItem.fechaCreacion,
      fechaModificacion: new Date(),
      usuarioCreacion: isNew ? 'flavio' : dataItem.usuarioCreacion,
      usuarioModificacion: 'flavio',
    };
    return areaTrabajo;
  }

  editar(param: any, index: number) {
    this.loader = true;
    this.personalArray[index].nombre = param.nombre;
    // this.areaTrabajoArray[index].nombre = param.nombre;
    // let areaTrabajo = this.areaTrabajoArray.find(e => e.id == param.id);
    let areaTrabajo = this.procesarData(this.personalArray[index], false);
    this.integraService
      .actualizar(constApiPlanificacion.AreaTrabajoActualizar, areaTrabajo)
      .subscribe({
        next: (response) => {
          this.personalArray[index].nombre = param.nombre;
          this.loader = false;
          this.showSuccess();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  public showSuccess(): void {
    this.notificationService.show({
      appendTo: this.appendTo,
      content: this.notificationTemplate,
      hideAfter: 1000,
      position: { horizontal: 'center', vertical: 'bottom' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'success', icon: true },
    });
  }

  eliminarPersonal(data: any){
    console.log(data);
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, bórralo!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
      } else {
        Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
      }
    });
  }

  openModalDatosPersonal(isNew: boolean, data: any){
    console.log(data);
    // this.textbox.input.nativeElement.type = "password";
    // --'lg'
    if (!isNew) {
      this.formGroupPersonal.patchValue(data);
    } else {
      this.formGroupPersonal.reset();
    }
    // this.modalService.open(this.modalDatosPersonal, { size: 'lg' });
    this.modalService.open(this.modalDatosPersonal);
  }
  openModalHorario(){
    this.modalService.open(this.modalHorario);
  }

  gridEventsResponse(e: any): void {
    console.log(e)
    switch (e.action) {
      case 'edit':
        this.openModalDatosPersonal(false, e.data);
        break;
      case 'add':
        this.openModalDatosPersonal(true, e.data);
        break;
      case 'mostrarhorario':
        this.openModalHorario();
        break;
    }
  }
}
