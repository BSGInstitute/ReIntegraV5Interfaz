import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  constApiFinanzas,
  constApiGestionPersonal,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { nivelDeSegmentacion } from '@integra/models/filtroCampania';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Event } from 'jquery';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { AgregarPlantillaConjuntoListaComponent } from './agregar-plantilla-conjunto-lista/agregar-plantilla-conjunto-lista.component';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-actividad-automatica',
  templateUrl: './actividad-automatica.component.html',
  styleUrls: ['./actividad-automatica.component.scss'],
})
export class ActividadAutomaticaComponent implements OnInit {
  @ViewChild('modalActividad') modalActividad: any;
  @ViewChild('modalWhats') modalWhats: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private dialog: MatDialog
  ) {
    this.checkOneControl = new FormControl(false);
    this.checkTwoControl = new FormControl(false);
  }

  loading: any;
  dataSourceEP: any = [];
  listaActividad: any = [];
  listaArea: any = [];
  listaConjunto: any = [];
  formulario: FormGroup;
  ListaActiviidadBase: any = [];
  listaConjuntoLista: any = [];
  listaFrecuencia: any = [];
  listaPersonalAreaTrabajo: any = [];
  listaDiasSemana: any = [];
  interval: any = { hour: 1, minute: 30 };
  checkOne: any = false;
  checkTwo: any = false;
  checkOneControl: FormControl;
  checkTwoControl: FormControl;
  actividadB: any = 0;
  frecuencia: any = 0;
  listaPlantillasSpeech: any = [];
  listaPlantillasSpeechDespedida: any = [];
  listaCategoria: any = [];
  nombreSeleccionado: any;
  actividadlista: any = [];
  listaDias: any = [];
  idsDias: any = [];
  semanaControl: FormControl;
  actualizar: any;
  nombreActividadBase: any;
  enviar:any = false

  tiempo = [
    { id: 1, nombre: 'Minuto' },
    { id: 2, nombre: 'Hora' },
  ];

  ngOnInit(): void {
    this.ObtenerEnvios();
    this.ObtenerActividadesBaseMasivo();
    this.ObtenerComboConjuntoLista();
    this.ObtenerListaFrecuenciaActividad();
    this.ObtenerArea();
    this.ObtenerDiaSemana();
    this.ObtenerAllPlantillaSpeechDespedida();
    this.ObtenerPlantillasSpeech();
    this.CategoriaOrigenObtenerCombo();

    this.formulario = this.formBuilder.group({
      nombre: [null, Validators.required],
      descripcion: [null, Validators.required],
      actividadCabecera: [null, Validators.required],
      area: [null, Validators.required],
      conjuntoLista: [null, Validators.required],
      frecuencia: [''],
      semana: [null],
      horaIn: [null],
      horaFin: [null],
      veces: [null],
      horaUn: [null],
      tipofor: [null],
      checkOne: this.checkOneControl,
      checkTwo: this.checkTwoControl,
      fechaInicioActividad: [''],
      fechaFinActividad: [''],
      duracion: [''],
      llamadas: [''],
      speech: [''],
      speechDespe: [''],
      manual: [false],
      automatica: [false],
      validaLlamada: [false],
      categoria: [''],
      mes: [''],
      plantilla: [''],
    });
  }

  ObtenerActividadesBaseMasivo() {
    this.integraService
      .obtener(constApiMarketing.ObtenerActividadesBaseMasivo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.ListaActiviidadBase = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerListaFrecuenciaActividad() {
    this.integraService
      .obtener(constApiMarketing.ObtenerListaFrecuenciaActividad)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaFrecuencia = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerComboConjuntoLista() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerComboConjuntoLista}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaConjuntoLista = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerArea() {
    this.integraService
      .getJsonResponse(`${constApiGestionPersonal.PersonalAreaTrabajoObtenerCombo}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPersonalAreaTrabajo = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerDiaSemana() {
    this.integraService
      .getJsonResponse(`${constApiFinanzas.PanelDisponibleObtenerDiaSemana}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaDiasSemana = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerEnvios() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerActividadCabeceraEnviosMasivos}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.dataSourceEP = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerPlantillasSpeech() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerPlantillasSpeech}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantillasSpeech = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerAllPlantillaSpeechDespedida() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerAllPlantillaSpeechDespedida}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantillasSpeechDespedida = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  CategoriaOrigenObtenerCombo() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.CategoriaOrigenObtenerCombo}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaCategoria = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerActividadDiaPorID(idActividadCabecera: number) {
    this.idsDias = [];
    this.integraService
      .obtener(
        `${
          constApiMarketing.ObtenerActividadDiaPorID + '/' + idActividadCabecera
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaDias = response.body;
          console.log(response.body);
          this.listaDias.forEach((e: any) => {
            this.idsDias.push(e.idDiaSemana);
          });

          this.semanaControl = new FormControl(this.idsDias);
          this.formulario.get('semana').patchValue(this.idsDias);

          console.log(this.idsDias);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObteneActividadCabecerarPorId(idActividadCabecera: number) {
    this.integraService
      .obtener(
        `${
          constApiMarketing.ObteneActividadCabecerarPorId +
          '/' +
          idActividadCabecera
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.actividadlista = response.body[0];

          const horaInicioFormateada = moment(
            this.actividadlista.horaInicio,
            'HH:mm'
          ).toDate();
          const horaFinFormateada = moment(
            this.actividadlista.horaFin,
            'HH:mm'
          ).toDate();

          this.formulario.patchValue({
            nombre: this.actividadlista.nombre,
            descripcion: this.actividadlista.descripcion,
            area: this.actividadlista.idPersonalAreaTrabajo,
            actividadCabecera: this.actividadlista.idActividadBase,
            conjuntoLista: this.actividadlista.idConjuntoLista,
            frecuencia: this.actividadlista.idFrecuencia,
            fechaInicioActividad: new Date(
              this.actividadlista.fechaInicioActividad
            ),
            fechaFinActividad: new Date(this.actividadlista.fechaFinActividad),
            horaFin: horaFinFormateada,
            tipofor: this.actividadlista.idTiempoIntervalo,
            validaLlamada: this.actividadlista.validaLlamada,
            mes: this.actividadlista.diaFrecuenciaMensual
          });

          if (
            this.actividadlista.cantidadIntevaloTiempo == null ||
            this.actividadlista.cantidadIntevaloTiempo == 0
          ) {
            this.checkOneControl.patchValue(true);
            this.checkTwoControl.patchValue(false);
            this.formulario.get('horaUn').patchValue(horaInicioFormateada);
            this.formulario.get('horaIn').patchValue(null);
            this.formulario.get('horaFin').patchValue(null);
            this.formulario.get('veces').patchValue(null);
          } else {
            this.checkTwoControl.patchValue(true);
            this.checkOneControl.patchValue(false);
            this.formulario.get('horaIn').patchValue(horaInicioFormateada);
            this.formulario.get('horaUn').patchValue(null);
            this.formulario
              .get('veces')
              .patchValue(this.actividadlista.cantidadIntevaloTiempo);
          }

          (this.actividadB = this.actividadlista.idActividadBase),
            (this.frecuencia = this.actividadlista.idFrecuencia);

          this.nombreSeleccionado = this.ListaActiviidadBase.find(
            (objeto: any) => objeto.id === this.actividadB
          ).nombre;
          this.ObtenerActividadDiaPorID(idActividadCabecera);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ReanudarEnvioAutomatico(idConjuntoLista: number) {
    this.integraService
      .post(
        `${constApiMarketing.ReanudarEnvioAutomatico + '/' + idConjuntoLista}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.actividadlista = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  abrirModal(validar: boolean, data?: any) {
    this.actualizar = validar;
    this.enviar= false
    this.formulario.reset();
    if (validar == true) {
      this.dialog.open(this.modalActividad);
    } else {
      this.ObteneActividadCabecerarPorId(data.id);
      this.dialog.open(this.modalActividad);
    }
  }

  abrirmodalWhats() {
    this.dialog.open(this.modalWhats);
  }

  cerrarModal() {
    this.formulario.reset();
    this.dialog.closeAll();
  }

  //------------------ Insertar -------------------------//

  guardar() {
    if (this.checkOneControl.value == true) {
      var horaInicio = this.formulario.get('horaUn')?.value;
    } else {
      var horaInicio = this.formulario.get('horaIn')?.value;
    }
    const horaFin = this.formulario.get('horaFin')?.value;

    const fechaInicioActividad = this.formulario.get(
      'fechaInicioActividad'
    )?.value;
    const fechaFinActividad = this.formulario.get('fechaFinActividad')?.value;

    var actividadCabeceraMasivoDTO = {
      Id: 0,
      Nombre: this.formulario.get('nombre')?.value,
      Descripcion: this.formulario.get('descripcion')?.value,
      IdActividadBase: this.formulario.get('actividadCabecera')?.value,
      IdConjuntoLista: this.formulario.get('conjuntoLista')?.value,
      IdFrecuencia: this.formulario.get('frecuencia')?.value,
      FechaInicioActividad: fechaInicioActividad
        ? new Date(
            fechaInicioActividad.getFullYear(),
            fechaInicioActividad.getMonth(),
            fechaInicioActividad.getDate()
          )
        : null,
      FechaFinActividad: fechaFinActividad
        ? new Date(
            fechaFinActividad.getFullYear(),
            fechaFinActividad.getMonth(),
            fechaFinActividad.getDate()
          )
        : null,
      DiaFrecuenciaMensual: this.formulario.get('mes')?.value
        ? this.formulario.get('mes')?.value
        : null,
      EsRepetitivo: this.formulario.get('checkOneControl')?.value,
      HoraInicio: horaInicio
        ? `${horaInicio.getHours().toString().padStart(2, '0')}:${horaInicio
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${horaInicio
            .getSeconds()
            .toString()
            .padStart(2, '0')}`
        : null,
      HoraFin: horaFin
        ? `${horaFin.getHours().toString().padStart(2, '0')}:${horaFin
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${horaFin
            .getSeconds()
            .toString()
            .padStart(2, '0')}`
        : null,
      CantidadIntevaloTiempo: this.formulario.get('veces')?.value
        ? this.formulario.get('veces')?.value
        : 0,
      IdTiempoIntervalo: this.formulario.get('tipofor')?.value,
      Activo: false,
      Semanal: this.formulario.get('semana')?.value
        ? this.formulario.get('semana')?.value
        : [],
      IdPersonalAreaTrabajo: this.formulario.get('area')?.value,
      EsEnvioMasivo: true,
    };

    var actividadCabeceraCompuestoDTO = {
      Id: 0,
      Nombre: this.formulario.get('nombre')?.value,
      Descripcion: this.formulario.get('descripcion')?.value,
      FechaCreacion2: '2023-06-01T00:00:00',
      DuracionEstimada: this.formulario.get('duracion')?.value,
      ReproManual: this.formulario.get('manual')?.value,
      ReproAutomatica: true,
      Idplantilla: this.formulario.get('plantilla')?.value,
      IdActividadBase: this.formulario.get('actividadCabecera')?.value,
      FechaModificacion2: new Date(),
      ValidaLlamada: this.formulario.get('validaLlamada')?.value,
      IdPlantillaSpeech: this.formulario.get('speech')?.value,
      NumeroMaximoLlamadas: 5,
      Reprogramaciones: [0],
      TipoDato: [1, 2, 3], // Ejemplo de selección de tipos de datos
      Usuario: 'Usuario',
      IdPersonalAreaTrabajo: 1,
      EsEnvioMasivo: false,
    };

    var actividadCabeceraIndividualDTO = {
      Id: 0,
      Nombre: this.formulario.get('nombre')?.value,
      Descripcion: this.formulario.get('descripcion')?.value,
      IdActividadBase: this.formulario.get('actividadCabecera')?.value,
      IdPlantilla: this.formulario.get('actividadCabecera')?.value,
      IdPersonalAreaTrabajo: 1,
      EsEnvioMasivo: true,
    };
    var listaActividadDTO: {
      Id: number;
      ActividadCabeceraLlamada: any | null;
      ActividadCabeceraIndividual: any | null;
      ActividadCabeceraMasivo: any | null;
      ActividadBase: string;
      Usuario: string;
    };

    if (this.actividadB == 5 || this.actividadB == 7) {
      listaActividadDTO = {
        Id: 0,
        ActividadCabeceraLlamada: null,
        ActividadCabeceraIndividual: actividadCabeceraIndividualDTO,
        ActividadCabeceraMasivo: null,
        ActividadBase: this.nombreSeleccionado,
        Usuario: 'Usuario',
      };
    } else if (this.actividadB == 1) {
      listaActividadDTO = {
        Id: 0,
        ActividadCabeceraLlamada: actividadCabeceraCompuestoDTO,
        ActividadCabeceraIndividual: null,
        ActividadCabeceraMasivo: null,
        ActividadBase: this.nombreSeleccionado,
        Usuario: 'Usuario',
      };
    } else {
      listaActividadDTO = {
        Id: 0,
        ActividadCabeceraLlamada: null,
        ActividadCabeceraIndividual: null,
        ActividadCabeceraMasivo: actividadCabeceraMasivoDTO,
        ActividadBase: this.nombreSeleccionado,
        Usuario: 'Usuario',
      };
    }

    if (this.actualizar == true) {
      console.log(listaActividadDTO);

      this.integraService
        .postJsonResponse(
          constApiMarketing.InsertarActividadCabecera,
          listaActividadDTO
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
            Swal.fire('Success!', 'Se creo exitosamente', 'success');
            this.dialog.closeAll();
            this.ObtenerEnvios();
          },
          error: (error) => {
            console.log(error);
            this.cerrarModal();
            this.ObtenerEnvios();
          },
        });
    }

    if (this.actualizar == false) {
      console.log(listaActividadDTO);
      listaActividadDTO.Id = this.actividadlista.id
      if(listaActividadDTO.ActividadCabeceraMasivo.CantidadIntevaloTiempo == 0){
       listaActividadDTO.ActividadCabeceraMasivo.HoraFin = null
      }

      this.integraService
        .postJsonResponse(
          constApiMarketing.ActualizarActividadCabecera,
          listaActividadDTO
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
            Swal.fire('Success!', 'Se actualizo exitosamente', 'success');
            this.dialog.closeAll();
            this.ObtenerEnvios();
          },
          error: (error) => {
            console.log(error);
            this.cerrarModal();
            this.ObtenerEnvios();
          },
        });
    }
  }

  eliminarEnvio(data: any) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .post(
            `${
              constApiMarketing.EliminarActividadCabeceraReprogramacion +
              '/' +
              data.id
            }`
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              console.log(response.body);
              this.ObtenerEnvios();
              Swal.fire('Success!', 'Se elimino exitosamente', 'success');
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.ObtenerEnvios();
            },
          });
      }
    });
  }

  showOptionsOne(event: any): void {
    if (event.checked) {
      this.checkTwoControl.patchValue(false);
      this.formulario.get('horaUn')?.enable();
    } else {
      this.formulario.get('horaUn')?.disable();
    }

    setTimeout(() => {
      console.log(this.checkOneControl.value);
      console.log(this.checkTwoControl.value);
    });
  }

  showOptionsTwo(event: any): void {
    if (event.checked) {
      this.checkOneControl.patchValue(false);
      this.formulario.get('veces')?.enable();
      this.formulario.get('tipofor')?.enable();
    } else {
      this.formulario.get('veces')?.disable();
      this.formulario.get('tipofor')?.disable();
    }

    setTimeout(() => {
      console.log(this.checkOneControl.value);
      console.log(this.checkTwoControl.value);
    });
  }

  getSelectedOptions() {
    const selectedOptions = this.formulario.get('semana')?.value;
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedValues = this.listaDiasSemana
        .filter((opcion: any) => selectedOptions.includes(opcion.id))
        .map((opcion: any) => opcion.nombre);
      return selectedValues.join(', ');
    }
    return '';
  }

  getSelectedOptionsCategoria() {
    const selectedOptions = this.formulario.get('categoria')?.value;
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedValues = this.listaCategoria
        .filter((opcion: any) => selectedOptions.includes(opcion.id))
        .map((opcion: any) => opcion.nombre);
      return selectedValues.join(', ');
    }
    return '';
  }

  Sucede(e: any) {
    console.log(e);
    this.frecuencia = e.value;
  }

  Prueba(e: any) {
    console.log(e);
    this.actividadB = e.value;
    const selectedOption = e.source.selected as MatOption;
    this.nombreSeleccionado = selectedOption.viewValue;
  }

  Reanudar() {
    this.ReanudarEnvioAutomatico(this.formulario.get('conjuntoLista')?.value);
  }

  limpiarFormulario() {
    this.formulario.get('nombre')?.setValue(null);
  }

  openDialog() {

    if(this.formulario.get('conjuntoLista').value == null){
      Swal.fire('Error!', 'Seleccione un conjunto lista', 'error');
    }
    else{
    const dialogRef = this.dialog.open(AgregarPlantillaConjuntoListaComponent, {
      width: '1000px',
      maxHeight: '90vh',
      data: this.formulario.get('conjuntoLista').value,
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains",
  };

  public changeFilterOperator(operator: "startsWith" | "contains"): void {
    this.filterSettings.operator = operator;
  }


}
