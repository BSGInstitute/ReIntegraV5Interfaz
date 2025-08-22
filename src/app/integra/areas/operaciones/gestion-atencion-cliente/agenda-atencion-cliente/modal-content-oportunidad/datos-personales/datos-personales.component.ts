import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IComboCiudad, IDocumentoPerOportunidad } from '@comercial/models/interfaces/iagenda-alumno';
import { IAgendaDatosAlumno, IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import { IDatosSentinelAlumno } from '@comercial/models/interfaces/isemaforo-financiero';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IEmpresa } from '@planificacion/models/interfaces/iempresa';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';
import { LocalizationPaginatorIntl } from '@shared/models/localization-mat-paginator';
import { IntegraService } from '@shared/services/integra.service';
import { constApi } from '@environments/constApi';
import Swal from 'sweetalert2';
import { threadId } from 'worker_threads';
import { firstValueFrom } from 'rxjs';
/**
 * @module OperacionesModule
 * @name DatosPersonales
 * @author Miguel Quiñones, Flavio Mamani, Joseph Llanque, Juan Huanaco
 * @description Componente para visualización y actualización de los datos personales del alumno,
 * visualización del historial de modificaciones e información alternativa (sentinel)
 * @version 1.0.2
 * @history
 * 29/04/2024: Actualización del componente para cumplir con el nuevo diseño solicitado para Agenda Atencion al Cliente.
 */
  
const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: "es"},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT},
    {provide: MatPaginatorIntl, useClass: LocalizationPaginatorIntl}
  ],
})
export class DatosPersonalesComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('modalSeleccionAsentamiento') modalSeleccionAsentamiento: TemplateRef<any>;
  listaDatosPorCodigoPostal: DatosCodigoPostalDTO[];
  constructor(
    private formBuilder: FormBuilder, 
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private integraService: IntegraService
  ) { }

  
  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  dataInformacionAlternativa : IDatosSentinelAlumno;
  dataSourceHistorialModificaciones: MatTableDataSource<IDocumentoPerOportunidad>;
  maxDateCalendar = new Date();
  columnsToDisplay = ['campo-actualizado','valor-anterior','valor-nuevo','fecha','usuario'];
  codigoPais: number;
  actualizarAlumnoForm: FormGroup
  alumno: IAlumnoInformacion;
  listaGeneros = ['M', 'F'];
  listaCiudad: IComboCiudad[] = [];
  listaMunicipioMexico: Municipio[] = [];
  listaAsentamientoMexico: AsentamientoMunicipioDTO[] = [];
  // listaCodigoPostal: IComboCiudad[] = [];
  listaEmpresa:any = [];
  listaFormacion: any;
  listaIndustria: any;
  listaTrabajo: any;
  listaCargo: any;
  listaParentesco: any;
  empresaDefault:any = { id: null, nombre: 'Sin Empresa' };
  industriaDefault:any = { id: null, nombre: 'Sin Industria' };
  trabajoDefault:any = { id: null, nombre: 'Sin Trabajo' };
  cargoDefault:any = { id: null, nombre: 'Sin Cargo' };
  formacionDefault:any = { id: null, nombre: 'Sin Formación' };
  isActualizarAlumnoLoading = false;
  isHistorialModificacionLoading = false;
  isDataAlternativaLoading = false;
  empresaCodigoPostal = '';
  email2Readonly = false;
  celular2Readonly = false;
  telefono1Readonly = false;
  telefono2Readonly = false;
  email2ofuscado: string;
  celular2ofuscado: string;
  telefono1ofuscado: string;
  telefono2ofuscado: string;
  isLoadingDatoPersonal:boolean=false;
  dataInformacionRandom: any = {}; 
  idMatriculaCabecera: number;

  datosAdicionales: any[] = [
    { nombre: 'Empleado', direccion: 'AV Lima 504', tipoTrabajo:'Independiente', actividadEconomica: 'S/. 3000' },
    { nombre: 'Autónomo', direccion: 'av Arequipa 58', tipoTrabajo:'Independiente', actividadEconomica: 'S/. 2500' },
    { nombre: 'Desempleado', direccion: 'Av. Cusco 156', tipoTrabajo:'Independiente', actividadEconomica: 'S/. 0' },
    { nombre: 'Empleado Público',direccion: 'Av. Trujillo 89', tipoTrabajo:'Independiente', actividadEconomica: 'S/. 3200' },
    { nombre: 'Freelancer', direccion: 'Av. Chiclayo 158', tipoTrabajo:'Dependiente', actividadEconomica: 'S/. 2700' },
    { nombre: 'Estudiante',direccion: 'Av. Ica 586',  tipoTrabajo:'Independiente',actividadEconomica: 'S/. 1025' },
    { nombre: 'Jubilado', direccion: 'Av.Piura 589',  tipoTrabajo:'Independiente',actividadEconomica: 'S/. 1500' },
    { nombre: 'Comerciante', direccion: 'Av. Parra 256',  tipoTrabajo:'Dependiente',actividadEconomica: 'S/. 5000' },
    { nombre: 'Profesor', direccion: 'Av. Jauja ,Huancayo',  tipoTrabajo:'Independiente',actividadEconomica: 'S/. 4000' },
    { nombre: 'Autónomo',  direccion: 'AV.Quiñones,Ayacucho',  tipoTrabajo:'Dependiente',actividadEconomica: 'S/. 2200' }
  ];

  ngOnInit(): void {
    this.mostrarDatoAleatorio();
    this.idMatriculaCabecera=this.agendaService.rowActual.idMatriculaCabecera;

    this.actualizarAlumnoForm = this.formBuilder.group({

      //Datos Personales
      primerNombre: new FormControl({value: null}, [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)]),
      segundoNombre: new FormControl({value: null}, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)),
      apellidoPaterno: new FormControl({value: null}, [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)]),
      apellidoMaterno: new FormControl({value: null}, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)),
      dni: new FormControl({value: null}, [Validators.required,Validators.pattern(/^[\dA-Za-z]*$/)]),
      genero: new FormControl({value: null}),
      fechaNacimiento: new FormControl({value: null}),
      
      //Domicilio
      idCiudad: new FormControl({value: null}),
      direccion: new FormControl({value: null}),

      //Datos Laborales
      empresa: new FormControl({value: null}),
      industria: new FormControl({value: null}),
      trabajo: new FormControl({value: null}),
      cargo: new FormControl({value: null}),

      //Datos Familiares
      nombreFamiliar: new FormControl({value: null}, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)),
      parentesco: new FormControl({value: null}, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)),
      telefonoFamiliar: new FormControl({value: null}, Validators.pattern(/^\d*$/)),

      //Area de Formacion
      formacion: new FormControl({value: null}),

      //Correo electronico
      emailSecundario: new FormControl({value: null},  Validators.email),

      //Datos telefonicos
      celularSecundario: new FormControl({value: null},  Validators.pattern(/^\d*$/)),
      telefonoPrincipal: new FormControl({value: null},  Validators.pattern(/^\d*$/)),
      telefonoSecundario: new FormControl({value: null},  Validators.pattern(/^\d*$/)),
    });

    //Para Mexico agregamos 2 nuevos controles
    if(this.agendaService.rowActual.idCodigoPais == 52){
      this.actualizarAlumnoForm.addControl('rfc', this.formBuilder.control(null, Validators.pattern(/^[\dA-Za-z]*$/)));
      this.actualizarAlumnoForm.addControl('idMunicipioMexico', this.formBuilder.control(null));
      this.actualizarAlumnoForm.addControl('idAsentamientoMexico', this.formBuilder.control(null));
      this.actualizarAlumnoForm.addControl('codigoPostal', this.formBuilder.control(null));
    }
    this.dataSourceHistorialModificaciones = new MatTableDataSource<IDocumentoPerOportunidad>([]);
    this.codigoPais = this.agendaService.rowActual.idCodigoPais;
    this.isActualizarAlumnoLoading = true;
    this.isHistorialModificacionLoading = true;
    this.isDataAlternativaLoading = true;
    this.actualizarAlumnoForm.get('empresa').valueChanges.subscribe(x => this.refrescarCodigoPostalEmpresa(x.id));
  }

  ngAfterViewInit(){
    this.initSubscribeObservables();
  }

  initSubscribeObservables(){
    this.agendaService.agendaAlumnoOperacionesService.cargarCiudad$.subscribe({
      next: (resp) => {
        if (resp != null && resp.length > 0) {
          let data = resp.filter(x=>x.idPais == this.codigoPais).sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre)
          );
          this.listaCiudad = data;
        }
      },
    });

    this.agendaService.agendaAlumnoOperacionesService.cargoTrabajo$.subscribe({
      next: (resp: any) => {
        if (resp != null && resp.length > 0) {
          let data = resp.sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre)
          );
          this.listaCargo = data;
        }
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.industria$.subscribe({
      next: (resp: any) => {
        if (resp != null && resp.length > 0) {
          let data = resp.sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre)
          );
          this.listaIndustria = data;
        }
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.areaTrabajo$.subscribe({
      next: (resp: any) => {
        if (resp != null && resp.length > 0) {
          let data = resp.sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre)
          );
          this.listaTrabajo = data;
        }
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.areaFormacion$.subscribe({
      next: (resp: any[]) => {
        if (resp != null && resp.length > 0) {
          let data = resp.map(x=>{return {id: x.id, nombre: x.nombre}}).sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre)
          );
          console.log(data);
          this.listaFormacion = data;
        }
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.historialModificacionAlumnoPorIdAlumno$.subscribe(
      {
        next: (resp) => {
          if(this.agendaService.areaTrabajo == 'OP'){
            resp = resp.map<IDocumentoPerOportunidad>((x)=>{
                if (x.campoActualizado.toLowerCase() == "email 2"){
                  x.valorAnterior = this.agendaService.agendaAlumnoOperacionesService.ofuscarCorreo(x.valorAnterior)
                  x.valorNuevo = this.agendaService.agendaAlumnoOperacionesService.ofuscarCorreo(x.valorNuevo)
                }
                else if (x.campoActualizado.toLocaleLowerCase() == "celular 2" || x.campoActualizado.toLocaleLowerCase() == "telefono" || x.campoActualizado.toLocaleLowerCase() == "telefono 2"){
                  x.valorAnterior = this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(x.valorAnterior)
                  x.valorNuevo = this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(x.valorNuevo)
                }
                return x;
              });
          }

          this.dataSourceHistorialModificaciones.data = resp;
          this.dataSourceHistorialModificaciones.paginator = this.paginator;
          this.isHistorialModificacionLoading = false;
        }
      });

    this.agendaService.agendaSentinelOperacionesService.sentinelAlumno$.subscribe(
      {
        next: (resp: IDatosSentinelAlumno) => {
          if (resp != null) this.dataInformacionAlternativa = resp;
          this.isDataAlternativaLoading = false;
        }
      }
    );
    this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
      next: (resp) => {
        if (resp != null) {
          this.alumno = resp.alumno;
          this.isActualizarAlumnoLoading = false;
          if(this.alumno.idCodigoPais == 52){
            this.actualizarAlumnoForm.controls['idCiudad'].valueChanges.subscribe(
              (newIdCiudad) => {
                this.cargarMunicipiosMexico(newIdCiudad);
              }
            );
            this.actualizarAlumnoForm.controls['idMunicipioMexico'].valueChanges.subscribe(
              (newIdMunicipioMexico) =>{
                this.cargarAsentamientosMexico(newIdMunicipioMexico);
              }
            );
            this.actualizarAlumnoForm.controls['idAsentamientoMexico'].valueChanges.subscribe(
              (newIdAsentamientoMexico) =>{
                let asentamiento = this.listaAsentamientoMexico.find(x=>x.idAsentamientoMexico == newIdAsentamientoMexico);
                if(asentamiento == undefined) return;
                this.actualizarAlumnoForm.get('codigoPostal').setValue(asentamiento.codigoPostal);
              }
            );
          }
          this.asignarValoresForm();
          this.refrescarCodigoPostalEmpresa(this.alumno.idEmpresa);
        }
      },
    });
  }
  loadDatos(){
    this.isLoadingDatoPersonal = true;

  setTimeout(() => {
    this.isLoadingDatoPersonal = false;

    Swal.fire({
      icon: 'success',
      title: 'Carga exitosa',
      text: 'Los datos se han cargado correctamente',
      timer: 1000, 
      showConfirmButton: false 
    });
  }, 4000); 
  }

  mostrarDatoAleatorio(): void {
    const indiceAleatorio = Math.floor(Math.random() * this.datosAdicionales.length);
    this.dataInformacionRandom = this.datosAdicionales[indiceAleatorio];
  }
  private cargarMunicipiosMexico(idCiudad: number){
    if(idCiudad == null){
      this.listaMunicipioMexico = [];
      return;
    }
    this.listaAsentamientoMexico = [];
    this.integraService.getJsonResponse(constApi.ObtenerMunicipioPorCiudad+'/'+idCiudad).subscribe({
      next: (resp: HttpResponse<Municipio[]>) => {
        try{
          this.listaMunicipioMexico = resp.body.sort(this.ordenarPorPropiedad('nombre'));
        }catch(e){
          console.log("error al ordenar");
          this.listaMunicipioMexico = resp.body;
        }
      },
    });
  }

  private ordenarPorPropiedad (propiedad: string) {
    return function(a:any,b:any){
      var nombreA = a[propiedad].toUpperCase();
      var nombreB = b[propiedad].toUpperCase();
      if (nombreA < nombreB)
          return -1;
      
      if (nombreA > nombreB) 
          return 1;
      return 0;
    }
  }

  private cargarAsentamientosMexico(idMunicipioMexico: number){
    if(idMunicipioMexico == null){
      this.listaAsentamientoMexico = [];
      return;
    }
    let idCiudad = this.actualizarAlumnoForm.get('idCiudad').value;
    this.integraService.getJsonResponse(constApi.ObtenerAsentamientoPorMunicipio+'/'+idCiudad+'/'+idMunicipioMexico).subscribe({
      next: (resp: HttpResponse<AsentamientoMunicipioDTO[]>) => {
        try{
          this.listaAsentamientoMexico = resp.body.sort(this.ordenarPorPropiedad('asentamientoMexico'));
        }catch(e){
          console.log("error al ordenar");
          this.listaAsentamientoMexico = resp.body;
        }
      },
    });
  }

  private refrescarCodigoPostalEmpresa(idEmpresa: number){
    if(this.codigoPais != 52) return;
    if(idEmpresa == null){
      this.empresaCodigoPostal = '-';
      return;
    }
    this.agendaService.agendaAlumnoOperacionesService.obtenerEmpresaPorId$(idEmpresa).subscribe({
      next: (resp: HttpResponse<IEmpresa>) => {
        if (resp != null) {
          this.empresaCodigoPostal = resp.body.codigoPostal ?? "No asignado";
        }
      },
    });
  }

  obtenerDatosPorCodigoPostal(){
    let codigoPostal:string = this.actualizarAlumnoForm.value['codigoPostal']
    console.log('Codigo Postal: '+codigoPostal);
    if( codigoPostal == null || codigoPostal == ""){
      this.alertaService.mensajeWarning("Primero escribe un codigo postal para buscar");
      
      return;
    }
    
    this.integraService.getJsonResponse(constApi.BusquedaDatosMexicoPorCodigoPostal+'/'+codigoPostal).subscribe({
      next: (resp: HttpResponse<DatosCodigoPostalDTO[]>) => {
        this.listaDatosPorCodigoPostal = resp.body;
        console.log("Datos por codigo postal");
        console.log(this.listaDatosPorCodigoPostal);
        
        if(this.listaDatosPorCodigoPostal?.length == 0){
          this.mensajeWarning("No se encontraron registros para el código postal: "+codigoPostal);
        }
        else if(this.listaDatosPorCodigoPostal?.length == 1){
          let datos = this.listaDatosPorCodigoPostal[0];
          this.actualizarAlumnoForm.get('idCiudad').setValue(datos.idCiudad);
          this.actualizarAlumnoForm.get('idMunicipioMexico').setValue(datos.idMunicipioMexico);
          this.actualizarAlumnoForm.get('idAsentamientoMexico').setValue(datos.idAsentamientoMexico);
          this.mensajeExitoso("Datos obtenidos para el código postal: "+codigoPostal);
        }
        else if(this.listaDatosPorCodigoPostal?.length > 1){
          this.abrirModal(this.modalSeleccionAsentamiento, 'sm');
        }
      },
    });
  }

  seleccionarAsentamiento(data: DatosCodigoPostalDTO){
    console.log('VALOR ASENTAMIENTO SELECCIONADO:'+ data.idAsentamientoMexico);
    this.actualizarAlumnoForm.get('idCiudad').setValue(data.idCiudad);
    this.actualizarAlumnoForm.get('idMunicipioMexico').setValue(data.idMunicipioMexico);
    this.actualizarAlumnoForm.get('idAsentamientoMexico').setValue(data.idAsentamientoMexico);
    this.listaDatosPorCodigoPostal = [];
  }

  mensajeExitoso(mensaje: string) {
    return this.toast.fire({
      icon: 'success',
      title: mensaje,
    });
  }

  mensajeWarning(mensaje: string) {
    return this.toast.fire({
      icon: 'warning',
      title: mensaje,
    });
  }

  async validarCodigoPostal(codigoPostal: string): Promise<boolean>{
    console.log("Validando código postal");
    try {
      let response:HttpResponse<DatosCodigoPostalDTO[]> = await firstValueFrom(this.integraService.getJsonResponse(constApi.BusquedaDatosMexicoPorCodigoPostal+'/'+codigoPostal));
      
      //Check length:
      if(response.body.length == 0){
        this.mensajeWarning("Código postal no válido");
        return false;
      }
      
      //validar ciudad, municipio y asentamiento cuando aplique
      let idCiudad = this.actualizarAlumnoForm.value['idCiudad'];
      let idMunicipioMexico = this.actualizarAlumnoForm.value['idMunicipioMexico'];
      let idAsentamientoMexico = this.actualizarAlumnoForm.value['idAsentamientoMexico'];
      //if contains a value for idCiudad and if it not exists on the matched codigoPostal object.
      if(idCiudad != null && response.body.some(x=>x.idCiudad == idCiudad) == false){
        this.mensajeWarning("El codigo postal no coincide con el Estado seleccionado");
        return false;
      }
      if(idMunicipioMexico != null && response.body.some(x=>x.idMunicipioMexico == idMunicipioMexico) == false){
        this.mensajeWarning("El codigo postal no coincide con el Municipio seleccionado");
        return false;
      }
      if(idAsentamientoMexico != null && response.body.some(x=>x.idAsentamientoMexico == idAsentamientoMexico) == false){
        this.mensajeWarning("El codigo postal no coincide con la Colonia seleccionada");
        return false;
      }
      return true;
    }catch(error){
      console.error(error);
      return false;
    }
  }

  async actualizarAlumno(){
    if (this.actualizarAlumnoForm.invalid)
      return;

    //TODO: LOGICA PARA VALIDAR CODIGO POSTAL CUANDO APLIQUE. 

    let codigoPostal = this.actualizarAlumnoForm.value['codigoPostal'];
    if (this.alumno.idCodigoPais == 52 && codigoPostal != null && codigoPostal != ""){
      if ((await this.validarCodigoPostal(codigoPostal)) == false){
        return;
      }
    }

    this.isActualizarAlumnoLoading = true;

    let dataAlumno: IAlumnoInformacion = {
      id: this.alumno.id,
      nombre1: this.actualizarAlumnoForm.value['primerNombre']?.trim(),
      nombre2: this.actualizarAlumnoForm.value['segundoNombre']?.trim(),
      apellidoPaterno: this.actualizarAlumnoForm.value['apellidoPaterno']?.trim(),
      apellidoMaterno: this.actualizarAlumnoForm.value['apellidoMaterno']?.trim(),
      dni: this.actualizarAlumnoForm.value['dni'],
      email1: this.alumno.email1,
      email2: this.actualizarAlumnoForm.value['emailSecundario']?.trim(),
      celular2: this.actualizarAlumnoForm.value['celularSecundario'],
      celular: this.alumno.celular,
      telefono: this.actualizarAlumnoForm.value['telefonoPrincipal'],
      telefono2: this.actualizarAlumnoForm.value['telefonoSecundario'],
      genero: this.actualizarAlumnoForm.value['genero'],
      parentesco: this.actualizarAlumnoForm.value['parentesco']?.trim(),
      nombreFamiliar: this.actualizarAlumnoForm.value['nombreFamiliar']?.trim(),
      telefonoFamiliar: this.actualizarAlumnoForm.value['telefonoFamiliar'],
      
      idCiudad: this.actualizarAlumnoForm.value['idCiudad'],
      nombreCiudad: this.listaCiudad.find(x=>x.id ==  this.actualizarAlumnoForm.value['idCiudad'])?.nombre,
      fechaNacimiento: datePipeTransform(
        this.actualizarAlumnoForm.value['fechaNacimiento'],
        'yyyy-MM-dd'
      ),
      direccion: this.actualizarAlumnoForm.value['direccion'],
      idCargo: this.actualizarAlumnoForm.value['cargo']?.id,
      cargo: this.actualizarAlumnoForm.value['cargo']?.nombre,
      idATrabajo: this.actualizarAlumnoForm.value['trabajo']?.id,
      aTrabajo: this.actualizarAlumnoForm.value['trabajo']?.nombre,
      idEmpresa: this.actualizarAlumnoForm.value['empresa']?.id,
      empresa: this.actualizarAlumnoForm.value['empresa']?.nombre,
      idAFormacion: this.actualizarAlumnoForm.value['formacion']?.id,
      aFormacion: this.actualizarAlumnoForm.value['formacion']?.nombre,
      idIndustria: this.actualizarAlumnoForm.value['industria']?.id,
      industria: this.actualizarAlumnoForm.value['industria']?.nombre,
      idCodigoPais: this.codigoPais
    };

    if(this.alumno.idCodigoPais == 52) {
      let codigoPostal = this.actualizarAlumnoForm.value['codigoPostal'];
      codigoPostal = codigoPostal == "" ? null : codigoPostal;
      let rfc = this.actualizarAlumnoForm.value['rfc'];
      rfc = rfc == "" ? null : rfc;
      
      let idMunicipioMexico = this.actualizarAlumnoForm.value['idMunicipioMexico'];
      let idAsentamientoMexico = this.actualizarAlumnoForm.value['idAsentamientoMexico'];
      if (idMunicipioMexico != null && this.listaMunicipioMexico.some(x=>x.id == idMunicipioMexico) == false){
        idMunicipioMexico = null;
      }
      if (idAsentamientoMexico != null && this.listaAsentamientoMexico.some(x=>x.idAsentamientoMexico == idAsentamientoMexico) == false){
        idAsentamientoMexico = null;
      }
      dataAlumno.idMunicipioMexico = idMunicipioMexico;
      dataAlumno.idAsentamientoMexico = idAsentamientoMexico;
      dataAlumno.rfc = rfc;
      dataAlumno.codigoPostal = codigoPostal;
    } else {
      dataAlumno.idMunicipioMexico = null;
      dataAlumno.idAsentamientoMexico = null;
      dataAlumno.rfc = null;
      dataAlumno.codigoPostal = null;
    }

    if(this.celular2Readonly && dataAlumno.celular2 != this.alumno.celular2)
      dataAlumno.celular2 = this.alumno.celular2;
    if(this.email2Readonly && dataAlumno.email2 != this.alumno.email2)
      dataAlumno.email2 = this.alumno.email2;
    if(this.telefono1Readonly && dataAlumno.telefono != this.alumno.telefono)
      dataAlumno.telefono = this.alumno.telefono;
    if(this.telefono2Readonly && dataAlumno.telefono2 != this.alumno.telefono2)
      dataAlumno.telefono2 = this.alumno.telefono2;

    this.agendaService.agendaAlumnoOperacionesService
        .actualizarAlumno$(dataAlumno)
        .subscribe({
          next: (resp: HttpResponse<IAlumnoInformacion>) => {
            this.mensajeExitoso('Se actualizó los datos del alumno');
            this.recargarDatosModificadosAlumno();
            this.agendaService.agendaAlumnoOperacionesService.obtenerHistorialModificacionesContacto(
              this.alumno.id
            );
            this.isActualizarAlumnoLoading = false;
          },
          error: (error) => {
            console.log(error);
            this.isActualizarAlumnoLoading = false;
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.mensajeWarning(mensaje);
          },
        });
    
    console.log(dataAlumno);
  }

  private asignarValoresForm(){
    this.actualizarAlumnoForm.get('primerNombre').setValue(this.alumno.nombre1);
    this.actualizarAlumnoForm.get('segundoNombre').setValue(this.alumno.nombre2);
    this.actualizarAlumnoForm.get('apellidoPaterno').setValue(this.alumno.apellidoPaterno);
    this.actualizarAlumnoForm.get('apellidoMaterno').setValue(this.alumno.apellidoMaterno);
    this.actualizarAlumnoForm.get('dni').setValue(this.alumno.dni);
    this.actualizarAlumnoForm.get('genero').setValue(this.alumno.genero);
    this.actualizarAlumnoForm.get('fechaNacimiento').setValue(new Date(this.alumno.fechaNacimiento));
    this.actualizarAlumnoForm.get('idCiudad').setValue(this.alumno.idCiudad);
    this.actualizarAlumnoForm.get('direccion').setValue(this.alumno.direccion);
    if(this.agendaService.rowActual.idCodigoPais == 52){
      this.actualizarAlumnoForm.get('idMunicipioMexico').setValue(this.alumno.idMunicipioMexico);
      this.actualizarAlumnoForm.get('idAsentamientoMexico').setValue(this.alumno.idAsentamientoMexico);
      this.actualizarAlumnoForm.get('rfc').setValue(this.alumno.rfc);
      this.actualizarAlumnoForm.get('codigoPostal').setValue(this.alumno.codigoPostal);
    }
    this.actualizarAlumnoForm.get('cargo').setValue({id:this.alumno.idCargo, nombre: this.alumno.cargo});
    this.actualizarAlumnoForm.get('formacion').setValue({id:this.alumno.idAFormacion, nombre: this.alumno.aFormacion});
    this.actualizarAlumnoForm.get('industria').setValue({id:this.alumno.idIndustria, nombre: this.alumno.industria});
    
    if(this.alumno.idEmpresa != null){
      this.actualizarAlumnoForm.get('empresa').setValue({id: this.alumno.idEmpresa, nombre: this.alumno.empresa});
      this.listaEmpresa.push(this.actualizarAlumnoForm.value['empresa']);
    }else
      this.actualizarAlumnoForm.get('empresa').setValue(this.empresaDefault);
    
    this.actualizarAlumnoForm.get('trabajo').setValue({id: this.alumno.idATrabajo, nombre: this.alumno.aTrabajo});
    this.actualizarAlumnoForm.get('nombreFamiliar').setValue(this.alumno.nombreFamiliar);
    this.actualizarAlumnoForm.get('parentesco').setValue(this.alumno.parentesco);
    this.actualizarAlumnoForm.get('telefonoFamiliar').setValue(this.alumno.telefonoFamiliar);
    
    this.actualizarAlumnoForm.get('emailSecundario').setValue(this.alumno.email2);
    this.actualizarAlumnoForm.get('celularSecundario').setValue(this.alumno.celular2);
    this.actualizarAlumnoForm.get('telefonoPrincipal').setValue(this.alumno.telefono);
    this.actualizarAlumnoForm.get('telefonoSecundario').setValue(this.alumno.telefono2);

    if(this.agendaService.areaTrabajo == 'OP'){
      this.email2ofuscado = this.agendaService.agendaAlumnoOperacionesService.ofuscarCorreo(this.alumno.email2);
      this.celular2ofuscado = this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(this.alumno.celular2);
      this.telefono1ofuscado = this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(this.alumno.telefono);
      this.telefono2ofuscado = this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(this.alumno.telefono2);
    }
    
    this.email2Readonly = this.alumno.email2 != null && this.alumno.email2 !== '';
    this.celular2Readonly = this.alumno.celular2 != null && this.alumno.celular2 !== '';
    this.telefono1Readonly = this.alumno.telefono != null && this.alumno.telefono !== '';
    this.telefono2Readonly = this.alumno.telefono2 != null && this.alumno.telefono2 !== '';
  
  }

  

  abrirModal(context: any, size: string) {
    this.modalService.open(context, { size: size, backdrop: 'static' });
  }

  private recargarDatosModificadosAlumno() {
    let rowActual = this.agendaService.rowActual;
    this.agendaService.agendaAlumnoOperacionesService
      .recargarDatosModificadosAlumno$(
        rowActual.idClasificacionPersona,
        rowActual.idOportunidad
      )
      .subscribe({
        next: (response: HttpResponse<IAgendaDatosAlumno>) => {
          console.log(response.body);
          this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.next(
            response.body
          );
          this.agendaService.agendaAlumnoOperacionesService.alumno$.next(
            response.body.alumno
          );
          this.agendaService.agendaAlumnoOperacionesService.whatsAppAlumno$.next(
            response.body.alumno
          );

          let speech = this.agendaService.agendaActividadesOperacionesService.speechBienvenidaDespedida$.value;
          this.agendaService.agendaActividadesOperacionesService.speechBienvenidaDespedida$.next(speech);
          this.agendaService.agendaSentinelOperacionesService.resetSentinel();
          this.agendaService.agendaSentinelOperacionesService.iniciarSentinel();
        },
      });
  }


  filtrarEmpresas(text: any){
    console.log(text.target.value);
    console.log(this.actualizarAlumnoForm.value['empresa']);
    if (text.target.value.length < 4) return;
    
    this.agendaService.agendaAlumnoOperacionesService
      .obtenerEmpreseAutocomplete$(text.target.value)
      .subscribe({
        next: (response: any) => {
          console.log(response.body);
          this.listaEmpresa = response.body.filter((x:any) =>
            x.id != this.actualizarAlumnoForm.value['empresa']?.id
          );
          if (
            this.actualizarAlumnoForm.value['empresa'] != null &&
            this.actualizarAlumnoForm.value['empresa'] != this.empresaDefault
          )
            this.listaEmpresa.push(this.actualizarAlumnoForm.value['empresa']);
        },
      });
    
  }

  compareObjects(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

}

interface Municipio
{
    id: number,
    nombre: string
}

interface AsentamientoMunicipioDTO
{
    idAsentamientoMexico: number,
    codigoPostal: string,
    asentamientoMexico: string
}

interface DatosCodigoPostalDTO
{
    codigoPostal: string,
    idAsentamientoMexico: number,
    asentamientoMexico: string,
    idMunicipioMexico: number,
    municipioMexico: string,
    idCiudad: number,
    ciudadMexico: string
}
