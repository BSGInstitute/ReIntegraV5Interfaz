import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiComercial, constApiMarketing } from '@environments/constApi';
import { IRedChatCombos, IFaseOportunidad, IAreaFormacion, ITipoDato, IPaises, ICargo, IOrigenes, ICiudad, IIndustria, IAreaTrabajo, IAutocompleteCentroCosto, IAutocompletePaterno, IAutocompleteEmail, IRedChatFormulario } from '@integra/areas/comercial/models/interfaces/iagenda-redchat-modal';
import { ReproducirLlamadaService } from '@integra/services/reproducir-llamada.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-modal-edicion',
  templateUrl: './modal-edicion.component.html',
  styleUrls: ['./modal-edicion.component.scss']
})
export class ModalEdicionComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    public activeModal: NgbActiveModal,
    private reproducirLlamada:ReproducirLlamadaService,
    private formBuilder: FormBuilder) {}

    listaApellidoPaterno: IAutocompletePaterno[];
    listaCentroCosto: IAutocompleteCentroCosto[];
    listaFaseOportunidad: IFaseOportunidad[];
    listaAreaFormacion: IAreaFormacion[];
    listaAreaTrabajo: IAreaTrabajo[];
    listaEmail: IAutocompleteEmail[];
    listaCiudadFiltrada: ICiudad[];
    listaIndustria: IIndustria[];
    listaTipoDato: ITipoDato[];
    listaOrigen: IOrigenes[];
    listaCiudad: ICiudad[];
    listaCargo: ICargo[];
    listaPais: IPaises[];

  ngOnInit(): void {
    this.obtenerDatosFiltros()
    this.listaCiudadFiltrada = this.listaCiudad;
  }

  formFiltroIngresoAsesor: FormGroup = this.formBuilder.group({
    apellidoPaterno: '',
    apellidoMaterno: '',
    centroCosto: '',
    nombreUno: '',
    nombreDos: '',
    emailUno: '',
    celular: '',
    faseOportunidad: [],
    areaFormacion: [],
    areaTrabajo: [],
    industria: [],
    tipoDato: [],
    ciudad: [],
    cargo: [],
    pais: []
  });

  virtual:any = { itemHeight: 28 };
  obtenerDatosFiltros() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ChatControllerObtenerDatosComboContactoOportunidad}`
      ).subscribe({
        next: (response: HttpResponse<IRedChatCombos>) => {
          this.listaFaseOportunidad = response.body.faseOportunidades;
          this.listaAreaFormacion = response.body.areasFormacion;
          this.listaAreaTrabajo = response.body.areasTrabajo;
          this.listaTipoDato = response.body.tipoDatoChats;
          this.listaIndustria = response.body.industrias;
          this.listaCiudad = response.body.ciudades;
          this.listaCargo = response.body.cargos;
          this.listaPais = response.body.paises;
        },
      })
  }

  cambiarPais(dataItem:number) {
    this.formFiltroIngresoAsesor.get('ciudad').setValue(null)
    if(dataItem != undefined) {
      this.listaCiudadFiltrada = this.listaCiudad.filter((x:ICiudad) => x.idPais == dataItem)
    } else {
      this.listaCiudadFiltrada = this.listaCiudad;
    }
  }

  cambiarCiudad(dataItem:ICiudad) {
    // let idPais = this.formFiltroIngresoAsesor.get('ciudad').value;
    // this.listaCiudadFiltrada = this.listaCiudad.find((x:ICiudad) => x.IdPais == idPais)
  }

  filtrarCentroCosto(dataItem: string) {
    if(dataItem.length >= 4) {
      let param:any = { valor: dataItem }
      this.integraService
        .postJsonResponse(
          `${constApiComercial.CentroCostoObtenerFiltroAutocomplete}`, param
        ).subscribe({
          next: (response: HttpResponse<IAutocompleteCentroCosto[]>) => {
            this.listaCentroCosto = response.body;
          }
      })
    } else {
      this.listaCentroCosto = [];
    }
  }

  filtrarApellidoPaterno(dataItem: string) {
    if(dataItem.length >= 4) {
      let param: any = { valor : dataItem }
    this.integraService
      .postJsonResponse(
        `${constApiComercial.MessengerChatObtenerTodoComboAlumno}`, param
      ).subscribe({
      next: (response: HttpResponse<IAutocompletePaterno[]>) => {
        this.listaApellidoPaterno = response.body;
      }
    })
    } else {
      this.listaApellidoPaterno = [];
    }
  }

  filtrarEmailUno(dataItem: string) {
    if(dataItem.length >= 4) {
      let param: any = { valor : dataItem }
    this.integraService
      .postJsonResponse(
        `${constApiComercial.MessengerChatObtenerDatosAlumnoPorEmail}`, param
      )  .subscribe({
      next: (response: HttpResponse<IAutocompletePaterno[]>) => {
        this.listaEmail = response.body;
      }
    })
    } else {
      this.listaEmail = [];
    }
  }

  validarObligatorios(dataForm: IRedChatFormulario): boolean {
    let continuar: boolean = true;
    if (!dataForm.centroCosto) {
      alert('SELECCIONE UN CENTRO DE COSTO');
      continuar = false;
    } else if (!dataForm.tipoDato) {
      alert('SELECCIONE UN TIPO DE DATO');
      continuar = false;
    } else if (!dataForm.faseOportunidad) {
      alert('SELECCIONE UNA FASE OPORTUNIDAD');
      continuar = false;
    } else if (!dataForm.emailUno) {
      alert('INGRESE UN EMAIL');
      continuar = false;
    } else if (!dataForm.pais) {
      alert('SELECCIONE UN PAIS');
      continuar = false;
    } else if (!dataForm.ciudad) {
      alert('SELECCIONE UNA CIUDAD');
      continuar = false;
    } /* else if (!$cmbOpoAsignadoA.valor() || $cmbOpoAsignadoA.valor() == -1) {
      alert('SELECCIONE UN ASESOR');
      continuar = false;
    } else if ($cmbOpoOrigen.value() == "") {
      alert('SELECCIONE UN ORIGEN');
      continuar = false;
    }*/
    return continuar;
  }

  recuperarValoresForm() {
    let dataPreparada: any;
    let dataForm: IRedChatFormulario = this.formFiltroIngresoAsesor.getRawValue()
    if(this.validarObligatorios(dataForm)) {
      let contacto:any = {
        Nombre1: dataForm.nombreUno,
        Nombre2: dataForm.nombreDos,
        ApellidoPaterno: dataForm.apellidoPaterno,
        ApellidoMaterno: dataForm.apellidoMaterno,
        Celular: dataForm.celular,
        Email1: dataForm.emailUno,
        IdCodigoPais: dataForm.pais,
        IdCodigoCiudad: dataForm.ciudad,
        IdCargo: (!dataForm.cargo) ? 0 : dataForm.cargo,
        IdAFormacion: (!dataForm.areaFormacion) ? 0 : dataForm.areaFormacion,
        IdATrabajo: (!dataForm.areaTrabajo) ? 0 : dataForm.areaTrabajo,
        IdIndustria: (!dataForm.industria) ? 0 : dataForm.industria,
        // Id = (!$txtContactoId) ? 0 : $txtContactoId;
        // Direccion = $txtRefDireccion.val();
        // Telefono = $txtRefTelefono.val();
        // Email2 = $txtRefEmail2.val();
        // IdReferido = $cmbReferidoPor.valor();
        // IdEmpresa = (!$cmbReferidoPorEmpresa1.valor()) ? 0 : $cmbReferidoPorEmpresa1.valor();
      };
      // TODO: Datos de Oportunidad
      let Oportunidad: any = {
        IdCentroCosto: dataForm.centroCosto,
        IdPersonal_Asignado: 'cmbOpoAsignadoA',
        IdTipoDato: dataForm.tipoDato,
        IdFaseOportunidad: dataForm.faseOportunidad,
        IdOrigen: 'cmbOpoOrigen',
        fk_id_tipointeraccion: 18, //TODO: Formulario Enviado Completo
        IdAlumno: contacto.Id,
        // Id: (!$txtOpoIdOportunidad.val()) ? 0 : $txtOpoIdOportunidad.val();
        // RowVersion:  (!$txtOpoIdOportunidad.val()) ? "" : "No se envia",
        UltimoComentario: "Sin Comentario"
      };
      dataPreparada = { contacto: contacto, oportunidad: Oportunidad }
    }
    return dataPreparada;
  };
}
