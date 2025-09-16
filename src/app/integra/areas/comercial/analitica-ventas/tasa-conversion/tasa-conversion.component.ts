import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  process,
  State,
  aggregateBy,
  AggregateDescriptor,
  AggregateResult,
} from '@progress/kendo-data-query';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import Swal from 'sweetalert2';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiComercial } from '@environments/constApi';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { UserService } from '@shared/services/user.service';
import { HttpResponse } from '@angular/common/http';
import {
  IRecord,
  L2,
  Records3,
  Records5,
  TasaConversion,
} from '@comercial/models/interfaces/tasa-conversion';
@Component({
  selector: 'app-tasa-conversion',
  templateUrl: './tasa-conversion.component.html',
  styleUrls: ['./tasa-conversion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TasaConversionComponent implements OnInit {
  MetaFinalTipoAsesor: number;
  gridData: GridDataResult;
  aggregates: AggregateDescriptor[];
  aggregates1: AggregateDescriptor[];
  totalDesagregado: AggregateResult;
  columnasDetailDesagregado: any = [];
  state: State = {
    filter: {
      logic: 'and',
      filters: [],
    },
  };

  gridASesorSenior: KendoGrid = new KendoGrid();
  gridCoordinadorJunior: KendoGrid = new KendoGrid();
  gridASesorSeniorPeru: KendoGrid = new KendoGrid();
  gridASesorSeniorColombia: KendoGrid = new KendoGrid();
  gridASesorSeniorBolivia: KendoGrid = new KendoGrid();
  gridASesorSeniorMexico: KendoGrid = new KendoGrid();
  gridASesorSeniorOtros: KendoGrid = new KendoGrid();
  gridASesorJunior: KendoGrid = new KendoGrid();
  gridASesorJuniorPeru: KendoGrid = new KendoGrid();
  gridASesorJuniorColombia: KendoGrid = new KendoGrid();
  gridASesorJuniorBolivia: KendoGrid = new KendoGrid();
  gridASesorJuniorMexico: KendoGrid = new KendoGrid();
  gridASesorJuniorOtros: KendoGrid = new KendoGrid();
  gridASesor_Total: KendoGrid = new KendoGrid();
  gridASesor: KendoGrid = new KendoGrid();

  total1: AggregateResult;
  total2: AggregateResult;
  total3: AggregateResult;
  total4: AggregateResult;
  total5: AggregateResult;
  total6: AggregateResult;
  total7: AggregateResult;
  total8: AggregateResult;
  total9: AggregateResult;
  total10: AggregateResult;
  total11: AggregateResult;
  total12: AggregateResult;
  total13: AggregateResult;
  total14: AggregateResult;
  total15: AggregateResult;
  metaAsesorSeniorPeru: number;
  metaAsesorSeniorColombia: number;
  metaAsesorSeniorBolivia: number;
  metaAsesorSeniorMexico: number;
  metaAsesorSeniorOtros: number;
  metaAsesorJunior: number;
  metaAsesorJuniorPeru: number;
  metaAsesorJuniorColombia: number;
  metaAsesorJuniorBolivia: number;
  metaAsesorJuniorMexico: number;
  metaAsesorJuniorOtros: number;
  metaAsesorSenior: number;
  dataDesagregada: any = [];
  index1: number;
  datosUser: any;
  UserName: any;
  constructor(
    private userService: UserService,
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService
  ) {}

  idPersonal = 213;
  formFiltro: FormGroup = this.formBuilder.group({
    areas: [[]],
    subareas: [[]],
    pespecifico: [[]],
    fecha: true,
    modalidades: [[]],
    FechaInicioTemp: [''],
    ciudades: [[]],
    FechaFinTemp: [''],
    coordinadores: [[]],
    asesores: [[]],
    muestraMinima: 0.0,
    estadoPersonal: 1,
    pgeneral: [[]],
  });

  gridComplemento: {
    title: string;
    grid: KendoGrid;
    columnGroup: any;
  }[] = [];
  categoriaDatoTotal = [
    {
      title: 'Total',
      grid: new KendoGrid(),
      columnGroup: [] as any[],
    },
  ];
  categoriaDatoConsolidado = [
    {
      title: 'Muy Alta',
      grid: new KendoGrid(),
      columnGroup: [] as any[],
    },
    {
      title: 'Alta-Media',
      grid: new KendoGrid(),
      columnGroup: [] as any[],
    },
    {
      title: 'Sin Probabilidad',
      grid: new KendoGrid(),
      columnGroup: [] as any[],
    },
  ];
  dataConsolidado: any = [];
  totalMetaFinal: number = 0;
  limite: number = 0;
  columnasDetailConsolidado: any = [];

  dataArea: any[] = [];
  dataAreaFiltro: any[] = [];
  dataSubArea: any[] = [];
  dataSubAreaFiltro: any[] = [];
  dataSubAreaChange: any[] = [];
  dataPGeneralFiltro: any[] = [];
  dataPEspecificoFiltro: any[] = [];
  dataCoordinador: any[] = [];
  dataAsesor: any[] = [];
  dataAsesorfiltro: any[] = [];
  dataCoordinadorfiltro: any[] = [];
  dataAsesorSelect: any[] = [];
  dataCoordinadorSelect: any[] = [];
  dataTipoFecha: any[] = [];

  dataModalidad: any[] = [];
  dataEstadoAsesores: any[] = [];
  dataPGeneral: any[] = [];
  dataPGeneralChange: any[] = [];
  dataPEspecifico: any[] = [];
  dataPEspecificoChange: any[] = [];

  dataCiudades: any[] = [
    { id: 'Arequipa', nombre: 'Arequipa', idModalidad: 'Presencial' },
    { id: 'LIMA', nombre: 'LIMA', idModalidad: 'Presencial' },
    { id: 'BOGOTA', nombre: 'BOGOTA', idModalidad: 'Presencial' },
  ];
  dataCiudadesChange: any[] = [];

  dataFecha: any[] = [
    { id: true, nombre: 'Creacion de oportunidad' },
    { id: false, nombre: 'Cierre de oportunidad' },
  ];
  ejecuto: boolean = false;
  loader: boolean = false;
  buttonDisable: boolean = true;
  dataEstadoPersonal: any = [
    { id: 1, nombre: 'Activo' },
    { id: 2, nombre: 'Inactivo' },
  ];
  public value = 5;
  get fechaActual(): Date {
    return new Date();
  }
  ngOnInit(): void {
    this.obtenerDatosPersonal();
    this.getCombos();
  }
  obtenerDatosPersonal() {
    this.idPersonal = this.userService.idPersonal;
    this.UserName = this.userService.userName;
  }
  getReporteTazaConversion() {

    let subareasaux: any[] = [];
    let pgeneralaux: any[] = [];
    let pespecificoaux: any[] = [];
    const dataForm = this.formFiltro.getRawValue();
    dataForm.subareas.forEach((e: any) => {
      subareasaux.push(e.id);
    });
    dataForm.pgeneral.forEach((e: any) => {
      pgeneralaux.push(e.id);
    });
    dataForm.pespecifico.forEach((e: any) => {
      pespecificoaux.push(e.id);
    });
    let formmatoPrueba = {
      areas: dataForm.areas,
      subareas: subareasaux,
      pgeneral: pgeneralaux,
      pespecifico: pespecificoaux,
      modalidades: dataForm.modalidades,
      ciudades: dataForm.ciudades,
      fecha: dataForm.fecha,
      coordinadores: dataForm.coordinadores,
      asesores: dataForm.asesores,
      FechaInicio: datePipeTransform(dataForm.FechaInicioTemp, 'yyyy-MM-dd'),
      FechaFin: datePipeTransform(dataForm.FechaFinTemp, 'yyyy-MM-dd'),
    };
    if(new Date(formmatoPrueba.FechaFin) < new Date(formmatoPrueba.FechaInicio)){
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido'
      });
      return;
    }
    this.gridComplemento = [];
    this.buttonDisable = false;
    this.ejecuto = false;
    this.loader = true;
    this.index1 = 0;

    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteTasaConversionConsolidadaGenerarReporteTasas,
        formmatoPrueba
      )
      .subscribe({
        next: (data: HttpResponse<TasaConversion>) => {
          if (data.body.records.length <= 0) {
            this.alertaService.swalFireOptions({
              title: 'Sin Registros',
              icon: 'info',
            });
            this.loader = false;
          } else {
            let rpta = data.body;
            let con = 0;
            rpta.records2.forEach((e) => {
              rpta.records2[con].l.forEach((element) => {
                this.gridComplemento.push({
                  title: element.nombreGrupo,
                  grid: new KendoGrid(),
                  columnGroup: {},
                });
              });
              con += 1;
            });
            let obj: IRecord = {
              g: 'Total',
              l: [],
            };
            data.body.records.forEach((d) => {
              obj.l = obj.l.concat(d.l);
            });
            this.generarGridTasaConversionAsesorTotal(
              obj,
              data.body.records3
              // data.body.records4
            );
            let index = 0;
            data.body.records.forEach((g) => {
              this._generarGridTasaConversionAsesor(g, index);
              index++;
            });
            this._generarGridTasaConversionAsesorPaisesTotal(
              obj,
              data.body.records5
              // data.body.records4
            );
            data.body.records2.forEach((g) => {
              this._generarGridTasaConversionAsesorPais(
                g.l
                // data.body.records4
              );
            });
          }
        },
        complete: () => {
          this.ejecuto = true;
          this.loader = false;
          this.buttonDisable = true;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Reporte generado',
            showConfirmButton: false,
            timer: 2500,
          });
        },
        error: (error: any) => {
          this.ejecuto = true;
          this.loader = false;
          this.buttonDisable = true;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error.title,
          });
        },
      });
  }
  generarGridTasaConversionAsesorTotal(
    dataMain: IRecord,
    dataPrecio: Records3[]
    // precioPromedio: any
  ) {
    this.dataConsolidado.push(dataMain);
    let muestraAsesores: { [key: string]: number } = {};
    let muestraAsesoresByGrupo: { [key: string]: number } = {};
    // let muestraGrupos: any = {};
    let cerradasGrupos: { [key: string]: number } = {};
    let cerradasGruposLista: {
      grupo: number;
      valor: number;
    }[] = [];
    let asesores: {
      idAsesor: number;
      nombreAsesor: string;
      nombreCoordinador: string;
    }[] = [];
    let mdataAsesores: {
      [key: string]: {
        grupo: number;
        valor: number;
      }[];
    } = {};
    let datosInit = dataMain.l;
    let totalOCMeta: number = 0;
    let cerradasGruposSenior: { [key: string]: number } = {};
    let cerradasGruposJunior: { [key: string]: number } = {};
    let cerradasGruposListaSenior: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaJunior: {
      grupo: number;
      valor: number;
    }[] = [];

    datosInit.forEach((da) => {
      if (!mdataAsesores[da.idasesor])
        mdataAsesores[da.idasesor] = [];
      if (!muestraAsesoresByGrupo[`${da.idasesor},${da.grupo}`]) {
        muestraAsesoresByGrupo[`${da.idasesor},${da.grupo}`] =
          da.oportunidadesCerradas;
        mdataAsesores[da.idasesor].push({
          grupo: da.grupo,
          valor: da.tcMeta,
        });
      } else {
        muestraAsesoresByGrupo[`${da.idasesor},${da.grupo}`] =
          muestraAsesoresByGrupo[`${da.idasesor},${da.grupo}`] +
          da.oportunidadesCerradas;
      }
      let asesor = da.idasesor;
      if (!muestraAsesores[asesor]) {
        muestraAsesores[asesor] = 1;
        asesores.push({
          idAsesor: da.idasesor,
          nombreAsesor: da.nombre,
          nombreCoordinador: da.nombreCoordinador,
        });
      }
      if (!cerradasGrupos[da.grupo]) {
        cerradasGruposLista.push({
          grupo : da.grupo,
          valor : da.tcMeta,
        });
        cerradasGrupos[da.grupo] = da.oportunidadesCerradas;
      } else {
        cerradasGrupos[da.grupo] =
          cerradasGrupos[da.grupo] + da.oportunidadesCerradas;
      }
      totalOCMeta = totalOCMeta + da.oportunidadesCerradas;
      //Agregado para division Senior  o Junior
      let precios = dataPrecio.find((item) => {
        return item.idAsesor == da.idasesor;
      });
      try{
        if(precios != null){
          if (precios.precioPromedio >= 2000) {
            if (!cerradasGruposSenior[da.grupo]) {
              cerradasGruposListaSenior.push({
                grupo: da.grupo,
                valor: da.tcMeta,
              });
              cerradasGruposSenior[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposSenior[da.grupo] =
                cerradasGruposSenior[da.grupo] + da.oportunidadesCerradas;
            }
          } else {
            if (!cerradasGruposJunior[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaJunior.push(obj);
              cerradasGruposJunior[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposJunior[da.grupo] =
                cerradasGruposJunior[da.grupo] + da.oportunidadesCerradas;
            }
          }
        }
      }catch(error){
        console.log(error);
      }
    });

    cerradasGruposLista.forEach((da) => {
      this.totalMetaFinal =
        this.totalMetaFinal + cerradasGrupos[da.grupo] * da.valor;
    });
    this.totalMetaFinal =
      totalOCMeta == 0 ? 0 : this.totalMetaFinal / totalOCMeta;
    this.totalMetaFinal = Math.round(this.totalMetaFinal * 100) / 100;

    let finalTCmeta: { [key: string]: number } = {};
    let asesoresSenior: any = [];
    let asesoresJunior: any = [];
    asesores.forEach((pt) => {
      let idAsesor = pt.idAsesor;
      let totalOC = 0;
      let TCmeta = 0;
      mdataAsesores[idAsesor].forEach((datos: any) => {
        totalOC =
          totalOC + muestraAsesoresByGrupo[`${idAsesor},${datos.grupo}`];
        TCmeta =
          TCmeta +
          muestraAsesoresByGrupo[`${idAsesor},${datos.grupo}`] * datos.valor;
      });

      let metaAsesor = this.calcularTCFila(TCmeta, totalOC);
      if (!finalTCmeta[idAsesor]) {
        finalTCmeta[idAsesor] = metaAsesor;
      }
      //Para Tipo Asesores
      let ingresosAsesor = dataPrecio.find((item: any) => {
        return item.idasesor === idAsesor;
      });
      if(ingresosAsesor != null){
        let obj: any = {};
        obj.nombreCoordinador = pt.nombreCoordinador;
        obj.nombreAsesor = pt.nombreAsesor;
        obj.IdAsesor = idAsesor;
        obj.inscritos = ingresosAsesor.oportunidadesOCAnyIS;
        obj.cerradas = ingresosAsesor.oportunidadesOCTotal;
        obj.TC =
          ingresosAsesor.oportunidadesOCTotal == 0
            ? 0
            : ingresosAsesor.oportunidadesOCAnyIS /
              ingresosAsesor.oportunidadesOCTotal;
        obj.TCMeta = Math.round(metaAsesor * 100) / 100 / 100;
        obj.RealByMeta = Math.round((obj.TC * 100 * 100) / metaAsesor);
        obj.ingresoMetaPromedio = Math.round(ingresosAsesor.precioPromedio);
        obj.ingresoRealPromedio =
          ingresosAsesor.oportunidadesOCAnyIS == 0
            ? 0
            : Math.round(
                Math.round(ingresosAsesor.ingresoReal) /
                  ingresosAsesor.oportunidadesOCAnyIS
              );
        obj.ingresoReal =
          ingresosAsesor.oportunidadesOCAnyIS == 0
            ? 0
            : Math.round(ingresosAsesor.ingresoReal);
        obj.ingresoMes =
          ingresosAsesor.oportunidadesOCAnyIS == 0
            ? 0
            : Math.round(ingresosAsesor.ingresoMes);
        obj.DescuentoPromedio =
          ingresosAsesor.oportunidadesOCAnyIS == 0
            ? 0
            : Math.round(ingresosAsesor.descuentoPromedio);
        obj.ingresoMeta = Math.round(
          obj.TCMeta *
            ingresosAsesor.oportunidadesOCTotal *
            obj.ingresoMetaPromedio
        );
        obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
        if (ingresosAsesor.precioPromedio >= 2000) {
          asesoresSenior.push(obj);
        } else {
          asesoresJunior.push(obj);
        }
      }
    });

    let finalPrecioPromedio: any = {};
    let finalPrecioIngresoReal: any = {};
    let finalPrecioIngresoMes: any = {};
    let finalPrecioDescuentoPromedio: any = {};
    let total_asesores: any = 0;
    dataPrecio.forEach((da: any) => {
      if (!finalPrecioPromedio[da.idasesor]) {
        finalPrecioPromedio[da.idasesor] = da.precioPromedio;
        let ingresoReal = Math.round(da.ingresoReal);
        let ingresoMes = Math.round(da.ingresoMes);
        let DescuentoPromedio = Math.round(da.descuentoPromedio);
        total_asesores = total_asesores + 1;
        //let finalReal = da.oportunidadesOCTotal == 0 ? 0 : ingresoReal / da.oportunidadesOCTotal;
        let finalReal =
          da.oportunidadesOCAnyIS == 0
            ? 0
            : ingresoReal / da.oportunidadesOCAnyIS;
        let finalmes =
          da.oportunidadesOCAnyIS == 0
            ? 0
            : ingresoMes / da.oportunidadesOCAnyIS;
        let finaldescuento =
          da.oportunidadesOCAnyIS == 0
            ? 0
            : DescuentoPromedio / da.oportunidadesOCAnyIS;
        finalPrecioIngresoReal[da.idasesor] = Math.round(finalReal);
        finalPrecioIngresoMes[da.idasesor] = Math.round(finalmes);
        finalPrecioDescuentoPromedio[da.idasesor] = Math.round(finaldescuento);
      }
    });
    // Fin ----------------------
    let mdata: any = {};
    let todoData = dataMain.l;
    let columnas: any = [];
    let muestra: any = {};
    let muestraIS: any = {};
    let muestraFinal: any = [];
    let agregatesFix = [];
    let filtro: any = [];

    todoData.forEach((da: any) => {
      let asesor = da.idasesor;
      if (!muestra[asesor]) {
        idasesor: da.idasesor;
        muestra[asesor] = da.oportunidadesCerradas;
        muestraIS[asesor] = da.inscritosMatriculados;
      } else {
        muestra[asesor] = muestra[asesor] + da.oportunidadesCerradas;
        muestraIS[asesor] = muestraIS[asesor] + da.inscritosMatriculados;
      }
    });
    for (let id in muestra) {
      if (muestra[id] > this.limite) filtro.push(Number(id));
    }
    todoData.forEach((da: any) => {
      let llave = da.nombre;
      if (!this.asesorCumple(filtro, da.idasesor)) {
        llave = 'Otros';
        da.nombre = 'Otros';
        da.nombreCoordinador = ' Otros';
      }
      if (!mdata[llave]) {
        mdata[llave] = {
          nombre: da.nombre,
          nombreCoordinador: da.nombreCoordinador,
        };
        columnas.forEach((col: any) => {
          col.columns.forEach((c: any) => {
            mdata[llave][c.field] = null;
          });
        });
        mdata[llave]['CTotalIS'] = 0;
        mdata[llave]['CTotalOC'] = 0;
        mdata[llave]['CTotalTC'] = 0;
        mdata[llave]['CTotalTCMeta'] = 0;
        mdata[llave]['PPromedio'] = 0;
        mdata[llave]['IReal'] = 0;
        mdata[llave]['IMeta'] = 0;
        mdata[llave]['IMetaByIReal'] = 0;
        mdata[llave]['RealByMeta'] = 0;
        mdata[llave]['promedioIngresoReal'] = 0;
        //if (asesorCumple(filtro, da.idasesor)) {
        mdata[llave]['A_' + da.pais + 'IS'] = da.inscritosMatriculados;
        mdata[llave]['A_' + da.pais + 'OC'] = da.oportunidadesCerradas;
        mdata[llave]['A_' + da.pais + 'TC'] = this.calcularTCFila(
          mdata[llave]['A_' + da.pais + 'IS'],
          mdata[llave]['A_' + da.pais + 'OC']
        );
        //mdata[llave]['BAgrupadoIS'] = 0;
        //mdata[llave]['BAgrupadoOC'] = 0;
        //mdata[llave]['BAgrupadoTC'] = 0;

        //}
        //else {
        //    mdata[llave]['BAgrupadoIS'] = da.inscritosMatriculados;
        //    mdata[llave]['BAgrupadoOC'] = da.oportunidadesCerradas;
        //    mdata[llave]['BAgrupadoTC'] = calcularTCFila(mdata[llave]['BAgrupadoIS'], mdata[llave]['BAgrupadoOC']);
        //}
      } else {
        //if (asesorCumple(filtro, da.idasesor)) {
        if (
          isNaN(mdata[llave]['A_' + da.pais + 'IS']) ||
          isNaN(mdata[llave]['A_' + da.pais + 'OC'])
        ) {
          mdata[llave]['A_' + da.pais + 'IS'] = da.inscritosMatriculados;
          mdata[llave]['A_' + da.pais + 'OC'] = da.oportunidadesCerradas;
          mdata[llave]['A_' + da.pais + 'TC'] = mdata[llave][
            'A_' + da.pais + 'TC'
          ] = this.calcularTCFila(
            mdata[llave]['A_' + da.pais + 'IS'],
            mdata[llave]['A_' + da.pais + 'OC']
          );
        } else {
          mdata[llave]['A_' + da.pais + 'IS'] =
            mdata[llave]['A_' + da.pais + 'IS'] + da.inscritosMatriculados;
          mdata[llave]['A_' + da.pais + 'OC'] =
            mdata[llave]['A_' + da.pais + 'OC'] + da.oportunidadesCerradas;
          mdata[llave]['A_' + da.pais + 'TC'] = mdata[llave][
            'A_' + da.pais + 'TC'
          ] = this.calcularTCFila(
            mdata[llave]['A_' + da.pais + 'IS'],
            mdata[llave]['A_' + da.pais + 'OC']
          );
        }

        //}
        //else {
        //    mdata[llave]['BAgrupadoIS'] = mdata[llave]['BAgrupadoIS'] + da.inscritosMatriculados;
        //    mdata[llave]['BAgrupadoOC'] = mdata[llave]['BAgrupadoOC'] + da.oportunidadesCerradas;
        //    mdata[llave]['BAgrupadoTC'] = calcularTCFila(mdata[llave]['BAgrupadoIS'], mdata[llave]['BAgrupadoOC']);
        //}
      }

      mdata[llave]['CTotalIS'] =
        mdata[llave]['CTotalIS'] + da.inscritosMatriculados;
      mdata[llave]['CTotalOC'] =
        mdata[llave]['CTotalOC'] + da.oportunidadesCerradas;
      let TCREAL = this.calcularTCFila(
        mdata[llave]['CTotalIS'],
        mdata[llave]['CTotalOC']
      );
      mdata[llave]['CTotalTC'] = TCREAL;
      TCREAL = TCREAL * 100;
      TCREAL = Math.round(TCREAL * 100) / 100;

      mdata[llave]['CTotalTC'] = mdata[llave]['CTotalTC'];
      mdata[llave]['CTotalTCMeta'] =
        Math.round(finalTCmeta[da.idasesor] * 100) / 100 / 100;
      let TCMETA = finalTCmeta[da.idasesor];
      TCMETA = Math.round(TCMETA * 100) / 100;
      mdata[llave]['RealByMeta'] = Math.round((TCREAL / TCMETA) * 100) / 100;
      //mdata[llave]['RealByMeta'] = Math.round(mdata[llave]['RealByMeta'] * 100) + '%';
      mdata[llave]['RealByMeta'] = Math.round(mdata[llave]['RealByMeta'] * 100);
      this.calcularTCFila(TCREAL, mdata[llave]['CTotalTCMeta']);

      mdata[llave]['PPromedio'] = Math.round(finalPrecioPromedio[da.idasesor]);
      mdata[llave]['IReal'] = Math.round(
        (muestra[da.idasesor] * TCREAL * mdata[llave]['PPromedio']) / 100
      );
      mdata[llave]['IMeta'] = Math.round(
        (muestra[da.idasesor] * TCMETA * mdata[llave]['PPromedio']) / 100
      );
      mdata[llave]['IMetaByIReal'] =
        mdata[llave]['IMeta'] == 0
          ? 0
          : (mdata[llave]['IReal'] * 1.0) / (mdata[llave]['IMeta'] * 1.0);
      mdata[llave]['promedioIngresoReal'] = finalPrecioIngresoReal[da.idasesor];
      mdata[llave]['IngresoRealIS'] =
        finalPrecioIngresoReal[da.idasesor] * mdata[llave]['CTotalIS'];
      mdata[llave]['IngresoRealMES'] =
        finalPrecioIngresoMes[da.idasesor] * mdata[llave]['CTotalIS'];
      mdata[llave]['IngresoRealDESCUENTO'] =
        finalPrecioDescuentoPromedio[da.idasesor] * mdata[llave]['CTotalIS'];
      mdata[llave]['IMetaISByIReal'] =
        mdata[llave]['IMeta'] == 0
          ? 0
          : (mdata[llave]['IngresoRealIS'] * 1.0) /
            (mdata[llave]['IMeta'] * 1.0);
      //mdata[llave]['IMetaISByIReal'] = Math.round(mdata[llave]['IMetaISByIReal'] * 100) + '%';
      mdata[llave]['IMetaISByIReal'] = Math.round(
        mdata[llave]['IMetaISByIReal'] * 100
      );

      mdata[llave]['idcategoriaOrigen'] = da.idcategoriaOrigen;
      mdata[llave]['probabilidad'] = dataMain.g;
    });
    let datos = [];
    for (let dat in mdata) {
      datos.push(mdata[dat]);
    }

    // if ($("#gridASesor").data("kendoGrid")) {
    //     $("#gridASesor").data("kendoGrid").destroy();
    //     $("#gridASesor").empty();
    //     if ($("#gridPais").data("kendoGrid")) {
    //         $("#gridPais").data("kendoGrid").destroy();
    //         $("#gridPais").empty();
    //     }
    // }
    //Columnas

    let total = {
      title: 'Total',
      attributes: { style: 'text-align:center;' },
      headerAttributes: { style: 'text-align:center; font-size: 14px;' },
      width: 400,
      columns: [
        {
          field: 'CTotalIS',
          title: 'IS',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          footerTemplate: '#: sum #',
          aggregates: ['sum'],
          width: 70,
        },
        {
          field: 'CTotalOC',
          title: 'OC',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          footerTemplate: '#: sum #',
          aggregates: ['sum'],
          width: 70,
        },
        {
          field: 'CTotalTC',
          title: 'TC Real',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; font-weight: bold;' },
          footerTemplate: "#=calcularTCTotal(data,'CTotalIS','CTotalOC')+'%'#",
          format: '{0:p}',
          width: 70,
        },
        {
          field: 'CTotalTCMeta',
          title: 'TC Meta',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; font-weight: bold;' },
          footerTemplate: "#=totalMetaFinal+'%'#",
          format: '{0:p}',
          width: 70,
        },
        {
          field: 'RealByMeta',
          title: 'Real/Meta',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; font-weight: bold;' },
          footerTemplate:
            "#=calcularTCTotalV2(data,'CTotalIS','CTotalOC')+'%'#",
          template: "#=RealByMeta+'%'#",
          //format: "{0:p}",
          width: 90,
        },
      ],
    };
    let ingresos = {
      title: 'Ingresos',
      attributes: { style: 'text-align:center;' },
      headerAttributes: { style: 'text-align:center; font-size: 14px;' },
      width: 400,
      columns: [
        {
          field: 'promedioIngresoReal',
          title: 'PP IS-M US$',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          //footerTemplate: "#: sum #", aggregates: ["sum"],
          //footerTemplate: "#=calcularPromedio(data,'promedioIngresoReal')#",
          footerTemplate:
            "#=calcularTCTotalV3(data,'IngresoRealIS','CTotalIS')#",
          width: 90,
        },
        {
          field: 'PPromedio',
          title: 'PP OC US$',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          //footerTemplate: "#: sum #", aggregates: ["sum"],
          //footerTemplate: "#=calcularPromedio(data,'PPromedio')#",
          footerTemplate: "#=calcularTCTotalV4(data,'IMeta','CTotalOC')#",
          width: 90,
        },
        {
          title: '% PP IS-M/PP OC',
          field: 'IMCASE',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; ' },
          footerAttributes: { style: 'text-align:center; ' },
          width: 140,
          template: '#=calcularTCV6(promedioIngresoReal,PPromedio)#',
          footerTemplate:
            "#=calcularTCTotalV6_2(data,'IngresoRealIS','CTotalIS','IMeta','CTotalOC')+'%'#",
        },
        {
          field: 'IngresoRealMES',
          title: 'Ingreso en el mes US$',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          footerAttributes: { style: 'text-align:center; ' },
          footerTemplate: '#: sum #',
          aggregates: ['sum'],
          width: 170,
        },
        {
          title: '% Ingreso en el mes',
          field: 'IMCASE2',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; ' },
          footerAttributes: { style: 'text-align:center; ' },
          width: 150,
          template: '#=calcularTCV7(IngresoRealMES,IngresoRealIS)#',
          footerTemplate:
            "#=calcularTCTotalV7(data,'IngresoRealMES','IngresoRealIS')#",
        },
        {
          field: 'IngresoRealDESCUENTO',
          title: '% Descuento Promedio',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          footerTemplate: "#: kendo.toString(average, '0')+'%' #",
          aggregates: ['average'],
          footerAttributes: { style: 'text-align:center; ' },
          template: "#=IngresoRealDESCUENTO+'%'#",
          width: 170,
        },
        {
          field: 'IngresoRealIS',
          title: 'IR US$',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          footerTemplate: '#: sum #',
          aggregates: ['sum'],
          width: 90,
        },
        //{
        //    field: 'IReal', title: "Ingreso Real US$",
        //    attributes: { style: "text-align:center;" },
        //    headerAttributes: { style: "text-align:center;" },
        //    footerTemplate: "#: sum #", aggregates: ["sum"],
        //    width: 120
        //},
        {
          field: 'IMeta',
          title: 'IM US$',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center' },
          footerTemplate: '#: sum #',
          aggregates: ['sum'],
          width: 90,
        },
        //{
        //    field: 'IMetaByIReal', title: "IR/IM",
        //    attributes: { style: "text-align:center;" },
        //    headerAttributes: { style: "text-align:center; font-weight: bold;" },
        //    footerTemplate: "#=calcularTCTotal(data,'IReal','IMeta')+'%'#",
        //    format: "{0:p}",
        //    width: 70
        //},
        {
          field: 'IMetaISByIReal',
          title: 'IR/IM',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; font-weight: bold;' },
          footerTemplate:
            "#=calcularTCTotal(data,'IngresoRealIS','IMeta')+'%'#",
          template: "#=IMetaISByIReal+'%'#",
          //format: "{0:p}",
          width: 70,
        },
      ],
    };

    let columnasFix = [
      {
        field: 'nombreCoordinador',
        title: 'nombre Coordinador',
        width: 200,
        headerAttributes: {
          style: 'color:#FFFFFF; text-align:center; font-size: 14px;',
        },
        locked: true,
        lockable: false,
        attributes: { style: 'font-size: 11px;' },
      },
      {
        field: 'nombre',
        title: 'nombre Asesor',
        width: 200,
        headerAttributes: {
          style: 'color:#FFFFFF; text-align:center; font-size: 14px;',
        }, //#A0B58D
        footerTemplate: 'Total',
        locked: true,
        lockable: false,
        attributes: { style: 'font-size: 11px;' },
      },
    ];
    if (todoData.length == 0) {
      let obj: any = {};
      obj.g = 0;
      obj.l = [{ pais: 0, nombre: 'qwerty' }];
      todoData.push(obj);
    }
    let temp: any = [];
    todoData.forEach((da: any) => {
      let llave = da.pais;
      if (!temp[llave]) {
        temp[llave] = da;
      }
    });
    temp.forEach((da: any) => {
      //if (asesorCumple(filtro, da.idasesor)) {
      let field1 = 'A_' + da.pais + 'IS';
      let field2 = 'A_' + da.pais + 'OC';
      let field3 = 'A_' + da.pais + 'TC';
      agregatesFix.push(
        { field: field1, aggregate: 'sum' },
        { field: field2, aggregate: 'sum' }
      );
      columnas.push({
        title: da.nombrePais,
        attributes: { style: 'text-align:center;' },
        headerAttributes: { style: 'text-align:center; font-size: 14px;' },
        width: 400,
        columns: [
          {
            field: field1,
            title: 'IS',
            attributes: { style: 'text-align:center;' },
            headerAttributes: { style: 'text-align:center;' },
            footerTemplate: '#: sum #',
            aggregates: ['sum'],
            width: 70,
          },
          {
            field: field2,
            title: 'OC',
            attributes: { style: 'text-align:center;' },
            headerAttributes: { style: 'text-align:center;' },
            footerTemplate: '#: sum #',
            aggregates: ['sum'],
            width: 70,
          },
          {
            field: field3,
            title: 'TC',
            attributes: { style: 'text-align:center;' },
            headerAttributes: {
              style: 'text-align:center; font-weight: bold;',
            },
            footerTemplate:
              "#=calcularTCTotal(data,'" + field1 + "','" + field2 + "')+'%'#",
            format: '#.00 %',
            width: 70,
          },
        ],
      });
      //}
    });
    //if (limite > 0) {
    //    columnas.push(agrupado);
    //}
    columnas.push(total);
    columnas.push(ingresos);
    columnas = columnas.sort((a: any, b: any) => {
      if (a.field < b.field) return 1;
      if (a.field > b.field) return -1;
      return 0;
    });
    datos = datos.sort(function (a, b) {
      if (a.nombreCoordinador < b.nombreCoordinador) return 1;
      if (a.nombreCoordinador > b.nombreCoordinador) return -1;
      return 0;
    });
    let key = dataMain.g;
    let columnasParaDesagregado: any = {};
    columnasParaDesagregado.g = key;
    columnasParaDesagregado.l = columnas;
    this.columnasDetailConsolidado.push(columnasParaDesagregado);
    //columnasDetailConsolidado = columnas;

    agregatesFix.push(
      { field: 'CTotalIS', aggregate: 'sum' },
      { field: 'CTotalOC', aggregate: 'sum' },
      { field: 'PPromedio', aggregate: 'sum' },
      { field: 'IReal', aggregate: 'sum' },
      { field: 'IMeta', aggregate: 'sum' },
      { field: 'IngresoRealIS', aggregate: 'sum' },
      { field: 'IngresoRealMES', aggregate: 'sum' },
      { field: 'IngresoRealDESCUENTO', aggregate: 'average' },
      { field: 'promedioIngresoReal', aggregate: 'sum' },

      { field: 'BAgrupadoIS', aggregate: 'sum' },
      { field: 'BAgrupadoOC', aggregate: 'sum' }
    );

    let id = '#gridAsesor_' + dataMain.g;
    this.categoriaDatoTotal[0].columnGroup = columnas;
    this.categoriaDatoTotal[0].grid.data = datos;

    this._generarGridAsesoresPorTipo(
      asesoresSenior,
      cerradasGruposListaSenior,
      cerradasGruposSenior,
      'gridASesorSenior'
    );
    this._generarGridAsesoresPorTipo(
      asesoresJunior,
      cerradasGruposListaJunior,
      cerradasGruposJunior,
      'gridASesorJunior'
    );
  }

  asesorCumple(array: any, valor: any) {
    let rpta = array.includes(valor);
    return rpta;
  }
  getCombos() {
    let dateFechaActual: Date = new Date();
    this.formFiltro.get('FechaInicioTemp').setValue(dateFechaActual);
    this.formFiltro.get('FechaFinTemp').setValue(dateFechaActual);
    this.dataTipoFecha = [{ id: false, nombre: 'Cierre oportunidad' }];

    this.dataModalidad = [
      { id: 'Presencial', nombre: 'Presencial' },
      { id: 'Online Asincronica', nombre: 'Online Asincronica' },
      { id: 'Online Sincronica', nombre: 'Online Sincronica' },
    ];
    this.dataEstadoAsesores = [
      { id: 2, nombre: 'Activos' },
      { id: 3, nombre: 'Inactivos' },
    ];
    this.integraService
      .getJsonResponse(
        constApiComercial.ReporteTasaConversionConsolidadaObtenerComboArea
      )
      .subscribe({
        next: (data: any) => {
          this.dataAreaFiltro = data.body;
          this.dataArea = data.body;
        },
      });
    this.integraService
      .getJsonResponse(
        constApiComercial.ReporteTasaConversionConsolidadaObtenerComboSubArea
      )
      .subscribe({
        next: (data: any) => {
          this.dataSubAreaFiltro = data.body;
          this.dataSubArea = data.body;
        },
      });
    this.integraService
      .getJsonResponse(
        constApiComercial.ReporteTasaConversionConsolidadaObtenerComboPGeneral
      )
      .subscribe({
        next: (data: any) => {
          this.dataPGeneral = data.body;
        },
      });
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteTasaConversionConsolidadaObtenerCombosReporteTasaConversionConsolidada}${this.idPersonal}`
      )
      .subscribe({
        next: (data: any) => {
          this.dataCoordinador = data.body.coordinadores;
          this.dataAsesor = data.body.asesores;
          this.dataAsesorSelect = this.dataAsesor;
          this.dataAsesorfiltro = this.dataAsesor;
          this.dataCoordinadorSelect = this.dataCoordinador;
          this.dataCoordinadorfiltro = this.dataCoordinador;
        },
      });
    this.integraService
      .getJsonResponse(
        constApiComercial.ReporteTasaConversionConsolidadaObtenerComboPEspecifico
      )
      .subscribe({
        next: (data: any) => {
          this.dataPEspecifico = data.body;
        },
      });
  }

  calcularTCFila(IM: any, OC: any) {
    if (OC > 0) {
      return IM / OC;
    } else {
      return 0;
    }
  }

  calcularTCTotal(data: any, IM: any, OC: any) {
    //eval('probabilidadMuyAltaIM');
    let im: any = 0;
    let oc: any = 0;
    // let stringIM = 'data.' + IM + '.sum';
    // let stringOC = 'data.' + OC + '.sum';
    // let sum, sum2;
    data.forEach((element: any) => {
      if (element[IM] != undefined) {
        im += element[IM];
      }
      if (element[OC] != undefined) {
        oc += element[OC];
      }
    });
    if (oc > 0) {
      let a = String(Math.round(((im * 100) / oc) * 10) / 10);
      return String(Math.round(((im * 100) / oc) * 10) / 10);
    } else {
      return 0;
    }
  }
  calcularTCTotalCategoria(data: any, IM: any, OC: any, meta: any) {
    // var stringIM = 'data.' + IM + '.sum';
    // var stringOC = 'data.' + OC + '.sum';
    // //var stringMeta = 'data.' + meta + '.average';
    let sum = 0,
      sum2 = 0,
      metac = 0,
      con = 0,
      stringMeta;

    data.forEach((element: any) => {
      sum += element[IM];
      sum2 += element[OC];
      metac += element[meta];
      con++;
    });
    stringMeta = metac / con;

    if (stringMeta !== 0 && stringMeta !== undefined) {
      stringMeta = stringMeta * 100; //para quese convierta en entero
    } else {
      return 0;
    }

    if (sum2 > 0) {
      return String(
        (
          (Math.round(((sum * 100) / sum2) * 10) / 10 / stringMeta) *
          100
        ).toFixed(2)
      );
    } else {
      return 0;
    }
  }

  calcularTCTotalV2(data: any, IM: any, OC: any) {
    //eval('probabilidadMuyAltaIM');

    let sum = 0,
      sum2 = 0;

    data.forEach((element: any) => {
      sum += element[IM];
      sum2 += element[OC];
    });

    if (sum2 > 0) {
      let result = (sum * 100) / sum2;
      result = (result / this.totalMetaFinal) * 100;
      result = Math.round(result);

      return String(result);
    } else {
      return 0;
    }
  }

  calcularTCTotalV2_1(data: any, IM: any, OC: any, metaTotal: any) {
    let sum = 0;
    let sum2 = 0;
    data.forEach((element: any) => {
      sum += element[IM];
      sum2 += element[OC];
    });

    if (sum2 > 0) {
      let result = (sum * 100) / sum2;
      result = (result / metaTotal) * 100;
      result = Math.round(result);

      return String(result);
    } else {
      return 0;
    }
  }

  calcularTCTotalV3(data: any, IM: any, OC: any) {
    let sum = 0,
      sum2 = 0;

    data.forEach((element: any) => {
      sum += element[IM];
      sum2 += element[OC];
    });

    if (sum2 > 0) {
      let result = sum / sum2;
      result = Math.floor(result);

      return String(result);
    } else {
      return 0;
    }
  }

  calcularTCV6(preciois: any, preciooc: any) {
    if (preciooc > 0) {
      return Math.trunc((preciois / preciooc) * 100) + ' %';
    } else {
      return 0;
    }
  }

  createAgregates2(columns: any[], data: any[], field: string) {
    if (data.length > 0) {
      let aggregates: AggregateDescriptor[] = [];
      columns.forEach((e) => {
        aggregates.push(
          { field: e.field, aggregate: 'sum' },
          { field: e.field, aggregate: 'average' }
        );
      });
      let total = aggregateBy(data, aggregates);
      if (
        field == 'A_1IS' ||
        field == 'A_1OC' ||
        field == 'A_2IS' ||
        field == 'A_2OC' ||
        field == 'A_3IS' ||
        field == 'A_3OC' ||
        field == 'A_4IS' ||
        field == 'A_4OC' ||
        field == 'A_5IS' ||
        field == 'A_5OC' ||
        field == 'CTotalIS' ||
        field == 'CTotalOC' ||
        field == 'IngresoRealMES' ||
        field == 'IngresoRealIS' ||
        field == 'IMeta'
      ) {
        return total[field].sum;
      } else if (field == 'IngresoRealDESCUENTO') {
        return String(Math.round(total[field].average)) + '%';
      } else if (field == 'A_1TC') {
        //calcularTCTotal(data,'A_1IS','A_1OC')+'%'//=calcularTCTotal(data,'A_2IS','A_2OC')+'%'//calcularTCTotal(data,'A_3IS','A_3OC')+'%'//calcularTCTotal(data,'A_4IS','A_4OC')+'%'//=calcularTCTotal(data,'A_5IS','A_5OC')+'%'//calcularTCTotal(data,'CTotalIS','CTotalOC')+'%'
        return String(this.calcularTCTotal(data, 'A_1IS', 'A_1OC')) + '%';
      } else if (field == 'A_2TC') {
        return String(this.calcularTCTotal(data, 'A_2IS', 'A_2OC')) + '%';
      } else if (field == 'A_3TC') {
        return String(this.calcularTCTotal(data, 'A_3IS', 'A_3OC')) + '%';
      } else if (field == 'A_4TC') {
        return String(this.calcularTCTotal(data, 'A_4IS', 'A_4OC')) + '%';
      } else if (field == 'A_5TC') {
        return String(this.calcularTCTotal(data, 'A_5IS', 'A_5OC')) + '%';
      } else if (field == 'CTotalTC') {
        //calcularTCTotal(data,'A_1IS','A_1OC')+'%'//=calcularTCTotal(data,'A_2IS','A_2OC')+'%'//calcularTCTotal(data,'A_3IS','A_3OC')+'%'//calcularTCTotal(data,'A_4IS','A_4OC')+'%'//=calcularTCTotal(data,'A_5IS','A_5OC')+'%'//calcularTCTotal(data,'CTotalIS','CTotalOC')+'%'
        return String(this.calcularTCTotal(data, 'CTotalIS', 'CTotalOC')) + '%';
      } else if (field == 'CTotalTCMeta') {
        // return total[field].average+"%";
        return String(this.totalMetaFinal) + '%';
      } else if (field == 'RealByMeta') {
        return this.calcularTCTotalV2(data, 'CTotalIS', 'CTotalOC') + '%';
      } else if (field == 'promedioIngresoReal') {
        return this.calcularTCTotalV3(data, 'IngresoRealIS', 'CTotalIS');
      } else if (field == 'PPromedio') {
        return this.calcularTCTotalV4(data, 'IMeta', 'CTotalOC');
      } else if (field == 'IMCASE') {
        return (
          this.calcularTCTotalV6_2(
            data,
            'IngresoRealIS',
            'CTotalIS',
            'IMeta',
            'CTotalOC'
          ) + '%'
        );
      } else if (field == 'IMCASE2') {
        return this.calcularTCTotalV7(data, 'IngresoRealMES', 'IngresoRealIS');
      } else if (field == 'IMetaISByIReal') {
        return this.calcularTCTotal(data, 'IngresoRealIS', 'IMeta') + '%';
      }
    }
    return 0;
  }

  calcularTCTotalV4(data: any, IM: any, OC: any) {
    //eval('probabilidadMuyAltaIM');
    // var stringIM = 'data.' + IM + '.sum';
    // var stringOC = 'data.' + OC + '.sum';

    // sum = eval(stringIM);
    // sum2 = eval(stringOC);
    let sum = 0,
      sum2 = 0;
    data.forEach((element: any) => {
      sum += element[IM];
      sum2 += element[OC];
    });

    if (sum2 > 0) {
      var result = sum / sum2;
      result = (result / this.totalMetaFinal) * 100;
      result = Math.floor(result);

      return String(result);
    } else {
      return 0;
    }
  }

  calcularTCTotalV6_2(
    data: any,
    ingresois: any,
    is: any,
    ingresooc: any,
    oc: any
  ) {
    // var stringIIS = 'data.' + ingresois + '.sum';
    // var stringIS = 'data.' + is + '.sum';

    // var stringIOC = 'data.' + ingresooc + '.sum';
    // var stringOC = 'data.' + oc + '.sum';

    let sumIS = 0,
      sumOC = 0,
      sumIIS = 0,
      sumIOC = 0;

    // sumIS = eval(stringIS);
    // sumIIS = eval(stringIIS);

    // sumOC = eval(stringOC);
    // sumIOC = eval(stringIOC);
    data.forEach((element: any) => {
      sumIS += element[is];
      sumIIS += element[ingresois];
      sumOC += element[oc];
      sumIOC += element[ingresooc];
    });

    var PPIS = 0;
    var PPOC = 0;

    //////////////////////////////////////////
    if (sumIS > 0) {
      var result = sumIIS / sumIS;
      PPIS = Math.floor(result);
    } else {
      PPIS = 0;
    }

    //////////////////////////////////////////

    if (sumOC > 0) {
      var result2 = sumIOC / sumOC;
      result2 = (result2 / this.totalMetaFinal) * 100;
      PPOC = Math.floor(result2);
    } else {
      PPOC = 0;
    }

    if (PPOC > 0) {
      var result3 = (PPIS / PPOC) * 100;
      return Math.floor(result3);
    } else {
      return 0;
    }
  }

  calcularTCTotalV7(data: any, ingresomes: any, ingresoreal: any) {
    let sum = 0,
      sum2 = 0;

    data.forEach((element: any) => {
      sum += element[ingresomes];
      sum2 += element[ingresoreal];
    });

    if (sum2 > 0) {
      return Math.trunc((sum / sum2) * 100) + ' %';
    } else {
      return 0;
    }
  }

  calcularTCV7(ingresomes: any, ingresoreal: any) {
    if (ingresoreal > 0) {
      return Math.trunc((ingresomes / ingresoreal) * 100) + ' %';
    } else {
      return 0;
    }
  }

  _generarGridAsesoresPorTipo(
    datosGrid: any,
    grupos: any,
    cerradasGrupo: any,
    nombre: any
  ) {
    let totalOC = 0;
    this.MetaFinalTipoAsesor = 0;
    grupos.forEach((da: any) => {
      this.MetaFinalTipoAsesor =
        this.MetaFinalTipoAsesor + cerradasGrupo[da.grupo] * da.valor;
      totalOC = totalOC + cerradasGrupo[da.grupo];
    });
    this.MetaFinalTipoAsesor =
      totalOC == 0 ? 0 : this.MetaFinalTipoAsesor / totalOC;
    this.MetaFinalTipoAsesor = Math.round(this.MetaFinalTipoAsesor * 100) / 100;

    this.gridData = process(datosGrid, this.state);
    this.aggregates = [
      { field: 'inscritos', aggregate: 'sum' },
      { field: 'cerradas', aggregate: 'sum' },
      { field: 'ingresoMes', aggregate: 'sum' },
      { field: 'DescuentoPromedio', aggregate: 'average' },
      { field: 'ingresoReal', aggregate: 'sum' },
      { field: 'ingresoMeta', aggregate: 'sum' },
    ];
    if (nombre == 'gridASesorSenior') {
      this.metaAsesorSenior = this.MetaFinalTipoAsesor;
      this.gridASesorSenior.data = datosGrid;
      this.total4 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorSeniorPeru') {
      this.metaAsesorSeniorPeru = this.MetaFinalTipoAsesor;
      this.gridASesorSeniorPeru.data = datosGrid;
      this.total5 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorSeniorColombia') {
      this.metaAsesorSeniorColombia = this.MetaFinalTipoAsesor;
      this.gridASesorSeniorColombia.data = datosGrid;
      this.total6 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorSeniorBolivia') {
      this.metaAsesorSeniorBolivia = this.MetaFinalTipoAsesor;
      this.gridASesorSeniorBolivia.data = datosGrid;
      this.total7 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorSeniorMexico') {
      this.metaAsesorSeniorMexico = this.MetaFinalTipoAsesor;
      this.gridASesorSeniorMexico.data = datosGrid;
      this.total8 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorSeniorOtros') {
      this.metaAsesorSeniorOtros = this.MetaFinalTipoAsesor;
      this.gridASesorSeniorOtros.data = datosGrid;
      this.total9 = aggregateBy(datosGrid, this.aggregates);
    }

    if (nombre == 'gridASesorJunior') {
      this.metaAsesorJunior = this.MetaFinalTipoAsesor;
      this.gridASesorJunior.data = datosGrid;
      this.total10 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorJuniorPeru') {
      this.metaAsesorJuniorPeru = this.MetaFinalTipoAsesor;
      this.gridASesorJuniorPeru.data = datosGrid;
      this.total11 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorJuniorColombia') {
      this.metaAsesorJuniorColombia = this.MetaFinalTipoAsesor;
      this.gridASesorJuniorColombia.data = datosGrid;
      this.total12 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorJuniorBolivia') {
      this.metaAsesorJuniorBolivia = this.MetaFinalTipoAsesor;
      this.gridASesorJuniorBolivia.data = datosGrid;
      this.total13 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorJuniorMexico') {
      this.metaAsesorJuniorMexico = this.MetaFinalTipoAsesor;
      this.gridASesorJuniorMexico.data = datosGrid;
      this.total14 = aggregateBy(datosGrid, this.aggregates);
    }
    if (nombre == 'gridASesorJuniorOtros') {
      this.metaAsesorJuniorOtros = this.MetaFinalTipoAsesor;
      this.gridASesorJuniorOtros.data = datosGrid;
      this.total15 = aggregateBy(datosGrid, this.aggregates);
    }
  }
  _generarGridTasaConversionAsesor(dataMain: any, indexGrid: number) {
    this.dataConsolidado.push(dataMain);

    let mdata: any = {};
    let todoData = dataMain.l;
    let columnas: any = [];
    let muestra: any = {};
    let muestraFinal: any = [];
    let agregatesFix: any = [];
    let filtro: any = [];

    todoData.forEach((da: any) => {
      let asesor = da.idasesor;
      if (!muestra[asesor]) {
        idasesor: da.idasesor;
        muestra[asesor] = da.oportunidadesCerradas;
      } else {
        muestra[asesor] = muestra[asesor] + da.oportunidadesCerradas;
      }
    });
    for (let id in muestra) {
      if (muestra[id] > this.limite) filtro.push(Number(id));
    }
    todoData.forEach((da: any) => {
      let llave = da.nombre;
      if (!this.asesorCumple(filtro, da.idasesor)) {
        llave = 'Otros';
        da.nombre = 'Otros';
        da.nombreCoordinador = ' Otros';
      }
      if (!mdata[llave]) {
        mdata[llave] = {
          nombre: da.nombre,
          nombreCoordinador: da.nombreCoordinador,
        };
        columnas.forEach((col: any) => {
          col.columns.forEach((c: any) => {
            mdata[llave][c.field] = null;
          });
        });
        mdata[llave]['CTotalIS'] = 0;
        mdata[llave]['CTotalOC'] = 0;
        mdata[llave]['CTotalTC'] = 0;
        //if (asesorCumple(filtro, da.idasesor)) {
        mdata[llave]['A_' + da.pais + 'IS'] = da.inscritosMatriculados;
        mdata[llave]['A_' + da.pais + 'OC'] = da.oportunidadesCerradas;
        mdata[llave]['A_' + da.pais + 'TC'] = this.calcularTCFila(
          mdata[llave]['A_' + da.pais + 'IS'],
          mdata[llave]['A_' + da.pais + 'OC']
        );
      } else {
        if (
          isNaN(mdata[llave]['A_' + da.pais + 'IS']) ||
          isNaN(mdata[llave]['A_' + da.pais + 'OC'])
        ) {
          mdata[llave]['A_' + da.pais + 'IS'] = da.inscritosMatriculados;
          mdata[llave]['A_' + da.pais + 'OC'] = da.oportunidadesCerradas;
          mdata[llave]['A_' + da.pais + 'TC'] = mdata[llave][
            'A_' + da.pais + 'TC'
          ] = this.calcularTCFila(
            mdata[llave]['A_' + da.pais + 'IS'],
            mdata[llave]['A_' + da.pais + 'OC']
          );
        } else {
          mdata[llave]['A_' + da.pais + 'IS'] =
            mdata[llave]['A_' + da.pais + 'IS'] + da.inscritosMatriculados;
          mdata[llave]['A_' + da.pais + 'OC'] =
            mdata[llave]['A_' + da.pais + 'OC'] + da.oportunidadesCerradas;
          mdata[llave]['A_' + da.pais + 'TC'] = mdata[llave][
            'A_' + da.pais + 'TC'
          ] = this.calcularTCFila(
            mdata[llave]['A_' + da.pais + 'IS'],
            mdata[llave]['A_' + da.pais + 'OC']
          );
        }
      }
      mdata[llave]['CTotalIS'] =
        mdata[llave]['CTotalIS'] + da.inscritosMatriculados;
      mdata[llave]['CTotalOC'] =
        mdata[llave]['CTotalOC'] + da.oportunidadesCerradas;
      mdata[llave]['CTotalTC'] = this.calcularTCFila(
        mdata[llave]['CTotalIS'],
        mdata[llave]['CTotalOC']
      );
      mdata[llave]['idcategoriaOrigen'] = da.idcategoriaOrigen;
      mdata[llave]['probabilidad'] = dataMain.g;
    });
    let datos = [];
    for (let dat in mdata) {
      datos.push(mdata[dat]);
    }

    let total = {
      title: 'Total',
      attributes: { style: 'text-align:center;' },
      headerAttributes: { style: 'text-align:center; font-size: 14px;' },
      width: 200,
      columns: [
        {
          field: 'CTotalIS',
          title: 'IS',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          footerTemplate: '#: sum #',
          aggregates: ['sum'],
          width: 70,
        },
        {
          field: 'CTotalOC',
          title: 'OC',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          footerTemplate: '#: sum #',
          aggregates: ['sum'],
          width: 70,
        },
        {
          field: 'CTotalTC',
          title: 'TC',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; font-weight: bold;' },
          footerTemplate: "#=calcularTCTotal(data,'CTotalIS','CTotalOC')+'%'#",
          format: '{0:p}',
          width: 70,
        },
      ],
    };

    let columnasFix = [
      {
        field: 'nombreCoordinador',
        title: 'nombre Coordinador',
        width: 300,
        headerAttributes: {
          style: 'color:#FFFFFF; text-align:center; font-size: 14px;',
        },
      },
      {
        field: 'nombre',
        title: 'nombre Asesor',
        width: 300,
        headerAttributes: {
          style: 'color:#FFFFFF; text-align:center; font-size: 14px;',
        }, //#A0B58D
        footerTemplate: 'Total',
      },
    ];
    if (todoData.length == 0) {
      let obj: any = {};
      obj.g = 0;
      obj.l = [{ pais: 0, nombre: 'qwerty' }];
      todoData.push(obj);
    }
    let temp: any = [];
    todoData.forEach((da: any) => {
      let llave = da.pais;
      if (!temp[llave]) {
        temp[llave] = da;
      }
    });
    temp.forEach((da: any) => {
      let field1 = 'A_' + da.pais + 'IS';
      let field2 = 'A_' + da.pais + 'OC';
      let field3 = 'A_' + da.pais + 'TC';
      agregatesFix.push(
        { field: field1, aggregate: 'sum' },
        { field: field2, aggregate: 'sum' }
      );
      columnas.push({
        title: da.nombrePais,
        attributes: { style: 'text-align:center;' },
        headerAttributes: { style: 'text-align:center; font-size: 14px;' },
        width: 400,
        columns: [
          {
            field: field1,
            title: 'IS',
            attributes: { style: 'text-align:center;' },
            headerAttributes: { style: 'text-align:center;' },
            footerTemplate: '#: sum #',
            aggregates: ['sum'],
            width: 70,
          },
          {
            field: field2,
            title: 'OC',
            attributes: { style: 'text-align:center;' },
            headerAttributes: { style: 'text-align:center;' },
            footerTemplate: '#: sum #',
            aggregates: ['sum'],
            width: 70,
          },
          {
            field: field3,
            title: 'TC',
            attributes: { style: 'text-align:center;' },
            headerAttributes: {
              style: 'text-align:center; font-weight: bold;',
            },
            footerTemplate:
              "#=calcularTCTotal(data,'" + field1 + "','" + field2 + "')+'%'#",
            format: '#.00 %',
            width: 70,
          },
        ],
      });
    });

    columnas.push(total);
    columnas = columnas.sort((a: any, b: any) => {
      if (a.field < b.field) return 1;
      if (a.field > b.field) return -1;
      return 0;
    });
    datos = datos.sort(function (a, b) {
      if (a.nombreCoordinador < b.nombreCoordinador) return 1;
      if (a.nombreCoordinador > b.nombreCoordinador) return -1;
      return 0;
    });
    let key = dataMain.g;
    let columnasParaDesagregado: any = {};
    columnasParaDesagregado.g = key;
    columnasParaDesagregado.l = columnas;
    this.columnasDetailConsolidado.push(columnasParaDesagregado);

    agregatesFix.push(
      { field: 'CTotalIS', aggregate: 'sum' },
      { field: 'CTotalOC', aggregate: 'sum' },
      { field: 'BAgrupadoIS', aggregate: 'sum' },
      { field: 'BAgrupadoOC', aggregate: 'sum' }
    );

    this.categoriaDatoConsolidado[indexGrid].columnGroup = columnas;
    this.categoriaDatoConsolidado[indexGrid].grid.data = datos;
  }
  _generarGridTasaConversionAsesorPaisesTotal(
    dataMain: IRecord,
    dataPrecio: Records5[]
    // precioPromedio: any
  ) {
    this.dataConsolidado.push(dataMain);

    let muestraAsesores: { [key: string]: number } = {};
    let muestraAsesoresByGrupo: any = {};
    let muestraGrupos: any = {};
    let cerradasGrupos: any = {};
    let cerradasGruposLista: any = [];
    let asesores: any = [];
    let mdataAsesores: any = {};
    let datosInit = dataMain.l;
    let totalOCMeta = 0;

    let cerradasGruposSeniorPeru: any = {};
    let cerradasGruposSeniorColombia: any = {};
    let cerradasGruposSeniorBolivia: any = {};
    let cerradasGruposSeniorMexico: any = {};
    let cerradasGruposSeniorOtros: any = {};

    let cerradasGruposJuniorPeru: any = {};
    let cerradasGruposJuniorColombia: any = {};
    let cerradasGruposJuniorBolivia: any = {};
    let cerradasGruposJuniorMexico: any = {};
    let cerradasGruposJuniorOtros: any = {};

    let cerradasGruposListaSeniorPeru: any = [];
    let cerradasGruposListaSeniorColombia: any = [];
    let cerradasGruposListaSeniorBolivia: any = [];
    let cerradasGruposListaSeniorMexico: any = [];
    let cerradasGruposListaSeniorOtros: any = [];

    let cerradasGruposListaJuniorPeru: any = [];
    let cerradasGruposListaJuniorColombia: any = [];
    let cerradasGruposListaJuniorBolivia: any = [];
    let cerradasGruposListaJuniorMexico: any = [];
    let cerradasGruposListaJuniorOtros: any = [];

    datosInit.forEach((da: any) => {
      mdataAsesores[da.idasesor] = mdataAsesores[da.idasesor] || [];

      let paisagrupamiento = 0;
      if (da.nombrePais.indexOf('Perú') >= 0) {
        paisagrupamiento = 51;
      } else if (da.nombrePais.indexOf('Colombia') >= 0) {
        paisagrupamiento = 57;
      } else if (da.nombrePais.indexOf('Bolivia') >= 0) {
        paisagrupamiento = 591;
      } else if (da.nombrePais.indexOf('Mexico') >= 0) {
        paisagrupamiento = 52;
      } else {
        paisagrupamiento = 0;
      }

      if (
        !muestraAsesoresByGrupo[
          `${da.idasesor},${da.grupo},${paisagrupamiento}`
        ]
      ) {
        muestraAsesoresByGrupo[
          `${da.idasesor},${da.grupo},${paisagrupamiento}`
        ] = da.oportunidadesCerradas;
        let obj: any = {};
        obj.grupo = da.grupo;
        obj.valor = da.tcMeta;
        obj.pais = paisagrupamiento;
        mdataAsesores[da.idasesor].push(obj);
      } else {
        muestraAsesoresByGrupo[
          `${da.idasesor},${da.grupo},${paisagrupamiento}`
        ] =
          muestraAsesoresByGrupo[
            `${da.idasesor},${da.grupo},${paisagrupamiento}`
          ] + da.oportunidadesCerradas;
      }
      let asesor = da.idasesor;
      if (!muestraAsesores[asesor]) {
        muestraAsesores[asesor] = 1;
        let obj: any = {};
        obj.idAsesor = da.idasesor;
        obj.nombreAsesor = da.nombre;
        obj.nombreCoordinador = da.nombreCoordinador;
        asesores.push(obj);
      }
      if (!cerradasGrupos[da.grupo]) {
        let obj: any = {};
        obj.grupo = da.grupo;
        obj.valor = da.tcMeta;
        cerradasGruposLista.push(obj);
        cerradasGrupos[da.grupo] = da.oportunidadesCerradas;
      } else {
        cerradasGrupos[da.grupo] =
          cerradasGrupos[da.grupo] + da.oportunidadesCerradas;
      }
      totalOCMeta = totalOCMeta + da.oportunidadesCerradas;
      //Agregado para division Senior  o Junior
      let precios = dataPrecio.filter((item: any) => {
        return item.idasesor === da.idasesor;
      });
      let montototal = 0;
      let octotal = 0;
      let precioPromediovalidar = 0;
      precios.forEach((t: any) => {
        montototal = montototal + t.precioListaFinal;
        octotal = octotal + t.oportunidadesOCTotal;
      });
      precioPromediovalidar = montototal / octotal;
      precios.forEach((pr: any) => {
        if (pr.idcodigopais === 51) {
          if (precioPromediovalidar >= 2000) {
            if (!cerradasGruposSeniorPeru[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaSeniorPeru.push(obj);
              cerradasGruposSeniorPeru[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposSeniorPeru[da.grupo] =
                cerradasGruposSeniorPeru[da.grupo] + da.oportunidadesCerradas;
            }
          } else {
            if (!cerradasGruposJuniorPeru[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaJuniorPeru.push(obj);
              cerradasGruposJuniorPeru[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposJuniorPeru[da.grupo] =
                cerradasGruposJuniorPeru[da.grupo] + da.oportunidadesCerradas;
            }
          }
        } else if (pr.idcodigopais === 57) {
          if (precioPromediovalidar >= 2000) {
            if (!cerradasGruposSeniorColombia[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaSeniorColombia.push(obj);
              cerradasGruposSeniorColombia[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposSeniorColombia[da.grupo] =
                cerradasGruposSeniorColombia[da.grupo] +
                da.oportunidadesCerradas;
            }
          } else {
            if (!cerradasGruposJuniorColombia[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaJuniorColombia.push(obj);
              cerradasGruposJuniorColombia[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposJuniorColombia[da.grupo] =
                cerradasGruposJuniorColombia[da.grupo] +
                da.oportunidadesCerradas;
            }
          }
        } else if (pr.idcodigopais === 591) {
          if (precioPromediovalidar >= 2000) {
            if (!cerradasGruposSeniorBolivia[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaSeniorBolivia.push(obj);
              cerradasGruposSeniorBolivia[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposSeniorBolivia[da.grupo] =
                cerradasGruposSeniorBolivia[da.grupo] +
                da.oportunidadesCerradas;
            }
          } else {
            if (!cerradasGruposJuniorBolivia[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaJuniorBolivia.push(obj);
              cerradasGruposJuniorBolivia[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposJuniorBolivia[da.grupo] =
                cerradasGruposJuniorBolivia[da.grupo] +
                da.oportunidadesCerradas;
            }
          }
        } else if (pr.idcodigopais === 52) {
          if (precioPromediovalidar >= 2000) {
            if (!cerradasGruposSeniorMexico[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaSeniorMexico.push(obj);
              cerradasGruposSeniorMexico[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposSeniorMexico[da.grupo] =
                cerradasGruposSeniorMexico[da.grupo] + da.oportunidadesCerradas;
            }
          } else {
            if (!cerradasGruposJuniorMexico[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaJuniorMexico.push(obj);
              cerradasGruposJuniorMexico[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposJuniorMexico[da.grupo] =
                cerradasGruposJuniorMexico[da.grupo] + da.oportunidadesCerradas;
            }
          }
        } else {
          if (precioPromediovalidar >= 2000) {
            if (!cerradasGruposSeniorOtros[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaSeniorOtros.push(obj);
              cerradasGruposSeniorOtros[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposSeniorOtros[da.grupo] =
                cerradasGruposSeniorOtros[da.grupo] + da.oportunidadesCerradas;
            }
          } else {
            if (!cerradasGruposJuniorOtros[da.grupo]) {
              let obj: any = {};
              obj.grupo = da.grupo;
              obj.valor = da.tcMeta;
              cerradasGruposListaJuniorOtros.push(obj);
              cerradasGruposJuniorOtros[da.grupo] = da.oportunidadesCerradas;
            } else {
              cerradasGruposJuniorOtros[da.grupo] =
                cerradasGruposJuniorOtros[da.grupo] + da.oportunidadesCerradas;
            }
          }
        }
      });
    });
    let totalMetaFinal = 0.0;
    cerradasGruposLista.forEach((da: any) => {
      totalMetaFinal = totalMetaFinal + cerradasGrupos[da.grupo] * da.valor;
    });
    totalMetaFinal = totalOCMeta == 0 ? 0 : totalMetaFinal / totalOCMeta;
    totalMetaFinal = Math.round(totalMetaFinal * 100) / 100;
    
    let finalTCmeta: any = {};
    let asesoresSeniorPeru: any = [];
    let asesoresSeniorColombia: any = [];
    let asesoresSeniorBolivia: any = [];
    let asesoresSeniorMexico: any = [];
    let asesoresSeniorOtros: any = [];
    let asesoresJuniorPeru: any = [];
    let asesoresJuniorColombia: any = [];
    let asesoresJuniorBolivia: any = [];
    let asesoresJuniorMexico: any = [];
    let asesoresJuniorOtros: any = [];
    asesores.forEach((pt: any) => {
      let idAsesor = pt.idAsesor;
      let totalOC = 0;
      let TCmeta = 0;

      let totalOCPeru = 0;
      let TCmetaPeru = 0;
      let totalOCColombia = 0;
      let TCmetaColombia = 0;
      let totalOCBolivia = 0;
      let TCmetaBolivia = 0;
      let totalOCMexico = 0;
      let TCmetaMexico = 0;
      let totalOCOtros = 0;
      let TCmetaOtros = 0;

      mdataAsesores[idAsesor].forEach((datos: any) => {
        if (datos.pais === 51) {
          totalOCPeru =
            totalOCPeru +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},51`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},51`]);
          TCmetaPeru =
            TCmetaPeru +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},51`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},51`]) *
              datos.valor;
        } else if (datos.pais === 57) {
          totalOCColombia =
            totalOCColombia +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},57`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},57`]);
          TCmetaColombia =
            TCmetaColombia +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},57`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},57`]) *
              datos.valor;
        } else if (datos.pais === 591) {
          totalOCBolivia =
            totalOCBolivia +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},591`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},591`]);
          TCmetaBolivia =
            TCmetaBolivia +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},591`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},591`]) *
              datos.valor;
        } else if (datos.pais === 52) {
          totalOCMexico =
            totalOCMexico +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},52`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},52`]);
          TCmetaMexico =
            TCmetaMexico +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},52`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},52`]) *
              datos.valor;
        } else {
          totalOCOtros =
            totalOCOtros +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},0`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},0`]);
          TCmetaOtros =
            TCmetaOtros +
            (muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},0`] ===
            undefined
              ? 0
              : muestraAsesoresByGrupo[`${idAsesor},${datos.grupo},0`]) *
              datos.valor;
        }

        //totalOC = totalOC + muestraAsesoresByGrupo[[idAsesor, datos.grupo]];
        //TCmeta = TCmeta + (muestraAsesoresByGrupo[[idAsesor, datos.grupo]] * datos.valor);
      });

      //let metaAsesor = calcularTCFila(TCmeta, totalOC);
      let metaAsesorPeru = this.calcularTCFila(TCmetaPeru, totalOCPeru);
      let metaAsesorColombia = this.calcularTCFila(
        TCmetaColombia,
        totalOCColombia
      );
      let metaAsesorBolivia = this.calcularTCFila(
        TCmetaBolivia,
        totalOCBolivia
      );
      let metaAsesorMexico = this.calcularTCFila(TCmetaMexico, totalOCMexico);
      let metaAsesorOtros = this.calcularTCFila(TCmetaOtros, totalOCOtros);

      //Para Tipo Asesores
      let ingresosAsesor = dataPrecio.filter((item: any) => {
        return item.idasesor === idAsesor;
      });
      let montototal = 0;
      let octotal = 0;
      let precioPromediovalidar = 0;
      ingresosAsesor.forEach((t: any) => {
        montototal = montototal + t.precioListaFinal;
        octotal = octotal + t.oportunidadesOCTotal;
      });
      precioPromediovalidar = montototal / octotal;
      ingresosAsesor.forEach((ia: any) => {
        let obj: any = {};
        obj.nombreCoordinador = pt.nombreCoordinador;
        obj.nombreAsesor = pt.nombreAsesor;
        obj.IdAsesor = idAsesor;
        obj.inscritos = ia.oportunidadesOCAnyIS;
        obj.cerradas = ia.oportunidadesOCTotal;
        obj.TC =
          ia.oportunidadesOCTotal == 0
            ? 0
            : ia.oportunidadesOCAnyIS / ia.oportunidadesOCTotal;
        obj.TCMeta = 0; //(Math.round(metaAsesor * 100) / 100) / 100;
        obj.RealByMeta = 0; //Math.round((obj.TC * 100 * 100) / metaAsesor);
        obj.ingresoMetaPromedio = Math.round(ia.precioPromedio);
        obj.ingresoRealPromedio =
          ia.oportunidadesOCAnyIS == 0
            ? 0
            : Math.round(Math.round(ia.ingresoReal) / ia.oportunidadesOCAnyIS);
        obj.ingresoReal =
          ia.oportunidadesOCAnyIS == 0 ? 0 : Math.round(ia.ingresoReal);
        obj.ingresoMes =
          ia.oportunidadesOCAnyIS == 0 ? 0 : Math.round(ia.ingresoMes);
        obj.DescuentoPromedio =
          ia.oportunidadesOCAnyIS == 0 ? 0 : Math.round(ia.descuentoPromedio);
        obj.ingresoMeta = 0; //Math.round(obj.TCMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio);
        obj.IRByIM = 0; //Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);

        if (ia.idcodigopais === 51) {
          obj.TCMeta = Math.round(metaAsesorPeru * 100) / 100 / 100;
          obj.RealByMeta = Math.round((obj.TC * 100 * 100) / metaAsesorPeru);
          obj.ingresoMeta = Math.round(
            obj.TCMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
          if (precioPromediovalidar >= 2000) {
            asesoresSeniorPeru.push(obj);
          } else {
            asesoresJuniorPeru.push(obj);
          }
        } else if (ia.idcodigopais === 57) {
          obj.TCMeta = Math.round(metaAsesorColombia * 100) / 100 / 100;
          obj.RealByMeta = Math.round(
            (obj.TC * 100 * 100) / metaAsesorColombia
          );
          obj.ingresoMeta = Math.round(
            obj.TCMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
          if (precioPromediovalidar >= 2000) {
            asesoresSeniorColombia.push(obj);
          } else {
            asesoresJuniorColombia.push(obj);
          }
        } else if (ia.idcodigopais === 591) {
          obj.TCMeta = Math.round(metaAsesorBolivia * 100) / 100 / 100;
          obj.RealByMeta = Math.round((obj.TC * 100 * 100) / metaAsesorBolivia);
          obj.ingresoMeta = Math.round(
            obj.TCMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
          if (precioPromediovalidar >= 2000) {
            asesoresSeniorBolivia.push(obj);
          } else {
            asesoresJuniorBolivia.push(obj);
          }
        } else if (ia.idcodigopais === 52) {
          obj.TCMeta = Math.round(metaAsesorMexico * 100) / 100 / 100;
          obj.RealByMeta =
            metaAsesorMexico == 0
              ? 0
              : Math.round((obj.TC * 100 * 100) / metaAsesorMexico);
          obj.ingresoMeta = Math.round(
            obj.TCMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM =
            obj.ingresoMeta == 0
              ? 0
              : Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
          if (precioPromediovalidar >= 2000) {
            asesoresSeniorMexico.push(obj);
          } else {
            asesoresJuniorMexico.push(obj);
          }
        } else {
          obj.TCMeta = Math.round(metaAsesorOtros * 100) / 100 / 100;
          obj.RealByMeta =
            metaAsesorOtros == 0
              ? 0
              : Math.round((obj.TC * 100 * 100) / metaAsesorOtros);
          obj.ingresoMeta = Math.round(
            obj.TCMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
          if (precioPromediovalidar >= 2000) {
            asesoresSeniorOtros.push(obj);
          } else {
            asesoresJuniorOtros.push(obj);
          }
        }
      });
    });

    this._generarGridAsesoresPorTipo(
      asesoresSeniorPeru,
      cerradasGruposListaSeniorPeru,
      cerradasGruposSeniorPeru,
      'gridASesorSeniorPeru'
    );
    this._generarGridAsesoresPorTipo(
      asesoresSeniorColombia,
      cerradasGruposListaSeniorColombia,
      cerradasGruposSeniorColombia,
      'gridASesorSeniorColombia'
    );
    this._generarGridAsesoresPorTipo(
      asesoresSeniorBolivia,
      cerradasGruposListaSeniorBolivia,
      cerradasGruposSeniorBolivia,
      'gridASesorSeniorBolivia'
    );
    this._generarGridAsesoresPorTipo(
      asesoresSeniorMexico,
      cerradasGruposListaSeniorMexico,
      cerradasGruposSeniorMexico,
      'gridASesorSeniorMexico'
    );
    this._generarGridAsesoresPorTipo(
      asesoresSeniorOtros,
      cerradasGruposListaSeniorOtros,
      cerradasGruposSeniorOtros,
      'gridASesorSeniorOtros'
    );
    this._generarGridAsesoresPorTipo(
      asesoresJuniorPeru,
      cerradasGruposListaJuniorPeru,
      cerradasGruposJuniorPeru,
      'gridASesorJuniorPeru'
    );
    this._generarGridAsesoresPorTipo(
      asesoresJuniorColombia,
      cerradasGruposListaJuniorColombia,
      cerradasGruposJuniorColombia,
      'gridASesorJuniorColombia'
    );
    this._generarGridAsesoresPorTipo(
      asesoresJuniorBolivia,
      cerradasGruposListaJuniorBolivia,
      cerradasGruposJuniorBolivia,
      'gridASesorJuniorBolivia'
    );
    this._generarGridAsesoresPorTipo(
      asesoresJuniorMexico,
      cerradasGruposListaJuniorMexico,
      cerradasGruposJuniorMexico,
      'gridASesorJuniorMexico'
    );
    this._generarGridAsesoresPorTipo(
      asesoresJuniorOtros,
      cerradasGruposListaJuniorOtros,
      cerradasGruposJuniorOtros,
      'gridASesorJuniorOtros'
    );
  }
  createAgregates(columns: any[], data: any[], field: string) {
    if (data.length > 0) {
      let aggregates: AggregateDescriptor[] = [];
      columns.forEach((e) => {
        aggregates.push(
          { field: e.field, aggregate: 'sum' },
          { field: e.field, aggregate: 'average' }
        );
      });
      let total = aggregateBy(data, aggregates);
      if (field == 'CTotalIS' || field == 'CTotalOC') {
        return total[field].sum;
      } else if (field == 'CTotalTC') {
        let im: any = total['CTotalIS'].sum;
        let oc: any = total['CTotalOC'].sum;
        if (oc > 0) {
          return String(Math.round(((im * 100) / oc) * 10) / 10) + '%';
        } else {
          return 0;
        }
      } else if (field == 'CTotalTCMeta') {
        // return total[field].average+"%";
        return String(Math.round(total[field].average * 100).toFixed(2)) + '%';
      } else if (field == 'RealByMeta') {
        return (
          this.calcularTCTotalCategoria(
            data,
            'CTotalIS',
            'CTotalOC',
            'CTotalTCMeta'
          ) + '%'
        );
      }
    }
    return 0;
  }
  reemplazarEspacio(str: string) {
    return str.replace(/\s/g, '_');
  }
  _generarGridTasaConversionAsesor2(
    dataMain: L2,
    // PromedioPais: any,
    index1: number
  ) {
    let mdata: any = {};
    let grupo = dataMain.grupo;
    let pais = dataMain.pais;
    let orden = dataMain.orden;
    let todoData = dataMain.listaMuyAlta;
    let columnas: any = [];
    let muestra: any = {};
    let muestraFinal: any = [];
    let agregatesFix: any = [];
    let filtro: any = [];

    let key = dataMain.orden + '_' + dataMain.grupo + '_' + dataMain.pais;
    let datita: any = {};
    datita.key = key;
    datita.grupo = todoData;
    this.dataDesagregada.push(datita);
    todoData.forEach((da: any) => {
      let asesor = da.idasesor;
      if (!muestra[asesor]) {
        idasesor: da.idasesor;
        muestra[asesor] = da.oportunidadesCerradas;
      } else {
        muestra[asesor] = muestra[asesor] + da.oportunidadesCerradas;
      }
    });
    for (let id in muestra) {
      if (muestra[id] > this.limite) filtro.push(Number(id));
    }

    todoData.forEach((da: any) => {
      let llave = da.nombre;
      if (!this.asesorCumple(filtro, da.idasesor)) {
        llave = 'Otros';
        da.nombre = 'Otros';
        da.nombreCoordinador = ' Otros';
      }
      if (!mdata[llave]) {
        mdata[llave] = {
          nombreCoordinador: da.nombreCoordinador,
          nombre: da.nombre,
        };
        columnas.forEach((col: any) => {
          col.columns.forEach((c: any) => {
            mdata[llave][c.field] = null;
          });
        });
        mdata[llave]['CTotalIS'] = 0;
        mdata[llave]['CTotalOC'] = 0;
        mdata[llave]['CTotalTC'] = 0;

        mdata[llave]['CTotalTCMeta'] = 0;
        mdata[llave]['PPromedio'] = 0;
        mdata[llave]['RealByMeta'] = 0;

        mdata[llave]['IReal'] = 0;
        mdata[llave]['IMeta'] = 0;
        mdata[llave]['IMetaByIReal'] = 0;

        mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'IS'] =
          da.inscritosMatriculados;
        mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'OC'] =
          da.oportunidadesCerradas;
        mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'TC'] =
          this.calcularTCFila(
            mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'IS'],
            mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'OC']
          );
        mdata[llave]['CTotalTCMeta'] = da.tcMeta / 100;
      } else {
        if (
          isNaN(
            mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'IS']
          ) ||
          isNaN(
            mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'OC']
          )
        ) {
          mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'IS'] =
            da.inscritosMatriculados;
          mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'OC'] =
            da.oportunidadesCerradas;
          mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'TC'] =
            mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'TC'] =
              this.calcularTCFila(
                mdata[llave][
                  'A_' + this.reemplazarEspacio(da.ca_nombre) + 'IS'
                ],
                mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'OC']
              );
        } else {
          mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'IS'] =
            mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'IS'] +
            da.inscritosMatriculados;
          mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'OC'] =
            mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'OC'] +
            da.oportunidadesCerradas;
          mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'TC'] =
            mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'TC'] =
              this.calcularTCFila(
                mdata[llave][
                  'A_' + this.reemplazarEspacio(da.ca_nombre) + 'IS'
                ],
                mdata[llave]['A_' + this.reemplazarEspacio(da.ca_nombre) + 'OC']
              );
        }
      }
      mdata[llave]['CTotalIS'] =
        mdata[llave]['CTotalIS'] + da.inscritosMatriculados;
      mdata[llave]['CTotalOC'] =
        mdata[llave]['CTotalOC'] + da.oportunidadesCerradas;
      mdata[llave]['CTotalTC'] = this.calcularTCFila(
        mdata[llave]['CTotalIS'],
        mdata[llave]['CTotalOC']
      );
      mdata[llave]['RealByMeta'] =
        mdata[llave]['CTotalTC'] / mdata[llave]['CTotalTCMeta'];
      mdata[llave]['idcategoriaOrigen'] = da.idcategoriaOrigen;
      mdata[llave]['orden'] = orden;
      mdata[llave]['grupo'] = grupo;
      mdata[llave]['pais'] = pais;
    });
    let datos = [];
    for (let dat in mdata) {
      datos.push(mdata[dat]);
    }

    let total = {
      title: 'Total',
      attributes: { style: 'text-align:center;' },
      headerAttributes: { style: 'text-align:center; font-size: 14px;' },
      width: 400,
      columns: [
        {
          field: 'CTotalIS',
          title: 'IS',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          footerTemplate: 'totalDesagregado["CTotalIS"].sum',
          width: 70,
        },

        {
          field: 'CTotalOC',
          title: 'OC',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center;' },
          footerTemplate: '#totalDesagregado["CTotalOC"].sum#',
          width: 70,
        },
        {
          field: 'CTotalTC',
          title: 'TC',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; font-weight: bold;' },

          footerTemplate:
            'calcularTCTotal(item.grid.data,"CTotalIS","CTotalOC") + "%"',
          format: '#.00 %',
          width: 70,
        },
        {
          field: 'CTotalTCMeta',
          title: 'TC Meta',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; font-weight: bold;' },
          footerTemplate: "#: porcentaje(average)+' %' #",
          aggregates: ['average'],
          format: '#.00 %',
          width: 70,
        },
        {
          field: 'RealByMeta',
          title: 'Real/Meta',
          attributes: { style: 'text-align:center;' },
          headerAttributes: { style: 'text-align:center; font-weight: bold;' },
          footerTemplate:
            "#=calcularTCTotalCategoria(data,'CTotalIS','CTotalOC','CTotalTCMeta')+'%'#",
          format: '#.00 %',
          width: 90,
        },
      ],
    };
    this.aggregates1 = [
      { field: 'CTotalIS', aggregate: 'sum' },
      { field: 'CTotalOC', aggregate: 'sum' },
    ];
    this.totalDesagregado = aggregateBy(datos, this.aggregates1);

    let columnasFix = [
      {
        field: 'nombreCoordinador',
        title: 'Nombre Coordinador',
        width: 300,
        headerAttributes: {
          style: 'color:#FFFFFF; text-align:center; font-size: 14px;',
        },
      },
      {
        field: 'nombre',
        title: 'Nombre Asesor',
        width: 300,
        headerAttributes: {
          style: 'color:#FFFFFF; text-align:center; font-size: 14px;',
        },
        footerTemplate: 'Total',
      },
    ];

    // if (dataMain.length == 0) {
    //   let obj: any = {};
    //   obj.pais = 0;
    //   dataMain.push(obj);
    // }

    columnas.push(total);
    columnas = columnas.sort((a: any, b: any) => {
      if (a.field < b.field) return 1;
      if (a.field > b.field) return -1;
      return 0;
    });
    datos = datos.sort((a, b) => {
      if (a.nombreCoordinador < b.nombreCoordinador) return 1;
      if (a.nombreCoordinador > b.nombreCoordinador) return -1;
      return 0;
    });

    let columnasParaDesagregado: any = {};
    columnasParaDesagregado.g = key;
    columnasParaDesagregado.l = columnas;
    this.columnasDetailDesagregado.push(columnasParaDesagregado);
    this.gridComplemento[index1].columnGroup = total;
    this.gridComplemento[index1].grid.data = datos;
    agregatesFix.push(
      { field: 'CTotalTCMeta', aggregate: 'average' },
      { field: 'CTotalIS', aggregate: 'sum' },
      { field: 'CTotalOC', aggregate: 'sum' },
      { field: 'BAgrupadoIS', aggregate: 'sum' },
      { field: 'BAgrupadoOC', aggregate: 'sum' }
    );
  }
  _generarGridTasaConversionAsesorPais(datos: L2[]) {
    datos.forEach((d) => {
      this._generarGridTasaConversionAsesor2(d, this.index1);
      this.index1++;
    });

    var columnas = [];
    var columnasFix = [
      {
        field: 'probabilidad',
        title: 'Probabilidad',
        width: 150,
        headerAttributes: {
          style:
            'color:#FFFFFF; text-align:center; font-size: 14px; background-color: #A0B58D',
        }, //#337ab7
        locked: true,
        lockable: false,
      },
      {
        field: 'nombrePais',
        title: 'Pais',
        width: 300,
        headerAttributes: {
          style:
            'color:#FFFFFF; text-align:center; font-size: 14px; background-color: #A0B58D',
        }, //#A0B58D
        locked: true,
        lockable: false,
      },
    ];
  }
  filterArea(value: any) {
    if (value.length >= 1) {
      this.dataAreaFiltro = this.dataArea.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.dataAreaFiltro = this.dataArea;
    }
  }
  filterAsesor(value: any) {
    if (value.length >= 1) {
      this.dataAsesorfiltro = this.dataAsesorSelect.filter(
        (s) =>
          s.nombreCompleto.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.dataAsesorfiltro = this.dataAsesorSelect;
    }
  }
  filterCoordinador(value: any) {
    if (value.length >= 1) {
      this.dataCoordinadorfiltro = this.dataCoordinadorSelect.filter(
        (s) =>
          s.nombreCompleto.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.dataCoordinadorfiltro = this.dataCoordinadorSelect;
    }
  }
  _subAreaByArea(value: any) {
    let pgeneralArea: any[] = [];
    let pespecificoArea: any[] = [];
    if (value.length > 0) {
      this.dataSubAreaFiltro = [];
      this.dataPGeneralFiltro = [];
      this.dataPEspecificoFiltro = [];
      this.dataSubAreaFiltro = this.dataSubArea.filter((s) =>
        value.includes(s.area)
      );

      this.dataSubAreaChange = this.dataSubAreaFiltro;
      let sub = this.filtro.subareas.filter((e: any) => value.includes(e.area));
      sub.forEach((e: any) => {
        pgeneralArea.push(e.id);
      });
      let pg = this.filtro.pgeneral.filter((e: any) =>
        pgeneralArea.includes(e.subarea)
      );
      this.dataPGeneralFiltro = this.dataPGeneral.filter((s: any) =>
        pgeneralArea.includes(s.subarea)
      );
      pg.forEach((e: any) => {
        pespecificoArea.push(e.id);
      });
      let pe = this.filtro.pespecifico.filter((e: any) =>
        pespecificoArea.includes(e.idProgramaGeneral)
      );
      this.dataPEspecificoFiltro = this.dataPEspecifico.filter((s: any) =>
        pespecificoArea.includes(s.idProgramaGeneral)
      );

      this.formFiltro.get('subareas').setValue(sub);
      this.formFiltro.get('pgeneral').setValue(pg);
      this.formFiltro.get('pespecifico').setValue(pe);
    } else {
      this.dataSubAreaFiltro = [];
      this.dataPGeneralFiltro = [];
      this.dataPEspecificoFiltro = [];
      this.formFiltro.get('subareas').setValue([]);
      this.formFiltro.get('pgeneral').setValue([]);
      this.formFiltro.get('pespecifico').setValue([]);
    }
  }
  get filtro() {
    return this.formFiltro.getRawValue();
  }
  removeArea(event: any) {
    
  }
  filterPGeneral(value: any) {
    if (value.length >= 1) {
      this.dataPGeneralFiltro = this.dataPGeneralChange.filter(
        (s: any) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.dataPGeneralFiltro = this.dataPGeneralChange;
    }
  }
  filterPEspecifico(value: any) {
    if (value.length >= 1) {
      this.dataPEspecificoFiltro = this.dataPEspecificoChange.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.dataPEspecificoFiltro = this.dataPEspecificoChange;
    }
  }
  filterSubArea(value: any) {
    if (value.length >= 1) {
      this.dataSubAreaFiltro = this.dataSubAreaChange.filter(
        (s: any) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.dataSubAreaFiltro = this.dataSubAreaChange;
    }
  }
  _programasGeneralesBySubArea(value: any) {
    let pgenerales: any[] = [];
    let pespecificoArea: any[] = [];
    value.forEach((e: any) => {
      pgenerales.push(e.id);
    });
    if (value.length > 0) {
      this.dataPGeneralFiltro = [];
      this.dataPEspecificoFiltro = [];
      this.dataPGeneralFiltro = this.dataPGeneral.filter((s: any) =>
        pgenerales.includes(s.subarea)
      );
      this.dataPGeneralChange = this.dataPGeneralFiltro;
      let pg = this.filtro.pgeneral.filter((e: any) =>
        pgenerales.includes(e.subarea)
      );
      pg.forEach((e: any) => {
        pespecificoArea.push(e.id);
      });
      let pe = this.filtro.pespecifico.filter((e: any) =>
        pespecificoArea.includes(e.idProgramaGeneral)
      );
      this.dataPEspecificoFiltro = this.dataPEspecifico.filter((s: any) =>
        pespecificoArea.includes(s.idProgramaGeneral)
      );
      this.formFiltro.get('pgeneral').setValue(pg);
      this.formFiltro.get('pespecifico').setValue(pe);
    } else {
      this.dataPGeneralFiltro = [];
      this.dataPEspecificoFiltro = [];
      this.formFiltro.get('pgeneral').setValue([]);
      this.formFiltro.get('pespecifico').setValue([]);
    }
  }
  _modalidadByCidudad(event: any) {
    if (event.length > 0) {
      this.dataCiudadesChange = this.dataCiudades.filter((s) =>
        event.includes(s.idModalidad)
      );
    } else {
      this.formFiltro.get('ciudades').setValue([]);
      this.dataCiudadesChange = [];
    }
  }
  _programasEspecificosByProgramaGeneral(value: any) {
    let pespecificos: any[] = [];
    value.forEach((e: any) => {
      pespecificos.push(e.id);
    });
    if (value.length > 0) {
      this.dataPEspecificoFiltro = [];
      this.dataPEspecificoFiltro = this.dataPEspecifico.filter((s: any) =>
        pespecificos.includes(s.idProgramaGeneral)
      );
      this.dataPEspecificoChange = this.dataPEspecificoFiltro;
      let pe = this.filtro.pespecifico.filter((e: any) =>
        pespecificos.includes(e.idProgramaGeneral)
      );
      this.formFiltro.get('pespecifico').setValue(pe);
    } else {
      this.dataPEspecificoFiltro = [];
      this.formFiltro.get('pespecifico').setValue([]);
    }
  }
  cambiarEstadoPersonal(value: any) {
    this.formFiltro.get('asesores').setValue([]);
    this.dataAsesorfiltro = [];
    this.dataAsesorSelect = [];
    if (value == 1) {
      this.dataAsesorfiltro = this.dataAsesor;
      this.dataAsesorSelect = this.dataAsesor;
    } else if (value == 2) {
      let resultado = this.dataAsesor.filter((x) => x.activo == true);
      this.dataAsesorfiltro = resultado;
      this.dataAsesorSelect = resultado;
    } else if (value == 3) {
      let resultado = this.dataAsesor.filter((x) => x.activo == false);
      this.dataAsesorfiltro = resultado;
      this.dataAsesorSelect = resultado;
    }
  }
}
