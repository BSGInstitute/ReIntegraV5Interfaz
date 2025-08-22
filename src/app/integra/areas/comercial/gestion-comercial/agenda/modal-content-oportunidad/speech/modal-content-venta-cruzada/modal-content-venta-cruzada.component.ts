import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { IAlumnoInformacion } from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { IValorEtiqueta } from '@integra/areas/comercial/models/interfaces/ivalor-etiqueta';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-content-venta-cruzada',
  templateUrl: './modal-content-venta-cruzada.component.html',
  styleUrls: ['./modal-content-venta-cruzada.component.scss']
})
export class ModalContentVentaCruzadaComponent implements OnInit {

  formVentaCruzada: FormGroup = this.formBuilder.group({
    idCentroCosto: [[]],
    horaContacto: [null],
    comentarioActividad: [null],
    asesor: [null],
    tipoDato: [null],
    origen: [null],
    faseOportunidad: [null],
    referido: [null],
  });
  @Input() agendaService: AgendaService;
  @Input() ocurrencia: any = null;
  listaCentroCostosFiltrado: any = [];
  listaCentroCostos: any = [];
  listaFaseOportunidad: any = [];
  listaTipoDato: any = [];
  horaContacto: any = {
    min: new Date(),
    format: 'dd-MM-yyyy HH:mm a',
  };
  objetoSetModo:any = {
    idTipoDato: null,
    tipoDato: null,
    idOrigen: null,
    origen: null,
    idFaseOportunidad: null,
    faseOportunidad: null
  }
  dataCentroCosto: any[] = []
  rowActual: IRowActual;
  opcionesVentaCruzada: any = {}
  datosAlumno: any = {}
  alumno: IAlumnoInformacion;
  showControlesReferido: boolean = false;
  subscriptions: Subscription = new Subscription();
  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal, private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.rowActual = this.agendaService.rowActual;
    this.agendaService.agendaVentaCruzadaService.loader = false
    this.initSubscribeObservables();
    this.nuevaOportunidadVentaCruzada();
  }
  nuevaOportunidadVentaCruzada() {
    this.horaContacto.min = new Date()
    this.formVentaCruzada.reset();
    this.opcionesVentaCruzada = {
      conservarTipoDatoOportunidadAnterior : false,
      controlesParaFinalizarActividad:true,
      enableCentroCosto : true,
      tipoDato: this.rowActual.idTipoDato,
      origen : this.rowActual.origen
    }
    this.datosAlumno = {
      pais : this.alumno.idCodigoPais,
        ciudad : this.alumno.idCiudad,
    }
    this.setModo(2);
    ;
  }
  setModo(modo: number) {
    switch (modo) {
      case 1: // REFERIDO
        // this.showControlesReferido = true;
        // url =
        //   'https://integrav4-servicios.bsginstitute.com/api/AgendaInformacionActividad/GetConfiguracionReferidos/';
        // $ButtonNew.show();
        break;
      case 2: // CONTACTO YA EXISTENTE
        this.showControlesReferido = false;
        this.agendaService.agendaVentaCruzadaService
          .obtenerConfiguracionContacto$()
          .subscribe({
            next: (resp: any) => {
              //  this.configuracionContacto = resp.body
              this.objetoSetModo = Object.assign(this.objetoSetModo, {
                idTipoDato: resp.body.idTipoDato,
                tipoDato: resp.body.descripcionTipoDato,
                origen: this.rowActual.origen,
                idFaseOportunidad: resp.body.idFaseOportunidad,
                faseOportunidad: resp.body.codigoFaseOportunidad
              })
              this.setValorestOportunidadForm();

            },
          });
        break;
    }
  }
  setValorestOportunidadForm(){
    this.dataCentroCosto = [{
      nombre: this.rowActual.centroCosto,
      id: this.rowActual.idCentroCosto,
    }];
    this.listaCentroCostosFiltrado = [{
      nombre: this.rowActual.centroCosto,
      id: this.rowActual.idCentroCosto,
    }];
    this.formVentaCruzada.get('idCentroCosto').setValue([this.rowActual.idCentroCosto]);
    this.formVentaCruzada.get('asesor').setValue(this.rowActual.asesor);

    if(this.opcionesVentaCruzada.conservarTipoDatoOportunidadAnterior){
      // this.formVentaCruzada.get('tipoDato').setValue(this.objetoSetModo.idTipoDato);
      // var s = $tipoDato.value();
      //       if (s.length !== 36) {
      //           alert("Error en el Sistema al seleccionar un Tipo de Dato!, Consulte con soporte");
      //           return;
      //       }
    }else{
      this.formVentaCruzada.get('tipoDato').setValue(5);

    }
    this.formVentaCruzada.get('origen').setValue(this.objetoSetModo.origen);
    this.formVentaCruzada.get('faseOportunidad').setValue(this.objetoSetModo.idFaseOportunidad);
    this.formVentaCruzada.get('referido').setValue(this.rowActual.contacto);
    this.formVentaCruzada.get('horaContacto').setValue(new Date());
  }
  filterCentroCosto(value:any){
    let itemSeleccionados = this.formVentaCruzada.get('idCentroCosto').value.length;
    if(value.length >= 4 && itemSeleccionados < 1){
      this.listaCentroCostosFiltrado = this.listaCentroCostos.filter(
        (e:any) => e.nombre.toLowerCase().includes(value.toLowerCase())
      )
    } else {
      this.listaCentroCostosFiltrado = [];
    }
  }
  realizarVentaCruzada() {
    let dataForm = this.formVentaCruzada.getRawValue();
    let obj: any = {
      idPersonalAsignado: this.rowActual.idPersonal_Asignado,
      idTipoDato: dataForm.tipoDato,
      idFaseOportunidad: dataForm.faseOportunidad,
      idOrigen: this.objetoSetModo.idOrigen,
      // idOrigen: 135,
      idAlumno: this.rowActual.idAlumno,
      ultimaFechaProgramada: null,
      // ultimaFechaProgramada: dataForm.horaContacto,
      idCentroCosto: 0,
      ultimoComentario: 'Sin Comentario',
      idContacto: this.rowActual.idAlumno,
      idTipoInteraccion: 17, // Formulario Enviado Completo
      idSubCategoriaDato: this.rowActual.idSubCategoriaDato,
    }
    if(dataForm.idCentroCosto == null || dataForm.idCentroCosto.length == 0) {
      obj.idCentroCosto = this.rowActual.idCentroCosto
    }else{
      obj.idCentroCosto = dataForm.idCentroCosto[0];
    }
    if (
      this.ocurrencia == null &&
      obj.idCentroCosto == 0
    ) {
      alert('Seleccione un centro de costo');
      return;
    }
    this.agendaService.agendaVentaCruzadaService.RealizarVentaCruzada(
      obj, this.ocurrencia
    );
  }
  initSubscribeObservables(){
    this.agendaService.agendaActividadesService.respValorEtiqueta$.subscribe({
      next: (resp: IValorEtiqueta) => {
          this.objetoSetModo.idOrigen = resp.datosOportunidad.idOrigen;
      }
    });
    this.agendaService.agendaAlumnoService.alumno$.subscribe({
      next: (resp: IAlumnoInformacion) => {
        if (resp != null) {
          this.alumno = resp;
        }
      },
    });
    this.agendaService.agendaVentaCruzadaService.dataCentroCosto$.subscribe({
      next: (resp: any) => {
        this.listaCentroCostos = resp;
      },
    });
    this.agendaService.agendaVentaCruzadaService.dataFaseOportunidad$.subscribe(
      {
        next: (resp: any) => {
          this.listaFaseOportunidad = resp;
        },
      }
    );
    this.agendaService.agendaVentaCruzadaService.dataTipoDato$.subscribe({
      next: (resp) => {
        this.listaTipoDato = resp;
      },
    });
  }
}
