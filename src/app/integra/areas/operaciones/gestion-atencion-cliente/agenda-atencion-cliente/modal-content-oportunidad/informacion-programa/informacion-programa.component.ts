import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { IAgendaConfiguracion, IInformacionProgramaV2 } from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { DecimalPipe } from '@angular/common';
import { I } from '@angular/cdk/keycodes';
import { IntegraService } from '@shared/services/integra.service';
import { constApiOperaciones } from '@environments/constApi';

/**
 * @module OperacionesModule
 * @name InformacionPrograma
 * @author Miguel Quiñones, Flavio Mamani, Joseph Llanque, Juan Huanaco
 * @description Componente que brinda informacion detallada de los Programas disponibles
 * @version 1.0.2
 * @history
 * * 29/04/2024: Actualización del componente para cumplir con el nuevo diseño solicitado para Agenda Atencion al Cliente.
 * * 23/05/2024: Se agregan filtro por Curso y Programa. Tambien se estandariza la visualizacion de la moneda.
 */
@Component({
  selector: 'app-informacion-programa',
  templateUrl: './informacion-programa.component.html',
  styleUrls: ['./informacion-programa.component.scss']
})

export class InformacionProgramaComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService
  
  dataProgramaGeneral: Array<{ id: number; nombre: string }>;
  dataProgramaGeneralFiltradoPorNombre: ProgramasPorCodigoPaisComboDTO[];
  dataProgramaGeneralFiltrado: ProgramasPorCodigoPaisComboDTO[];
  programaSeleccionado: ProgramasPorCodigoPaisComboDTO;
  informacionProgramaRaw: Array<IInformacionProgramaV2>;
  informacionProgramaCleaned: IInformacionProgramaCleaned;
  decimalPipe: DecimalPipe;
  listaProgramas: ProgramasPorCodigoPaisComboDTO[];
  listaFiltroTipoPrograma: FiltroTipoPrograma[];
  listaFiltroAreaPrograma: FiltroAreaPrograma[];
  filtroTipoSeleccionado: FiltroTipoPrograma;
  filtroAreaSeleccionado: FiltroAreaPrograma;
  columnsToDisplayInversionTable = ["version","beneficios","precioContado","precioCredito"]
  columnsToDisplayModalidadTable = ["modalidad","fechaInicio"]
  isLoading = false;

  constructor(private integraService: IntegraService) { }

 
  ngOnInit(): void {
    this.listaFiltroTipoPrograma = [{nombre: 'Todos', idTipo: null}, {nombre: 'Programas', idTipo: 3}, {nombre: 'Cursos', idTipo: 4}];
    this.listaFiltroAreaPrograma = [
      {nombre: 'Todos', idArea: null},
      {nombre: 'Big Data', idArea: 16},
      {nombre: 'Calidad', idArea: 5},
      {nombre: 'Construcción', idArea: 2},
      {nombre: 'Continuidad del negocio', idArea: 19},
      {nombre: 'Finanzas', idArea: 6},
      {nombre: 'Gestión Ambiental', idArea: 10},
      {nombre: 'Instituto', idArea: 26},
      {nombre: 'Mantenimiento', idArea: 1},
      {nombre: 'Mineria', idArea: 7},
      {nombre: 'Proyectos', idArea: 3},
      {nombre: 'Seguridad Alimentaria', idArea: 11},
      {nombre: 'Seguridad de la Información', idArea: 18},
      {nombre: 'Seguridad y Salud en el Trabajo', idArea: 13},
      {nombre: 'Tecnologías de la información', idArea: 4},
      {nombre: 'Transformación Digital', idArea: 14},
    ];
    this.filtroTipoSeleccionado = this.listaFiltroTipoPrograma[0];
    this.filtroAreaSeleccionado = this.listaFiltroAreaPrograma[0];
    this.decimalPipe = new DecimalPipe('en-US');
    this.informacionProgramaCleaned = { modalidad: [], expositores: [] };
    this.initSubscribeObservables();
  }
  
  Filtrar(){
    this.dataProgramaGeneralFiltrado = this.listaProgramas.slice();
    if(this.filtroTipoSeleccionado != null && this.filtroTipoSeleccionado.idTipo != null){
      this.dataProgramaGeneralFiltrado = this.dataProgramaGeneralFiltrado.filter(x=>x.idCategoriaPGeneral == this.filtroTipoSeleccionado.idTipo);
    }
    if(this.filtroAreaSeleccionado != null && this.filtroAreaSeleccionado.idArea != null){
      this.dataProgramaGeneralFiltrado = this.dataProgramaGeneralFiltrado.filter(x=>x.idAreaCapacitacion == this.filtroAreaSeleccionado.idArea);
    }
    this.dataProgramaGeneralFiltradoPorNombre = this.dataProgramaGeneralFiltrado.slice();
  }


  CleanModalidades() : {tipo: string, fechaInicio: string}[] {
    let modalidades = this.informacionProgramaRaw.find((x)=>x.seccion=="modalidades")
    if(modalidades == null) return [];

    let tipo = modalidades.detalleSeccion?.find(x=>x.titulo=="Modalidad");
    let fechaInicio = modalidades.detalleSeccion?.find(x=>x.titulo=="Fecha de Inicio");
    if (tipo == null || fechaInicio == null) return [];
    
    try {
      let temp = [];
      for(let i=0; i<tipo.detalleContenido.length;i++){
        temp.push({
          tipo: tipo.detalleContenido[i],
          fechaInicio: fechaInicio.detalleContenido[i]
        });
      }
      return temp;
    } catch (error) {
      console.error(error);
    }
    return [];
  }

  CleanInversion() : {cabecera: string, piePagina: string, lista: {version: string, beneficio: string[], precioContado: string, precioCredito: string}[]} {
    let inversion = this.informacionProgramaRaw.find((x)=>x.seccion=="inversion");
    let beneficios = this.informacionProgramaRaw.find((x)=>x.seccion=="beneficios");
    if(inversion == null || beneficios == null) return null;

    let cabecera = beneficios.detalleSeccion[0]?.cabecera;
    let piePagina = beneficios.detalleSeccion[0]?.piePagina;
    let versiones = inversion.detalleSeccion?.find(x=>x.titulo=="Versiones");
    let precioContado = inversion.detalleSeccion?.find(x=>x.titulo=="Precio al contado");
    let precioCredito = inversion.detalleSeccion?.find(x=>x.titulo=="Precio al crédito");

    if(versiones == null || precioContado == null || precioCredito == null) return null;

    try {
      let tempList = [];
      for(let i=0; i<versiones.detalleContenido.length;i++){
        tempList.push({
          version: versiones.detalleContenido[i],
          beneficio: beneficios.detalleSeccion?.find(x=>x.titulo == versiones.detalleContenido[i])?.detalleContenido ?? [],
          precioContado: precioContado.detalleContenido[i],
          precioCredito: precioCredito.detalleContenido[i],
        });
      }
      let temp = {
        cabecera: cabecera,
        piePagina: piePagina,
        lista: tempList
      };
      return temp;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  CleanExpositores() : {nombres: string, descripcion: string}[] {
    let expositores = this.informacionProgramaRaw.find((x)=>x.seccion=="expositores")
    if(expositores == null) return [];

    try {
      let temp = []
      for(let i=0; i<expositores.detalleSeccion.length;i++){
        temp.push({
          nombres: expositores.detalleSeccion[i].titulo,
          descripcion: expositores.detalleSeccion[i].detalleContenido[0]
        });
      }
      return temp;
    } catch (error) {
      console.error(error);
    }
    return [];
  }

  CleanDuracionHorarios() : string {
    let duracionHorario = this.informacionProgramaRaw.find((x)=>x.seccion=="duracion y horarios");
    if(duracionHorario == null) return null;
    let temp = duracionHorario.detalleSeccion[0]?.detalleContenido[0];
    return temp == null || temp == "" ? null : temp;
  }

  CleanDescripcionCertificacion() : string {
    let descripcionCertificacion = this.informacionProgramaRaw.find((x)=>x.seccion=="descripcion certificacion");
    if(descripcionCertificacion == null) return null;
    let temp = descripcionCertificacion.detalleSeccion[0]?.detalleContenido[0];
    return temp == null || temp == "" ? null : temp;
  }

  CleanPautasComplementarias() : string {
    let pautasComplementarias = this.informacionProgramaRaw.find((x)=>x.seccion=="pautas complementarias");
    if(pautasComplementarias == null) return null;
    let temp = pautasComplementarias.detalleSeccion[0]?.detalleContenido[0];
    return temp == null || temp == "" ? null : temp;
  }

  
  CleanMaterialCurso() : string {
    let materialCurso = this.informacionProgramaRaw.find((x)=>x.seccion=="material del curso");
    if(materialCurso == null) return null;
    let temp = materialCurso.detalleSeccion[0]?.detalleContenido[0];
    return temp == null || temp == "" ? null : temp;
  }

  CleanBibliografia() : string {
    let materialCurso = this.informacionProgramaRaw.find((x)=>x.seccion=="bibliografia");
    if(materialCurso == null) return null;
    let temp = materialCurso.detalleSeccion[0]?.detalleContenido[0];
    return temp == null || temp == "" ? null : temp;
  }

  CleanObjetivos() : string {
    let objetivos = this.informacionProgramaRaw.find((x)=>x.seccion=="objetivos");
    if(objetivos == null) return null;
    let temp = objetivos.detalleSeccion[0]?.detalleContenido[0];
    return temp == null || temp == "" ? null : temp;
  }

  CleanPrerrequisitos() : {cabecera : string, piePagina: string, lista: string[]} {
    let prerrequisitos = this.informacionProgramaRaw.find((x)=>x.seccion=="prerrequisitos");
    if(prerrequisitos == null) return null;
    let cabecera = prerrequisitos.detalleSeccion[0]?.cabecera;
    let piePagina = prerrequisitos.detalleSeccion[0]?.piePagina;
    let listaPrerrequisitos = prerrequisitos.detalleSeccion[0]?.detalleContenido;
    if(listaPrerrequisitos == null) return null;
    return {
      cabecera: cabecera,
      piePagina: piePagina,
      lista: listaPrerrequisitos
    };
  }


  CleanPresentacion() : string {
    let presentacion = this.informacionProgramaRaw.find((x)=>x.seccion=="presentacion");
    if(presentacion == null) return null;
    let temp = presentacion.detalleSeccion[0]?.detalleContenido[0];
    return temp == null || temp == "" ? null : temp;
  }

  CleanPublicoObjetivo() : string {
    let publicoObjetivo = this.informacionProgramaRaw.find((x)=>x.seccion=="publico objetivo");
    if(publicoObjetivo == null) return null;
    let temp = publicoObjetivo.detalleSeccion[0]?.detalleContenido[0];
    return temp == null || temp == "" ? null : temp;
  }

  CleanMetodologia() : string {
    let metodologia = this.informacionProgramaRaw.find((x)=>x.seccion=="metodologia online de este programa");
    if(metodologia == null) return null;
    let temp = metodologia.detalleSeccion[0]?.detalleContenido[0];
    return temp == null || temp == "" ? null : temp;
  }

  CleanEstructuraCurricular() : {titulo: string, detalles: string[], notas: string}[] {
    let estructuraCurricular = this.informacionProgramaRaw.find((x)=>x.seccion=="estructura curricular")
    if(estructuraCurricular == null) return [];

    try {
      let temp = [];
      for(let i=0; i<estructuraCurricular.detalleSeccion.length;i++){
        temp.push({
          titulo: estructuraCurricular.detalleSeccion[i].titulo,
          detalles: estructuraCurricular.detalleSeccion[i].detalleContenido,
          notas: estructuraCurricular.detalleSeccion[i].piePagina
        });
      }
      return temp;
    } catch (error) {
      console.error(error);
    }
    return [];
  }

  CleanCertificacion(): {cabecera : string, piePagina: string, lista: string[]}{
    let certificacion = this.informacionProgramaRaw.find((x)=>x.seccion=="certificacion");
    if(certificacion == null) return null;
    let cabecera = certificacion.detalleSeccion[0]?.cabecera;
    let piePagina = certificacion.detalleSeccion[0]?.piePagina;
    let listaCertificaciones = certificacion.detalleSeccion[0]?.detalleContenido;
    if(listaCertificaciones == null ) return null;
    return {
      cabecera: cabecera,
      piePagina: piePagina,
      lista: listaCertificaciones
    };
  }

  CleanDataInformacionPrograma(){
    this.informacionProgramaCleaned = { modalidad: [], expositores: [] };

    this.informacionProgramaCleaned.inversion = this.CleanInversion();
    this.informacionProgramaCleaned.modalidad = this.CleanModalidades();
    this.informacionProgramaCleaned.expositores = this.CleanExpositores();
    this.informacionProgramaCleaned.duracionHorario = this.CleanDuracionHorarios();
    this.informacionProgramaCleaned.descripcionCertificacion = this.CleanDescripcionCertificacion();
    this.informacionProgramaCleaned.objetivos = this.CleanObjetivos();
    this.informacionProgramaCleaned.presentacion = this.CleanPresentacion();
    this.informacionProgramaCleaned.publicoObjetivo = this.CleanPublicoObjetivo();
    this.informacionProgramaCleaned.metodologia = this.CleanMetodologia();
    this.informacionProgramaCleaned.estructuraCurricular = this.CleanEstructuraCurricular();
    this.informacionProgramaCleaned.prerrequisitos = this.CleanPrerrequisitos();
    this.informacionProgramaCleaned.certificacion = this.CleanCertificacion()
    this.informacionProgramaCleaned.materialCurso = this.CleanMaterialCurso();
    this.informacionProgramaCleaned.pautasComplementarias = this.CleanPautasComplementarias();
    this.informacionProgramaCleaned.bibliografia = this.CleanBibliografia();
  } 

  convertirSignosPrecio(texto: string){
    return texto.replace(/[A-Za-z\/\$]+(\d+)/g, (match, p1) => {
      return this.decimalPipe.transform(p1, '1.2-2') +' '+ (this.programaSeleccionado?.codigoMoneda ? this.programaSeleccionado?.codigoMoneda : '');
    });
  }

  initSubscribeObservables() {
    this.isLoading = true;

    this.integraService.postJsonResponse(constApiOperaciones.AgendaInformacionActividadObtenerProgramasPorCodigoPais, { codigoPais: this.agendaService.rowActual.idCodigoPais }).subscribe({
      next: (resp: HttpResponse<ProgramasPorCodigoPaisComboDTO[]>) => {
        this.listaProgramas = resp.body;
        this.dataProgramaGeneralFiltrado = this.listaProgramas.slice();
        this.dataProgramaGeneralFiltradoPorNombre = this.listaProgramas.slice();
        this.CargarPrimerPrograma();
      },
      error: (err: any) => {
      }
    })

  }

  CargarPrimerPrograma(){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.informacionProgramaV1$.subscribe(
      {
        next: (resp) => {
          if (resp != null) {
            this.programaSeleccionado = this.listaProgramas.find(x=>x.idPGeneral==resp.respuesta.idPGeneral);
            this.informacionProgramaRaw = resp.respuesta.informacionProgramaV2;
            this.CleanDataInformacionPrograma();
            this.isLoading = false;
          }
        },
      }
    );
  }

  CargarNuevoPrograma(){
    this.isLoading = true;
    this.informacionProgramaRaw = null;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .obtenerInformacionProgramaV2$(String(this.programaSeleccionado.idPGeneral))
      .subscribe({
        next: (resp: HttpResponse<{ respuesta: Array<IInformacionProgramaV2> }>) => {
          this.informacionProgramaRaw = resp.body.respuesta;
          this.CleanDataInformacionPrograma();
          this.isLoading = false;
        },
      });
  }


}

interface IInformacionProgramaCleaned{
  inversion?: {
    cabecera?: string,
    lista: {
      version: string,
      beneficio: string[],
      precioContado: string,
      precioCredito: string,
    }[],
    piePagina?: string
  },
  modalidad?: {
    tipo: string,
    fechaInicio: string
  }[],
  expositores?: {
    nombres: string,
    descripcion: string
  }[],
  duracionHorario?: string,
  descripcionCertificacion?: string,
  objetivos?: string,
  presentacion?: string,
  publicoObjetivo?: string,
  metodologia?: string,
  prerrequisitos? : {
    cabecera: string,
    piePagina: string,
    lista: string[]
  },
  estructuraCurricular?: {
    titulo: string,
    detalles: string[],
    notas: string
  }[],
  certificacion?: {
    cabecera: string,
    piePagina: string,
    lista: string[]
  }
  materialCurso?: string,
  pautasComplementarias?: string,
  bibliografia?: string,
  
}

interface ProgramasPorCodigoPaisComboDTO
{
    idPGeneral: number,
    nombrePGeneral: string,
    idCategoriaPGeneral: number,
    idAreaCapacitacion: number,
    codigoPais: number,
    codigoISOPais: string,
    simboloMoneda: string,
    codigoMoneda: string
}

interface FiltroTipoPrograma {
  nombre: string,
  idTipo: number | null
}
interface FiltroAreaPrograma {
  nombre: string,
  idArea: number | null
}