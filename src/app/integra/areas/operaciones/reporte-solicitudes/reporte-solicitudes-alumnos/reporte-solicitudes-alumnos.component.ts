import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiGestionPersonal, constApiGlobal, constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings, DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { IFiltroEnvioSolicitudAlumnos, IFormReporteSolicitudAlumnos } from '@operaciones/models/interfaces/isolicitud-alumnos';
import { ReporteSolicitudAlumnos } from '@integra/models/reporte-solicitud-alumno';

@Component({
  selector: 'app-reporte-solicitudes-alumnos',
  templateUrl: './reporte-solicitudes-alumnos.component.html',
  styleUrls: ['./reporte-solicitudes-alumnos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ReporteSolicitudesAlumnosComponent implements OnInit {
  @ViewChild('alumno')alumno: DropDownListComponent;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private userService: UserService
  ) {}

  virtual = {
    itemHeight: 28,
  };

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains"
  };

  listaItemsEstados: any;
  listaItemsSolicitante: IComboBase1 []=[];
  listaItemsOrigen: IComboBase1 []=[];
  listaItemsAreaSolucion: IComboBase1[]=[];
  listaItemsPersonalSolucion: any []=[];
  selectedArea: number[] = [];
  selectedPersonal: number[] = [];
  idMatriculaCabecera:any =0;
  idMatriculaCabeceraAlumno:any;
  dataContenido: any;
  idPersonal: any;
  busquedaNombre: boolean = false;
  listaPrograma: any;
  disabledDatoBusqueda: boolean = true;
  disabledPersonalSolucion: boolean = true;
  listaMatricula: any[] = [];
  sourceContacto: { id: number; nombreCompleto: string }[] = [];
  dataContacto: { id: number; nombreCompleto: string }[] = [];
  tipoBusquedaSelect: any=null;
  datoAlumno: string = "";
  loading: boolean = false;
  loaderGrid:boolean=false;
  gridDataSolicitudAlumno:any;
  listaReporteSolicitudAlumnos: ReporteSolicitudAlumnos[] = [];

  formFiltro: FormGroup = this.formBuilder.group({
    tipoBusqueda: [""],
    dataBusqueda: ["", [Validators.required]],
    alumno:[[]],
    estados: [[]],
    solicitantes: [[]],
    origenes: [[]],
    areasSolucion: [[]],
    personalSolucion: [[]],
    fechaInicio: [],
    fechaFin: [],
  });

  listaItemsDataBusqueda: any[] = [
    { id: "CODIGO", nombre: "Código" },
    { id: "CORREO", nombre: "Correo Electrónico" },
    { id: "DNI", nombre: "Nro Documento" },
    { id: "NOMBRES", nombre: "Apellidos y Nombres" },
    { id: "CELULAR", nombre: "Número Teléfono" }
  ];

  idAreasExcluidas = [1,11,21,7,6];

  idPersonalExcluido = [
    3695, 3802, 3803, 3806, 3807, 3808, 3809, 3883, 3899, 3904, 3906, 4435, 4538, 4539, 4541, 
    4560, 4561, 4562, 4563, 4750, 4752, 5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180, 5181, 
    5182, 5183, 5184, 5185, 5186, 5187, 5188, 5495, 5496, 5498, 5528, 5529, 5537, 5538, 5539, 
    5548, 5549, 5556, 5344, 5345, 5493, 5502, 5503, 5637, 5638, 5639, 5640, 5811
  ];

  ngOnInit(): void {
    console.log("grid aqui")
    this.idPersonal = this.userService.userData.idPersonal;

    this.integraService
      .obtenerTodo(constApiGlobal.PersonalObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.dataContenido = response.body;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });

    this.integraService
      .obtenerTodo(constApiOperaciones.ObtenerEstadosSolicitud)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaItemsEstados = response.body;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
    this.obtenerSolicitanteCombo();
    this.obtenerOrigenCombo();
    this.obtenerAreaCombo();
  }

   /**
   * @description Retorna los datos del formulario
   * @return {IFormReporte} IFormReporte
   */

  get dataFormFiltro(): IFormReporteSolicitudAlumnos {
    return this.formFiltro.getRawValue() as IFormReporteSolicitudAlumnos;
  }
  
  obtenerSolicitanteCombo(): void {
    this.integraService.obtenerTodo(constApiOperaciones.ObtenerPersonalSolicitanteAlumno)
    .subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaItemsSolicitante = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerOrigenCombo(): void {
    this.integraService.obtenerTodo(constApiOperaciones.ObtenerControlSolicitudOrigen)
    .subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaItemsOrigen = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerAreaCombo(){
    this.integraService.obtenerTodo(constApiGestionPersonal.PersonalAreaTrabajoObtenerCombo)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaItemsAreaSolucion = response.body.filter((item: any) =>
        !this.idAreasExcluidas.includes(item.id));
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  onValueChangeAreaSolucion(event:any[]): void {
    this.habilitaControlPersonalSolucion(event);
    this.integraService.post(constApiOperaciones.ObtenerPersonalSolucionSolicitudAlumno, event, null)
    .subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaItemsPersonalSolucion = response.body.filter((item: any) =>
        !this.idPersonalExcluido.includes(item.idPersonal));
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
    this.eliminaItemsPersonalSolucionSeleccionados();
  }
  
  habilitaControlPersonalSolucion(event:any[]){
    if (event.length > 0) {
      this.disabledPersonalSolucion = false;
    }else{
      this.disabledPersonalSolucion = true;
    }
  }

  eliminaItemsPersonalSolucionSeleccionados(){
    this.selectedPersonal = this.selectedPersonal.filter(personalId => {
      const personal = this.listaItemsPersonalSolucion.find(p => p.id === personalId);
      return personal && this.selectedArea.includes(personal.idAreaPersonal);
    });
  }

  mostrarMensajeError(error: any): void {
    this.loading = false;
    Swal.fire({
      icon: "error",
      html: `<p class="text-start">${error.error}</p>
          <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    });
  }

  tipoBusquedaChange(e: any) {
    this.idMatriculaCabeceraAlumno=null;
    this.formFiltro.get("dataBusqueda").setValue("");
    if (e === "CORREO" || e === "DNI" || e === "CODIGO" || e==="CELULAR") {
      this.disabledDatoBusqueda = false;
      this.busquedaNombre = false;
    } else if (e === "NOMBRES") {
      this.formFiltro.get("alumno").setValue(null);
      this.busquedaNombre = true;
    } else {
      this.disabledDatoBusqueda = true;
      this.busquedaNombre=false;
    }
  }
  
  filterContacto(value: string) {
    if (value.length >= 3) {
      this.alumno.loading = true;
      this.integraService
      .postJsonResponse(constApiOperaciones.ObtenerAlumnoPorValor, {valor: value})
      .subscribe({
          next: (resp) => {
            this.alumno.loading = false;
            this.sourceContacto = resp.body.slice();
            this.dataContacto = resp.body.slice();
          },
        });
    } else if (value.length >= 1) {
      this.dataContacto = [];
    } else {
      this.dataContacto = this.sourceContacto;
      this.alumno.toggle(false);
    }
  }
  
  CargarDataAlumno(event: any) {
    if (typeof event == "object") {
      if (typeof event.id == "number" && event.id != -1) {
        this.ObtenerCodigoMatriculaPEspecificoPorAlumnos(event.id);
      }
    }
  }

  ObtenerCodigoMatriculaPEspecificoPorAlumnos(idAlumno: number) {
    this.loading = true;
    this.integraService
      .getJsonResponse(
      constApiOperaciones.ObtenerCodigoMatriculaPEspecificoPorAlumnos + "/" + idAlumno)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          if (response.body.length > 0) {
            this.listaMatricula = [];
            this.listaPrograma = [];
            var i = 0;
            let params: any = [
              { clave: "valor", valor: response.body[0].codigoMatricula }
            ];
            this.loading = false;
            this.integraService
              .obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorCodigo, params)
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  if (response.body != null) {
                    this.idMatriculaCabecera=response.body.id
                    this.idMatriculaCabeceraAlumno=response.body.id;
                    this.loading = false;
                  } else {
                    Swal.fire(
                      "Error!",
                      "No se encontraron datos asociados.",
                      "warning"
                    );
                    this.loading = false;
                  }
                },
                error: error => {
                  this.mostrarMensajeError(error);
                },
                complete: () => {}
              });
          } else {
            Swal.fire(
              "Error!",
              "No se encontraron datos asociados.",
              "warning"
            );
            this.loading = false;
          }
        },
        error: error => {
          this.mostrarMensajeError("Programa-código matrícula");
        },
        complete: () => {}
      });
  }

  buscarSolicitudesAlumnos() {
    // this.loading = true;
    this.loaderGrid=true
    this.idMatriculaCabecera=0;
    this.gridDataSolicitudAlumno = [];
    this.listaReporteSolicitudAlumnos = [];
    if(this.tipoBusquedaSelect!=null){
      switch (this.tipoBusquedaSelect) {
        case "CODIGO":
            if (this.datoAlumno !== "") {
              let params: any = [{ clave: "valor", valor: this.datoAlumno }];
              this.integraService
                .obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorCodigo, params)
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    if (response.body != null) {
                      this.idMatriculaCabecera=response.body.id
                      this.buscarReporteSolicitudesAlumno(response.body.id)
                      this.loading=false;
                    } else {
                      Swal.fire(
                        "Error!",
                        "No se encontraron datos asociados.",
                        "warning"
                      );
                      this.loading=false;
                    }
                  },
                  error: error => {
                    this.mostrarMensajeError(error);
                  },
                  complete: () => {}
                });
            } else {
                Swal.fire("Alerta!", "Ingrese un código de matrícula.", "warning");
                this.loading = false;
            }
            break;
        case "CORREO":
            if (this.datoAlumno !== "") {
              let params: any = [{ clave: "valor", valor: this.datoAlumno }];
              this.integraService
                .obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorCorreo, params)
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    if (response.body != null) {
                      this.idMatriculaCabecera=response.body.idMatriculaCabecera
                      this.buscarReporteSolicitudesAlumno(response.body.idMatriculaCabecera)
                      this.loading = false;
                    } else {
                      Swal.fire(
                        "Error!",
                        "No se encontraron datos asociados.",
                        "warning"
                      );
                      this.loading=false;
                    }
                  },
                  error: error => {
                    this.mostrarMensajeError(error);
                  },
                  complete: () => {}
                });
            } else {
                Swal.fire("Alerta!", "Ingrese un correo de alumno.", "warning");
                this.loading = false;
            }
            break;
        case "DNI":
            if (this.datoAlumno !== "") {
              let params: any = [{ clave: "valor", valor: this.datoAlumno }];
              this.integraService
                .obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorDNI, params)
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    console.log(response.body);
                    if (response.body != null) {
                      this.idMatriculaCabecera=response.body.idMatriculaCabecera
                      this.buscarReporteSolicitudesAlumno(response.body.idMatriculaCabecera)
                      this.loading = false;
                    } else {
                      Swal.fire(
                        "Alerta!",
                        "No se encontraron datos asociados.",
                        "warning"
                      );
                      this.loading=false;
                    }
                  },
                  error: error => {
                    this.mostrarMensajeError(error);
                  },
                  complete: () => {}
                });
            } else {
                Swal.fire("Alerta!", "Ingrese un número de documento.", "warning");
                this.loading = false;
            }
            break;
        case "CELULAR":
            if (this.datoAlumno !== "") {
              this.integraService
              .postJsonResponse(constApiOperaciones.ObtenerMatriculaPorCelular, { Valor: this.datoAlumno })
              .subscribe({
                next: response => {
                  if(response.body!=null){
                    this.listaMatricula = response.body;
                    this.idMatriculaCabecera=response.body.idMatriculaCabecera
                    this.buscarReporteSolicitudesAlumno(response.body.idMatriculaCabecera)
                    this.loading=false;
                  }
                  else{
                    Swal.fire("Alerta!", "No se encontraron datos asociados", "warning");
                    this.loading = false;
                  }
                },
                error: error => {
                  Swal.fire("Alerta!", "No se encontraron datos asociados", "warning");
                  this.loading = false;
                },
                complete: () => {}
              });
            } else {
                Swal.fire("Alerta!", "Ingrese un número de celular.", "warning");
                this.loading = false;
            }
            break;
        case "NOMBRES":
            if (this.idMatriculaCabeceraAlumno != null) {
              this.buscarReporteSolicitudesAlumno(this.idMatriculaCabeceraAlumno)
              this.loading=false
            } else {
                Swal.fire("Error!", "Debe ingresar un dato del alumno.", "warning");
                this.loading = false;
            }
            break;
        default:
            Swal.fire("Alerta!", "Seleccione un tipo de búsqueda válido.", "warning");
            this.loading = false;
            break;
      }
    }
    else {
      this.buscarReporteSolicitudesAlumno(0)
      this.loading=false;
    }
  }

  buscarReporteSolicitudesAlumno(idMatriculaCabecera :any){
    this.idMatriculaCabecera=idMatriculaCabecera;
    const filtro: IFiltroEnvioSolicitudAlumnos = {
      idMatriculaCabecera: idMatriculaCabecera,
      idEstadoSolicitud: this.dataFormFiltro.estados,
      idSolicitante: this.dataFormFiltro.solicitantes,
      idOrigen: this.dataFormFiltro.origenes,
      idAreaSolucion: this.dataFormFiltro.areasSolucion,
      idPersonalSolucion: this.dataFormFiltro.personalSolucion,
      fechaInicio: this.dataFormFiltro.fechaInicio,
      fechaFin: this.dataFormFiltro.fechaFin
    };
    if(new Date(filtro.fechaFin) < new Date(filtro.fechaInicio)){
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido'
      });
      return;
    }
    this.integraService
      .obtenerPorFiltro(constApiOperaciones.obtenerReporteSolicitudesPorFiltroAlumno, filtro)
      .subscribe({
        next: (response: any) => {
          if (response != null) {
            this.gridDataSolicitudAlumno=response.body;
            this.listaReporteSolicitudAlumnos=response.body;
            this.alertaService.mensajeExitosoCarga();
            if(this.gridDataSolicitudAlumno.length<=0){
              Swal.fire("Exito!", "No se encontraron  registros", "success");
              
            }
          }
          this.loaderGrid=false;
        },
      });
  }
}