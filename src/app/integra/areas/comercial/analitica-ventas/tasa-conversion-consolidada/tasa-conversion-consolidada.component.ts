import { HttpResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiComercial } from '@environments/constApi';
import { datePipeTransform, getFechaFin, getFechaInicio } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  GridDataResult,
} from '@progress/kendo-angular-grid';
import {
  aggregateBy,
  AggregateDescriptor,
} from '@progress/kendo-data-query';
import { UserService } from '@shared/services/user.service';
import {
  ICentroCostoAsesor,
  ICentroCostoAsesorAgrupado,
  IConsolidado,
  IConsolidadoAgrupado,
  IConsolidadoAsesor,
  IConsolidadoCoordinador,
  IDesagregado,
  IFiltroEnvio,
  IFormFiltro,
  IReporteTasaConversionConsolidada,
  IReporteTasaConversionConsolidadaCombo,
} from '@comercial/models/interfaces/itasa-conversion-consolidada';
import { cloneData } from '@shared/functions/clone-data';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IClaveValor, IComboBase1 } from '@shared/models/interfaces/iglobal';
import { ISubAreaCapacitacionCombo } from '@shared/models/interfaces/isub-area-capacitacion';
import { IProgramaGeneralCombo } from '@shared/models/interfaces/iprograma-general';
import { IPEspecificoCombo } from '@shared/models/interfaces/ipespecifico';
import { ComboPersonalVentas } from '@shared/models/interfaces/ipersonal';


/**
 * @module ComercialModule
 * @description Componente de Reporte Tasa de Conversión Consolidada
 * @author Joseph Llanque, Flavio R. Mamani Fabian
 * @version 2.0.1
 * @history
 * * --/--/-- Primera implementacion
 * * 03/03/2023 Refactorizacion de Codigo y funciones
 */
@Component({
  selector: 'app-tasa-conversion-consolidada',
  templateUrl: './tasa-conversion-consolidada.component.html',
  styleUrls: ['./tasa-conversion-consolidada.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TasaConversionConsolidadaComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private userService: UserService
  ) {}

  virtual = {
    itemHeight: 28,
  };

  categoriaDatoConsolidado: any[] = [
    {
      title: 'Muy Alta',
      grid: new KendoGrid(),
      columnGroup: []
    },
    {
      title: 'Alta - Media',
      grid: new KendoGrid(),
      columnGroup: []
    },
    {
      title: 'Sin Probabilidad',
      grid: new KendoGrid(),
      columnGroup: []
    },
  ];

  gridsCoordinadors = [
    {
      titulo: 'Categoria dato por Coordinador General',
      grid: new KendoGrid(),
      totalMetaFinal: 0,
      totalTCReal: 0,
    },
    /*{
      titulo: 'Categoria dato por Coordinador Senior',
      grid: new KendoGrid(),
      totalMetaFinal: 0,
      totalTCReal: 0,
    },
    {
      titulo: 'Categoria dato por Coordinador Junior',
      grid: new KendoGrid(),
      totalMetaFinal: 0,
      totalTCReal: 0,
    },*/
  ];

  gridsAsesors = [
    {
      tipo: 'General',
      grids: [
        {
          pais: '_',
          titulo: '',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Peru',
          titulo: 'Peru',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Colombia',
          titulo: 'Colombia',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Bolivia',
          titulo: 'Bolivia',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Mexico',
          titulo: 'Mexico',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Chile',
          titulo: 'Chile',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Otros',
          titulo: 'Otros',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
      ],
    },
    /*{
      tipo: 'Senior',
      grids: [
        {
          pais: '_',
          titulo: '',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Peru',
          titulo: 'Peru',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Colombia',
          titulo: 'Colombia',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Bolivia',
          titulo: 'Bolivia',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Mexico',
          titulo: 'Mexico',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Chile',
          titulo: 'Chile',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Otros',
          titulo: 'Otros',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
      ],
    },
    {
      tipo: 'Junior',
      grids: [
        {
          pais: '_',
          titulo: '',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Peru',
          titulo: 'Peru',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Colombia',
          titulo: 'Colombia',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Bolivia',
          titulo: 'Bolivia',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Mexico',
          titulo: 'Mexico',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Chile',
          titulo: 'Chile',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
        {
          pais: 'Otros',
          titulo: 'Otros',
          grid: new KendoGrid(),
          totalMetaFinal: 0,
        },
      ],
    },*/
  ];

  gridCategoriaTotal = new KendoGrid();

  formFiltro: FormGroup = this.formBuilder.group({
    areas: [[]],
    subAreas: [{ value: [], disabled: true }],
    pGeneral: [{ value: [], disabled: true }],
    pEspecifico: [{ value: [], disabled: true }],
    modalidades: [[]],
    ciudades: [{ value: [], disabled: true }],
    fecha: true,
    coordinadores: [[]],
    asesores: [[]],
    fechaInicio: [getFechaInicio()],
    fechaFin: [getFechaFin()],
    estadoPersonal: [null],
    muestraMinima: 0,
  });

  dataAreasCapacitacion: IComboBase1[] = [];
  dataSubAreasCapacitacion: ISubAreaCapacitacionCombo[] = [];
  dataSubAreasCapacitacionFiltro: ISubAreaCapacitacionCombo[] = [];
  dataAsesores: ComboPersonalVentas[] = [];
  dataAsesoresFiltro: ComboPersonalVentas[] = [];
  dataCoordinadores: ComboPersonalVentas[] = [];
  dataProgramaGeneral: IProgramaGeneralCombo[] = [];
  dataProgramaGeneralFiltro: IProgramaGeneralCombo[] = [];
  dataPEspecifico: IPEspecificoCombo[] = [];
  dataPEspecificoFiltro: IPEspecificoCombo[] = [];
  dataModalidad = ['Presencial', 'Online Asincronica', 'Online Sincronica'];
  dataEstadoAsesores: IClaveValor[] = [
    { valor: true, clave: 'Activos' },
    { valor: false, clave: 'Inactivos' },
  ];
  dataCiudadesFiltro: string[] = [];
  dataCiudades = ['Arequipa', 'LIMA', 'BOGOTA'];
  dataTipoFecha = [
    { valor: true, clave: 'Creación Oportunidad' },
    { valor: false, clave: 'Cierre Oportunidad' },
  ];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  loading = false;
  gridComplemento: {
    title: string,
    grid: KendoGrid
  }[] = [];


  data: any = [];
  gridData: GridDataResult;
  aggregates: AggregateDescriptor[] = [
    { field: 'is', aggregate: 'sum' },
    { field: 'oc', aggregate: 'sum' },
    { field: 'ingresoMes', aggregate: 'sum' },
    { field: 'descuentoPromedio', aggregate: 'average' },
    { field: 'ingresoReal', aggregate: 'sum' },
    { field: 'ingresoMeta', aggregate: 'sum' },
  ];
  btnBuscarDisabled: boolean = true;

  ngOnInit(): void {
    this.obtenerCombos();
  }
  /**
   * @description Carga los combos de reporte de tasas de conversion
   */
  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteTasaConversionConsolidadaObtenerCombos}`
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteTasaConversionConsolidadaCombo>) => {
          this.dataAsesores = resp.body.asesores;
          this.dataAsesoresFiltro = resp.body.asesores;
          this.dataCoordinadores = resp.body.coordinadores;
          this.dataAreasCapacitacion = resp.body.areasCapacitacion;
          this.dataSubAreasCapacitacion = resp.body.subAreasCapacitacion;
          this.dataPEspecifico = resp.body.programasEspecificos;
          this.dataProgramaGeneral = resp.body.programasGenerales;
          this.btnBuscarDisabled = false;
        },
        error: (error) => {
          this.alertaService.notificationWarning(error.message);
        }
      });
  }
  /**
   * @description Retorna los datos del formulario
   * @return {IFormFiltro} IFormFiltro
   */
  get dataFormFiltro(): IFormFiltro {
    return this.formFiltro.getRawValue() as IFormFiltro;
  }

  changeAreaCapacitacion(value: number[]) {
    if (value.length > 0) {
      this.dataSubAreasCapacitacionFiltro =
        this.dataSubAreasCapacitacion.filter((s) =>
          value.includes(s.idAreaCapacitacion)
        );
      let filtro = this.dataFormFiltro.subAreas.filter((e) =>
        value.includes(e)
      );

      this.formFiltro.get('subAreas').enable();
      this.formFiltro.get('subAreas').setValue(filtro);
      this.changeSubAreasCapacitacion(filtro);
    } else {
      this.dataSubAreasCapacitacionFiltro = [];
      this.formFiltro.get('subAreas').setValue([]);
      this.changeSubAreasCapacitacion([]);
      this.formFiltro.get('subAreas').disable();
    }
  }

  changeSubAreasCapacitacion(value: number[]) {
    if (value.length > 0) {
      this.dataProgramaGeneralFiltro = this.dataProgramaGeneral.filter((s) =>
        value.includes(s.idSubArea)
      );
      let filtro = this.dataFormFiltro.pGeneral.filter((e) =>
        this.dataProgramaGeneralFiltro.map(x => x.id).includes(e)
      );
      this.formFiltro.get('pGeneral').enable();
      this.formFiltro.get('pGeneral').setValue(filtro);
      this.changeProgramaGeneral(filtro);
    } else {
      this.dataProgramaGeneralFiltro = [];
      this.formFiltro.get('pGeneral').setValue([]);
      this.changeProgramaGeneral([]);
      this.formFiltro.get('pGeneral').disable();
    }
  }

  changeProgramaGeneral(value: number[]) {
    if (value.length > 0) {
      this.dataPEspecificoFiltro = this.dataPEspecifico.filter((x) =>
        value.includes(x.id)
      );
      let filtro = this.dataFormFiltro.pEspecifico.filter((e) =>
        this.dataPEspecificoFiltro.map(x => x.id).includes(e)
      );
      this.formFiltro.get('pEspecifico').setValue(filtro);
      this.formFiltro.get('pEspecifico').enable();
    } else {
      this.dataPEspecificoFiltro = [];
      this.formFiltro.get('pEspecifico').setValue([]);
      this.formFiltro.get('pEspecifico').disable();
    }
  }

  changeModalidades(modalidades: string[]) {
    if (modalidades.length == 1) {
      if (modalidades[0] == 'Presencial') {
        this.dataCiudadesFiltro = this.dataCiudades;
        this.formFiltro.get('ciudades').enable();
      } else {
        this.dataCiudadesFiltro = [];
        this.formFiltro.get('ciudades').setValue([]);
        this.formFiltro.get('ciudades').disable();
      }
    } else {
      this.dataCiudadesFiltro = [];
      this.formFiltro.get('ciudades').setValue([]);
      this.formFiltro.get('ciudades').disable();
    }
  }

  changeEstadoPersonal(value: boolean) {
    if (value != null) {
      this.dataAsesoresFiltro = this.dataAsesores.filter(
        (x) => x.activo == value
      );
      let filtro = this.dataFormFiltro.asesores.filter((x) =>
        this.dataAsesoresFiltro.map((x) => x.id).includes(x)
      );
      this.formFiltro.get('asesores').setValue(filtro);
    } else {
      this.dataAsesoresFiltro = this.dataAsesores;
    }
  }

  resetGrids(){
    this.gridsCoordinadors.forEach(e => {
      e.grid = new KendoGrid();
      e.totalMetaFinal = 0;
    })
    this.gridsAsesors.forEach(e => {
      e.grids.forEach(x => {
        x.grid = new KendoGrid();
        x.totalMetaFinal = 0;
      })
    })
    this.gridCategoriaTotal = new KendoGrid();
    this.categoriaDatoConsolidado.forEach(e => {
      e.grid = new KendoGrid();
      e.columnGroup = []
    })
  }
  get fechaActual(): Date {
    return new Date();
  }

  generarReporteTasaConversion() {
    this.resetGrids();
    const idPersonal = this.userService.userData.idPersonal;
    let asesores: number[] = [];
    let filtroPersonal = [
      213, 4435, 4081, 74, 4648,4964, 6634, 6589
    ];

    if (this.dataFormFiltro.asesores.length == 0) {
      if (!filtroPersonal.includes(idPersonal))
        asesores = this.dataAsesores.map((x) => x.id);
    } else asesores = this.dataFormFiltro.asesores;

    const filtro: IFiltroEnvio = {
      areas: this.dataFormFiltro.areas,
      subAreas: this.dataFormFiltro.subAreas,
      pGeneral: this.dataFormFiltro.pGeneral,
      pEspecifico: this.dataFormFiltro.pEspecifico,
      modalidades: this.dataFormFiltro.modalidades,
      ciudades: this.dataFormFiltro.ciudades,
      fecha: this.dataFormFiltro.fecha,
      asesores: asesores,
      coordinadores: this.dataFormFiltro.coordinadores,
      fechaInicio: datePipeTransform(
        this.dataFormFiltro.fechaInicio,
        'yyyy-MM-dd'
      ),
      fechaFin: datePipeTransform(this.dataFormFiltro.fechaFin, 'yyyy-MM-dd'),
    };
    if(new Date(filtro.fechaFin) < new Date(filtro.fechaInicio)){
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido'
      });
      return;
    }
    this.gridComplemento = [];
    this.loading = true;
    this.btnBuscarDisabled = true;
    // this.generarReporteTemp(); //!Solo para realizar pruebas
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteTasaConversionConsolidadaGenerarReporte,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (respponse: HttpResponse<IReporteTasaConversionConsolidada>) => {
          let rpta = respponse.body;
          this.loading = false;
          this.btnBuscarDisabled = false;
          if (rpta.consolidados.length <= 0) {
            this.alertaService.swalFireOptions({
              title: 'Sin Registros',
              icon: 'info',
            });
          } else {
            let consolidadoTotal: IConsolidadoAgrupado = {
              grupo: 'Total',
              data: [],
            };
            rpta.consolidados.forEach((d) => {
              consolidadoTotal.data = consolidadoTotal.data.concat(d.data);
            });
            this.generarGridTasaConversionCoordinador(
              consolidadoTotal,
              rpta.centroCostoAsesorAgrupados
            );
            this.generarGridTasaConversionAsesorTotal(
              consolidadoTotal,
              rpta.centroCostoAsesorAgrupados
            );
            this.generarGridTasaConversionAsesorPaisesTotal(
              consolidadoTotal,
              rpta.centroCostoAsesor
            );
            rpta.consolidados.forEach((g) => {
              let index = this.categoriaDatoConsolidado.findIndex(x => x.title == g.grupo)
              if(index != -1)
                this.generarGridTasaConversionAsesor(g, index);
            });
            rpta.desagregados.forEach((d) => {
              for (let index = 0; index < d.data.length; index++) {
                this.gridComplemento.push({
                  title: d.data[index].nombreGrupo,
                  grid: new KendoGrid(),
                });
              }
            });

            let index = 0;
            rpta.desagregados.forEach((g) => {
              g.data.forEach((d) => {
                this.generarGridTasaConversionAsesor2(d,index);
                index++;
              });
            });
          }
        },
        error: (error) => {
          this.loading = false;
          this.btnBuscarDisabled = false;
          this.alertaService.notificationWarning(error.message);
        },
      });
  }
  /**
   * Reporte de con datos de prueba
   */
  private generarReporteTemp(){
    let rpta: IReporteTasaConversionConsolidada = JSON.parse(localStorage.getItem('dataPrueba'));
    this.loading = false;
    this.btnBuscarDisabled = false;
    if (rpta.consolidados.length <= 0) {
      this.alertaService.swalFireOptions({
        title: 'Sin Registros',
        icon: 'info',
      });
    } else {
      let consolidadoTotal: IConsolidadoAgrupado = {
        grupo: 'Total',
        data: [],
      };
      rpta.consolidados.forEach((d) => {
        consolidadoTotal.data = consolidadoTotal.data.concat(d.data);
      });

      this.generarGridTasaConversionCoordinador(
        consolidadoTotal,
        rpta.centroCostoAsesorAgrupados
      );
      this.generarGridTasaConversionAsesorTotal(
        consolidadoTotal,
        rpta.centroCostoAsesorAgrupados
      );
      this.generarGridTasaConversionAsesorPaisesTotal(
        consolidadoTotal,
        rpta.centroCostoAsesor
      );
      rpta.consolidados.forEach((g) => {
        let index = this.categoriaDatoConsolidado.findIndex(x => x.title == g.grupo)
        if(index != -1)
          this.generarGridTasaConversionAsesor(g, index);
      });
      rpta.desagregados.forEach((d) => {
        for (let index = 0; index < d.data.length; index++) {
          this.gridComplemento.push({
            title: d.data[index].nombreGrupo,
            grid: new KendoGrid(),
          });
        }
      });

      let index = 0;
      rpta.desagregados.forEach((g) => {
        g.data.forEach((d) => {
          this.generarGridTasaConversionAsesor2(d,index);
          index++;
        });
      });
    }
  }

  generarGridTasaConversionCoordinador(
    consolidadoAgrupado: IConsolidadoAgrupado,
    dataPrecio: ICentroCostoAsesorAgrupado[]
  ) {
    let finalPrecioPromedio: {
      [key: string]: {
        ingresoReal: number;
        ingresoMes: number;
        DescuentoPromedio: number;
        oc: number;
        is: number;
        promedio: number;
      };
    } = {};

    dataPrecio.forEach((da) => {
      if (!finalPrecioPromedio[da.idAsesor]) {
        let obj = {
          ingresoReal: da.ingresoReal,
          ingresoMes: da.ingresoMes,
          DescuentoPromedio: da.descuentoPromedio,
          oc: da.oportunidadesOCTotal,
          is: da.oportunidadesOCAnyIS,
          promedio: da.precioPromedio,
        };
        finalPrecioPromedio[da.idAsesor] = obj;
      }
    });

    let finalTCmeta: { [key: string]: number } = {};
    let muestraAsesores:  { [key: string]: number } = {};
    let asesores: number[] = [];
    let consolidadoAsesorGrupo: { [key: string]: number } = {};
    let consolidadoCoordinadorGrupo: { [key: string]: any } = {};

    let consolidadoAsesores: {
      [key: string]: {
        grupo: number;
        valor: number;
      }[];
    } = {};
    let consolidadoCoordinador: {
      [key: string]: {
        grupo: number;
        valor: number;
      }[];
    } = {};
    let datosCoordinadoresAsesores: {
      [key: string]: {
        idCoordinador: number;
        nombreCoordinador: string;
        oc: any;
        is: any;
        ingresoReal: any;
        ingresoMes: any;
        DescuentoPromedio: any;
        promedio: any;
        idasesor: number;
      }[];
    } = {};
    let cerradasGrupos: { [key: string]: any } = {};

    let cerradasGruposLista: {
      grupo: number;
      valor: number;
    }[] = [];
    let totalOCMeta = 0;

    consolidadoAgrupado.data.forEach((c) => {
      if (!consolidadoAsesores[c.idasesor])
        consolidadoAsesores[c.idasesor] = [];
      if (!consolidadoCoordinador[c.idCoordinador])
        consolidadoCoordinador[c.idCoordinador] = [];

      if (!datosCoordinadoresAsesores[c.idCoordinador])
        datosCoordinadoresAsesores[c.idCoordinador] = [];

      if (!consolidadoAsesorGrupo[`${c.idasesor},${c.grupo}`]) {
        consolidadoAsesorGrupo[`${c.idasesor},${c.grupo}`] =
          c.oportunidadesCerradas;
        consolidadoAsesores[c.idasesor].push({
          grupo: c.grupo,
          valor: c.tcMeta,
        });
      } else {
        consolidadoAsesorGrupo[`${c.idasesor},${c.grupo}`] +=
          c.oportunidadesCerradas;
      }

      if (!consolidadoCoordinadorGrupo[`${c.idCoordinador},${c.grupo}`]) {
        consolidadoCoordinadorGrupo[`${c.idCoordinador},${c.grupo}`] =
          c.oportunidadesCerradas;
        consolidadoCoordinador[c.idCoordinador].push({
          grupo: c.grupo,
          valor: c.tcMeta,
        });
      } else {
        consolidadoCoordinadorGrupo[`${c.idCoordinador},${c.grupo}`] +=
          c.oportunidadesCerradas;
      }
      if (!muestraAsesores[c.idasesor]) {
        muestraAsesores[c.idasesor] = 1;
        asesores.push(c.idasesor);
        if(finalPrecioPromedio[c.idasesor] != null){
          let obj = {
            idCoordinador: c.idCoordinador,
            nombreCoordinador: c.nombreCoordinador,
            oc: finalPrecioPromedio[c.idasesor].oc,
            is: finalPrecioPromedio[c.idasesor].is,
            ingresoReal: finalPrecioPromedio[c.idasesor].ingresoReal,
            ingresoMes: finalPrecioPromedio[c.idasesor].ingresoMes,
            DescuentoPromedio: finalPrecioPromedio[c.idasesor].DescuentoPromedio,
            promedio: finalPrecioPromedio[c.idasesor].promedio,
            idasesor: c.idasesor,
          };
          datosCoordinadoresAsesores[c.idCoordinador].push(obj);
        }
      }

      if (!cerradasGrupos[c.grupo]) {
        let obj = {
          grupo: c.grupo,
          valor: c.tcMeta,
        };
        cerradasGruposLista.push(obj);
        cerradasGrupos[c.grupo] = c.oportunidadesCerradas;
      } else {
        cerradasGrupos[c.grupo] =
          cerradasGrupos[c.grupo] + c.oportunidadesCerradas;
      }
      totalOCMeta = totalOCMeta + c.oportunidadesCerradas;
    });

    let totalMetaFinalCoordinador = 0;
    cerradasGruposLista.forEach((da) => {
      totalMetaFinalCoordinador += cerradasGrupos[da.grupo] * da.valor;
    });

    totalMetaFinalCoordinador =
      totalOCMeta == 0 ? 0 : totalMetaFinalCoordinador / totalOCMeta;
    totalMetaFinalCoordinador =
      Math.round(totalMetaFinalCoordinador * 100) / 100;
    this.gridsCoordinadors[0].totalMetaFinal = totalMetaFinalCoordinador;

    asesores.forEach((pt) => {
      let idAsesor = pt;
      let totalOC = 0;
      let TCmeta = 0;
      consolidadoAsesores[idAsesor].forEach((datos) => {
        totalOC += consolidadoAsesorGrupo[`${idAsesor},${datos.grupo}`];
        TCmeta +=
          consolidadoAsesorGrupo[`${idAsesor},${datos.grupo}`] * datos.valor;
      });
      let obj = {
        asesor: idAsesor,
        TCmeta: TCmeta / totalOC,
      };
      if (!finalTCmeta[idAsesor]) {
        finalTCmeta[idAsesor] = this.calcularTCFila(TCmeta, totalOC);
      }
    });

    let dataCoordinadores: IConsolidadoCoordinador[] = [];
    let finalTCmetaCoordinadores: { [key: string]: number } = {};

    for (let coordinador in consolidadoCoordinador) {
      let totalOC = 0;
      let TCmeta = 0;
      consolidadoCoordinador[coordinador].forEach((datos) => {
        totalOC += consolidadoCoordinadorGrupo[`${coordinador},${datos.grupo}`];
        TCmeta +=
          consolidadoCoordinadorGrupo[`${coordinador},${datos.grupo}`] *
          datos.valor;
      });

      if (!finalTCmetaCoordinadores[coordinador]) {
        finalTCmetaCoordinadores[coordinador] =
          Math.round(this.calcularTCFila(TCmeta, totalOC) * 100) / 100;
      }
    }

    for (let asesor in datosCoordinadoresAsesores) {
      let obj: IConsolidadoCoordinador = {
        oc: 0,
        is: 0,
        tc: 0,
        meta: 0,
        RealByMeta: 0,
        ingresoRealMeta: 0,
        ingresoRealPromedio: 0,
        ingresoPromedioMeta: 0,
        ingresoReal: 0,
        ingresoMes: 0,
        descuentoPromedio: 0,
        ingresoMeta: 0,
        idCoordinador: 0,
        nombreCoordinador: '',
      };
      let count = 0;
      datosCoordinadoresAsesores[asesor].forEach((pt) => {
        obj.nombreCoordinador = pt.nombreCoordinador;
        obj.idCoordinador = pt.idCoordinador;
        obj.oc += pt.oc;
        obj.is += pt.is;
        obj.tc = pt.is / pt.oc;
        obj.ingresoReal = obj.ingresoReal + Math.round(pt.ingresoReal);
        obj.ingresoMes = obj.ingresoMes + Math.round(pt.ingresoMes);
        obj.descuentoPromedio += Math.round(pt.DescuentoPromedio);
        obj.ingresoMeta += Math.round(
          finalTCmeta[pt.idasesor] * pt.oc * pt.promedio
        );
        count++;
      });
      //validar dividendo = 0;
      obj.descuentoPromedio = Math.round(obj.descuentoPromedio / count);
      obj.ingresoMeta = Math.round(obj.ingresoMeta / 100);
      obj.tc = obj.oc == 0 ? 0 : obj.is / obj.oc;
      obj.ingresoRealPromedio =
        obj.is == 0 ? 0 : Math.round(obj.ingresoReal / obj.is);
      obj.meta = finalTCmetaCoordinadores[asesor];
      obj.ingresoPromedioMeta = obj.ingresoMeta / obj.meta;
      obj.ingresoPromedioMeta = Math.round(
        (obj.ingresoPromedioMeta / obj.oc) * 100
      );

      obj.RealByMeta = obj.meta == 0 ? 0 : obj.tc / obj.meta;
      obj.ingresoRealMeta =
        obj.ingresoMeta == 0 ? 0 : obj.ingresoReal / obj.ingresoMeta;

      //dando Formatos
      obj.meta = obj.meta / 100;
      obj.RealByMeta = Math.round(obj.RealByMeta * 10000);
      obj.ingresoRealMeta = Math.round(obj.ingresoRealMeta * 100);

      dataCoordinadores.push(obj);
    }
    this.gridsCoordinadors[0].grid.data = dataCoordinadores;
    this.gridsCoordinadors[0].grid.aggregateResult = aggregateBy(
      dataCoordinadores,
      this.aggregates
    );
    let data = 
    this.gridsCoordinadors[0].totalTCReal = this.calcularTCTotal(this.gridsCoordinadors[0].grid.data, 'is', 'oc');
    
    
    /*let dataCoordinadoresSenior = dataCoordinadores.filter(
      (item) => item.ingresoPromedioMeta >= 2000
    );

    let dataCoordinadoresJunior = dataCoordinadores.filter(
      (item) => item.ingresoPromedioMeta < 2000
    );
    // Categoria dato por Coordinador Senior
    this.gridsCoordinadors[1].grid.data = dataCoordinadoresSenior;
    this.gridsCoordinadors[1].grid.aggregateResult = aggregateBy(
      dataCoordinadoresSenior,
      this.aggregates
    );
    this.gridsCoordinadors[1].totalTCReal = this.calcularTCTotal(this.gridsCoordinadors[1].grid.data, 'is', 'oc');

    // Categoria dato por Coordinador Junior
    this.gridsCoordinadors[2].grid.data = dataCoordinadoresJunior;
    this.gridsCoordinadors[2].grid.aggregateResult = aggregateBy(
      dataCoordinadoresJunior,
      this.aggregates
    );
    this.gridsCoordinadors[2].totalTCReal = this.calcularTCTotal(this.gridsCoordinadors[2].grid.data, 'is', 'oc');

    this.gridsCoordinadors[1].totalMetaFinal = this.calculaMetaFinalCoordinador(
      consolidadoAgrupado.data,
      dataCoordinadoresSenior
    );
    this.gridsCoordinadors[2].totalMetaFinal = this.calculaMetaFinalCoordinador(
      consolidadoAgrupado.data,
      dataCoordinadoresJunior
    );*/
  }

  calculaMetaFinalCoordinador(
    consolidados: IConsolidado[],
    coordinadores: IConsolidadoCoordinador[]
  ): number {
    let cerradasGrupos: { [key: string]: number } = {};
    let cerradasGruposLista: {
      grupo: number;
      valor: number;
    }[] = [];
    coordinadores.forEach((coordinador) => {
      let filterConsolidado = consolidados.filter(
        (item) => item.idCoordinador == coordinador.idCoordinador
      );
      filterConsolidado.forEach((c) => {
        if (!cerradasGrupos[c.grupo]) {
          cerradasGrupos[c.grupo] = c.oportunidadesCerradas;
          cerradasGruposLista.push({
            grupo: c.grupo,
            valor: c.tcMeta,
          });
        } else cerradasGrupos[c.grupo] += c.oportunidadesCerradas;
      });
    });
    let metaFinalCoordinador = 0;
    let totalOCMeta = 0;
    cerradasGruposLista.forEach((cg) => {
      metaFinalCoordinador += cerradasGrupos[cg.grupo] * cg.valor;
      totalOCMeta += cerradasGrupos[cg.grupo];
    });

    metaFinalCoordinador =
      totalOCMeta == 0 ? 0 : metaFinalCoordinador / totalOCMeta;
    metaFinalCoordinador = Math.round(metaFinalCoordinador * 100) / 100;
    return metaFinalCoordinador;
  }

  calcularMetaFinal(
    grupos: {
      grupo: number;
      valor: number;
    }[],
    cerradasGrupo: {
      [key: string]: number;
    }
  ): number {
    let totalOC = 0;
    let metaFinalTipoAsesor = 0;
    grupos.forEach((da) => {
      metaFinalTipoAsesor += cerradasGrupo[da.grupo] * da.valor;
      totalOC += cerradasGrupo[da.grupo];
    });
    metaFinalTipoAsesor = totalOC == 0 ? 0 : metaFinalTipoAsesor / totalOC;
    metaFinalTipoAsesor = Math.round(metaFinalTipoAsesor * 100) / 100;
    return metaFinalTipoAsesor;
  }

  generarGridTasaConversionAsesorTotal(
    consolidadoAgrupado: IConsolidadoAgrupado,
    centroCostoAsesorAgrupado: ICentroCostoAsesorAgrupado[]
  ) {
    let muestraAsesores:  { [key: string]: number } = {};
    let consolidadoAsesorGrupo: { [key: string]: number } = {};
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
    let consolidadoAsesores: {
      [key: string]: {
        grupo: number;
        valor: number;
      }[];
    } = {};
    let totalOCMeta: number = 0;
    let cerradasGruposGeneral: { [key: string]: number } = {};
    let cerradasGruposSenior: { [key: string]: number } = {};
    let cerradasGruposJunior: { [key: string]: number } = {};
    let cerradasGruposListaGeneral: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaSenior: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaJunior: {
      grupo: number;
      valor: number;
    }[] = [];
    let datosInit = consolidadoAgrupado.data;
    datosInit.forEach((c) => {
      if (!consolidadoAsesores[c.idasesor])
        consolidadoAsesores[c.idasesor] = [];
      if (!consolidadoAsesorGrupo[`${c.idasesor},${c.grupo}`]) {
        consolidadoAsesorGrupo[`${c.idasesor},${c.grupo}`] =
          c.oportunidadesCerradas;
        consolidadoAsesores[c.idasesor].push({
          grupo: c.grupo,
          valor: c.tcMeta,
        });
      } else
        consolidadoAsesorGrupo[`${c.idasesor},${c.grupo}`] +=
          c.oportunidadesCerradas;

      if (!muestraAsesores[c.idasesor]) {
        muestraAsesores[c.idasesor] = 1;
        asesores.push({
          idAsesor: c.idasesor,
          nombreAsesor: c.nombre,
          nombreCoordinador: c.nombreCoordinador,
        });
      }

      if (!cerradasGrupos[c.grupo]) {
        cerradasGruposLista.push({
          grupo: c.grupo,
          valor: c.tcMeta,
        });
        cerradasGrupos[c.grupo] = c.oportunidadesCerradas;
      } else cerradasGrupos[c.grupo] += c.oportunidadesCerradas;

      totalOCMeta += c.oportunidadesCerradas;
      //Agregado para division Senior  o Junior
      let precios = centroCostoAsesorAgrupado.find(
        (item) => item.idAsesor == c.idasesor
      );
      if(precios != null){

        if (!cerradasGruposGeneral[c.grupo]) {
          cerradasGruposListaGeneral.push({
            grupo: c.grupo,
            valor: c.tcMeta,
          });
          cerradasGruposGeneral[c.grupo] = c.oportunidadesCerradas;
        } else cerradasGruposGeneral[c.grupo] += c.oportunidadesCerradas;

        /*
        if (precios.precioPromedio >= 2000) {
          if (!cerradasGruposSenior[c.grupo]) {
            cerradasGruposListaSenior.push({
              grupo: c.grupo,
              valor: c.tcMeta,
            });
            cerradasGruposSenior[c.grupo] = c.oportunidadesCerradas;
          } else cerradasGruposSenior[c.grupo] += c.oportunidadesCerradas;
        } else {
          if (!cerradasGruposJunior[c.grupo]) {
            cerradasGruposListaJunior.push({
              grupo: c.grupo,
              valor: c.tcMeta,
            });
            cerradasGruposJunior[c.grupo] = c.oportunidadesCerradas;
          } else cerradasGruposJunior[c.grupo] += c.oportunidadesCerradas;
        }*/
      }
    });
    let totalMetaFinal = 0;
    cerradasGruposLista.forEach((cgl) => {
      totalMetaFinal += cerradasGrupos[cgl.grupo] * cgl.valor;
    });
    totalMetaFinal = totalOCMeta == 0 ? 0 : totalMetaFinal / totalOCMeta;
    totalMetaFinal = Math.round(totalMetaFinal * 100) / 100;

    let finalTCmeta: { [key: string]: number } = {};
    let asesoresGeneral: IConsolidadoAsesor[] = [];
    let asesoresSenior: IConsolidadoAsesor[] = [];
    let asesoresJunior: IConsolidadoAsesor[] = [];
    asesores.forEach((pt) => {
      let idAsesor = pt.idAsesor;
      let totalOC = 0;
      let TCmeta = 0;
      consolidadoAsesores[idAsesor].forEach((datos) => {
        totalOC += consolidadoAsesorGrupo[`${idAsesor},${datos.grupo}`];
        TCmeta +=
          consolidadoAsesorGrupo[`${idAsesor},${datos.grupo}`] * datos.valor;
      });

      let metaAsesor = this.calcularTCFila(TCmeta, totalOC);
      if (!finalTCmeta[idAsesor]) {
        finalTCmeta[idAsesor] = metaAsesor;
      }
      //Para Tipo Asesores
      let ingresosAsesor = centroCostoAsesorAgrupado.find(
        (item) => item.idAsesor == idAsesor
      );
      if(ingresosAsesor != null){
        let obj: IConsolidadoAsesor = {
          nombreAsesor: pt.nombreAsesor,
          nombreCoordinador: pt.nombreCoordinador,
          IdAsesor: idAsesor,
          inscritos: ingresosAsesor.oportunidadesOCAnyIS,
          cerradas: ingresosAsesor.oportunidadesOCTotal,
          tc:
            ingresosAsesor.oportunidadesOCTotal == 0
              ? 0
              : ingresosAsesor.oportunidadesOCAnyIS /
                ingresosAsesor.oportunidadesOCTotal,
          tcMeta: Math.round(metaAsesor * 100) / 100 / 100,
          ingresoMetaPromedio: Math.round(ingresosAsesor.precioPromedio),
          ingresoRealPromedio:
            ingresosAsesor.oportunidadesOCAnyIS == 0
              ? 0
              : Math.round(
                  Math.round(ingresosAsesor.ingresoReal) /
                    ingresosAsesor.oportunidadesOCAnyIS
                ),
          ingresoReal:
            ingresosAsesor.oportunidadesOCAnyIS == 0
              ? 0
              : Math.round(ingresosAsesor.ingresoReal),
          ingresoMes:
            ingresosAsesor.oportunidadesOCAnyIS == 0
              ? 0
              : Math.round(ingresosAsesor.ingresoMes),
          DescuentoPromedio:
            ingresosAsesor.oportunidadesOCAnyIS == 0
              ? 0
              : Math.round(ingresosAsesor.descuentoPromedio),
        };
        obj.RealByMeta = Math.round((obj.tc * 100 * 100) / metaAsesor);
        obj.ingresoMeta = Math.round(
          obj.tcMeta *
            ingresosAsesor.oportunidadesOCTotal *
            obj.ingresoMetaPromedio
        );
        obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
  
        /*if (ingresosAsesor.precioPromedio >= 2000) {
          asesoresSenior.push(obj);
        } else {
          asesoresJunior.push(obj);
        }
        */
        asesoresGeneral.push(obj);
      }
    });

    let finalPrecioPromedio: { [key: number]: number } = {};
    let finalPrecioIngresoReal: { [key: number]: number } = {};
    let finalPrecioIngresoMes: { [key: number]: number } = {};
    let finalPrecioDescuentoPromedio: { [key: number]: number } = {};

    centroCostoAsesorAgrupado.forEach((da) => {
      if (!finalPrecioPromedio[da.idAsesor]) {
        finalPrecioPromedio[da.idAsesor] = da.precioPromedio;
        let ingresoReal = Math.round(da.ingresoReal);
        let ingresoMes = Math.round(da.ingresoMes);
        let descuentoPromedio = Math.round(da.descuentoPromedio);
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
            : descuentoPromedio / da.oportunidadesOCAnyIS;
        finalPrecioIngresoReal[da.idAsesor] = Math.round(finalReal);
        finalPrecioIngresoMes[da.idAsesor] = Math.round(finalmes);
        finalPrecioDescuentoPromedio[da.idAsesor] = Math.round(finaldescuento);
      }
    });

    let todoData = consolidadoAgrupado.data;
    let muestra: { [key: string]: number } = {};
    let muestraIS: { [key: string]: number } = {};
    let agregatesFix: AggregateDescriptor[] = [];
    let filtro: any = [];

    todoData.forEach((da) => {
      let asesor = da.idasesor;
      if (!muestra[asesor]) {
        muestra[asesor] = da.oportunidadesCerradas;
        muestraIS[asesor] = da.inscritosMatriculados;
      } else {
        muestra[asesor] += da.oportunidadesCerradas;
        muestraIS[asesor] += da.inscritosMatriculados;
      }
    });

    for (let id in muestra) {
      if (muestra[id] > this.dataFormFiltro.muestraMinima)
        filtro.push(Number(id));
    }
    let mdata: { [key: string]: any } = {};

    todoData.forEach((da) => {
      let llave = da.nombre;
      if (!filtro.includes(da.idasesor)) {
        llave = 'Otros';
        da.nombre = 'Otros';
        da.nombreCoordinador = ' Otros';
      }
      if (!mdata[llave]) {
        mdata[llave] = {
          nombre: da.nombre,
          nombreCoordinador: da.nombreCoordinador,
        };
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
      mdata[llave]['IMetaISByIReal'] = Math.round(
        mdata[llave]['IMetaISByIReal'] * 100
      );

      mdata[llave]['idcategoriaOrigen'] = da.idcategoriaOrigen;
      mdata[llave]['probabilidad'] = consolidadoAgrupado.grupo;
    });
    let datos = [];
    for (let dat in mdata) {
      datos.push(mdata[dat]);
    }

    if (todoData.length == 0) {
      let obj: any = {};
      obj.g = 0;
      obj.l = [{ pais: 0, nombre: 'qwerty' }];
      todoData.push(obj);
    }
    let temp: { [key: string]: IConsolidado } = {};
    todoData.forEach((da) => {
      if (!temp[da.pais])
        // temp[da.pais].push(da);
        temp[da.pais] = da;
    });

    let columnas: any = [];
    for (const key in temp) {
      let da = temp[key];
      let field1 = `A_${da.pais}IS`;
      let field2 = `A_${da.pais}OC`;
      let field3 = `A_${da.pais}TC`;
      agregatesFix.push(
        { field: field1, aggregate: 'sum' },
        { field: field2, aggregate: 'sum' },
        { field: field3, aggregate: 'sum' }
      );
      columnas.push({
        title: da.nombrePais,
        pais: da.pais,
        field1: field1,
        field2: field2,
        width: 400,
        columns: [
          {
            field: field1,
            title: 'IS',
            width: 70,
          },
          {
            field: field2,
            title: 'OC',
            width: 70,
          },
          {
            field: field3,
            title: 'TC',
            width: 70,
          },
        ],
      });
    }

    datos = datos.sort(function (a, b) {
      if (a.nombreCoordinador < b.nombreCoordinador) return 1;
      if (a.nombreCoordinador > b.nombreCoordinador) return -1;
      return 0;
    });
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

    this.gridCategoriaTotal.columns = columnas;
    this.gridCategoriaTotal.data = datos;
    this.gridCategoriaTotal.aggregateDescriptor = agregatesFix;
    this.gridCategoriaTotal.aggregateResult = aggregateBy(datos, agregatesFix);
    this.gridCategoriaTotal.objFooterTemp = {
      totalMetaFinal: totalMetaFinal,
    };

    let metaFinalTipoAsesor = this.calcularMetaFinal(
      cerradasGruposListaGeneral,
      cerradasGruposGeneral
    );
    this.cargarGridsAsesores(
      'general',
      '_',
      asesoresGeneral,
      metaFinalTipoAsesor
    );

    metaFinalTipoAsesor = this.calcularMetaFinal(
      cerradasGruposListaSenior,
      cerradasGruposSenior
    );
    this.cargarGridsAsesores(
      'senior',
      '_',
      asesoresSenior,
      metaFinalTipoAsesor
    );

    metaFinalTipoAsesor = this.calcularMetaFinal(
      cerradasGruposListaJunior,
      cerradasGruposJunior
    );
    this.cargarGridsAsesores(
      'junior',
      '_',
      asesoresJunior,
      metaFinalTipoAsesor
    );
  }

  cargarGridsAsesores(
    tipo: string,
    pais: string,
    data: any[],
    metaFinalTipoAsesor: number
  ) {
    const aggregates: AggregateDescriptor[] = [
      { field: 'inscritos', aggregate: 'sum' },
      { field: 'cerradas', aggregate: 'sum' },
      { field: 'ingresoMes', aggregate: 'sum' },
      { field: 'DescuentoPromedio', aggregate: 'average' },
      { field: 'ingresoReal', aggregate: 'sum' },
      { field: 'ingresoMeta', aggregate: 'sum' },
    ];

    let index1 = this.gridsAsesors.findIndex(
      (x) => x.tipo.toLowerCase() == tipo.toLowerCase()
    );
    if (index1 != -1) {
      let index2 = this.gridsAsesors[index1].grids.findIndex(
        (x) => x.pais.toLowerCase() == pais.toLowerCase()
      );
      if (index2 != -1) {
        this.gridsAsesors[index1].grids[index2].grid.data = cloneData(data);
        this.gridsAsesors[index1].grids[index2].grid.aggregateResult =
          aggregateBy(data, aggregates);
        this.gridsAsesors[index1].grids[index2].totalMetaFinal =
          metaFinalTipoAsesor;
      }
    }
  }

  generarGridTasaConversionAsesorPaisesTotal(
    dataMain: IConsolidadoAgrupado,
    dataPrecio: ICentroCostoAsesor[]
  ) {
    let muestraAsesores: { [key: string]: number } = {};
    let consolidadoAsesorGrupo: { [key: string]: number } = {};
    let cerradasGrupos: { [key: number]: number } = {};
    let cerradasGruposLista: {
      grupo: number;
      valor: number;
    }[] = [];
    let asesores: {
      idAsesor: number;
      nombreAsesor: string;
      nombreCoordinador: string;
    }[] = [];
    let consolidadoAsesores: {
      [key: number]: {
        grupo: number;
        valor: number;
        pais: number;
      }[];
    } = [];
    let datosInit = dataMain.data;
    let totalOCMeta = 0;

    let cerradasGruposGeneralPeru: { [key: number]: number } = {};
    let cerradasGruposGeneralColombia: { [key: number]: number } = {};
    let cerradasGruposGeneralBolivia: { [key: number]: number } = {};
    let cerradasGruposGeneralMexico: { [key: number]: number } = {};
    let cerradasGruposGeneralChile: { [key: number]: number } = {};
    let cerradasGruposGeneralOtros: { [key: number]: number } = {};

    let cerradasGruposSeniorPeru: { [key: number]: number } = {};
    let cerradasGruposSeniorColombia: { [key: number]: number } = {};
    let cerradasGruposSeniorBolivia: { [key: number]: number } = {};
    let cerradasGruposSeniorMexico: { [key: number]: number } = {};
    let cerradasGruposSeniorOtros: { [key: number]: number } = {};

    let cerradasGruposJuniorPeru: { [key: number]: number } = {};
    let cerradasGruposJuniorColombia: { [key: number]: number } = {};
    let cerradasGruposJuniorBolivia: { [key: number]: number } = {};
    let cerradasGruposJuniorMexico: { [key: number]: number } = {};
    let cerradasGruposJuniorOtros: { [key: number]: number } = {};


    let cerradasGruposListaGeneralPeru: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaGeneralColombia: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaGeneralBolivia: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaGeneralMexico: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaGeneralChile: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaGeneralOtros: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaSeniorPeru: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaSeniorColombia: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaSeniorBolivia: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaSeniorMexico: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaSeniorOtros: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaJuniorPeru: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaJuniorColombia: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaJuniorBolivia: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaJuniorMexico: {
      grupo: number;
      valor: number;
    }[] = [];
    let cerradasGruposListaJuniorOtros: {
      grupo: number;
      valor: number;
    }[] = [];

    datosInit.forEach((da) => {
      if (!consolidadoAsesores[da.idasesor])
        consolidadoAsesores[da.idasesor] = [];
      let paisAgrupamiento = 0;
      if (da.nombrePais.indexOf('Perú') >= 0) {
        paisAgrupamiento = 51;
      } else if (da.nombrePais.indexOf('Colombia') >= 0) {
        paisAgrupamiento = 57;
      } else if (da.nombrePais.indexOf('Bolivia') >= 0) {
        paisAgrupamiento = 591;
      } else if (da.nombrePais.indexOf('Mexico') >= 0) {
        paisAgrupamiento = 52;
      } else if (da.nombrePais.indexOf('Chile') >= 0) {
        paisAgrupamiento = 56;
      }
      
      const key = `${da.idasesor},${da.grupo},${paisAgrupamiento}`;
      if (!consolidadoAsesorGrupo[key]) {
        consolidadoAsesorGrupo[key] = da.oportunidadesCerradas;
        consolidadoAsesores[da.idasesor].push({
          grupo: da.grupo,
          valor: da.tcMeta,
          pais: paisAgrupamiento,
        });
      } else {
        consolidadoAsesorGrupo[key] += da.oportunidadesCerradas;
      }
      if (!muestraAsesores[da.idasesor]) {
        muestraAsesores[da.idasesor] = 1;
        asesores.push({
          idAsesor: da.idasesor,
          nombreAsesor: da.nombre,
          nombreCoordinador: da.nombreCoordinador,
        });
      }
      if (!cerradasGrupos[da.grupo]) {
        cerradasGruposLista.push({
          grupo: da.grupo,
          valor: da.tcMeta,
        });
        cerradasGrupos[da.grupo] = da.oportunidadesCerradas;
      } else {
        cerradasGrupos[da.grupo] += da.oportunidadesCerradas;
      }
      totalOCMeta = totalOCMeta + da.oportunidadesCerradas;
      //Agregado para division Senior o Junior
      let precios = dataPrecio.filter((item) => item.idasesor == da.idasesor);
      let montototal = 0;
      let octotal = 0;
      let precioPromediovalidar = 0;
      precios.forEach((t) => {
        montototal += t.precioListaFinal;
        octotal += t.oportunidadesOCTotal;
      });
      precioPromediovalidar = montototal / octotal;
      precios.forEach((pr) => {
        if (pr.idcodigopais === 51) {
          this.calcularCerradasGrupos(
            cerradasGruposGeneralPeru,
            cerradasGruposListaGeneralPeru,
            da
          );

          /*if (precioPromediovalidar >= 2000) {
            this.calcularCerradasGrupos(
              cerradasGruposSeniorPeru,
              cerradasGruposListaSeniorPeru,
              da
            );
          } else {
            this.calcularCerradasGrupos(
              cerradasGruposJuniorPeru,
              cerradasGruposListaJuniorPeru,
              da
            );
          }*/
        } else if (pr.idcodigopais === 57) {
          this.calcularCerradasGrupos(
            cerradasGruposGeneralColombia,
            cerradasGruposListaGeneralColombia,
            da
          );
          /*
          if (precioPromediovalidar >= 2000) {
            this.calcularCerradasGrupos(
              cerradasGruposSeniorColombia,
              cerradasGruposListaSeniorColombia,
              da
            );
          } else {
            this.calcularCerradasGrupos(
              cerradasGruposJuniorColombia,
              cerradasGruposListaJuniorColombia,
              da
            );
          }
          */
        } else if (pr.idcodigopais === 591) {

          this.calcularCerradasGrupos(
            cerradasGruposGeneralBolivia,
            cerradasGruposListaGeneralBolivia,
            da
          );

          /*if (precioPromediovalidar >= 2000) {
            this.calcularCerradasGrupos(
              cerradasGruposSeniorBolivia,
              cerradasGruposListaSeniorBolivia,
              da
            );
          } else {
            this.calcularCerradasGrupos(
              cerradasGruposJuniorBolivia,
              cerradasGruposListaJuniorBolivia,
              da
            );
          }*/
        } else if (pr.idcodigopais === 52) {

          this.calcularCerradasGrupos(
            cerradasGruposGeneralMexico,
            cerradasGruposListaGeneralMexico,
            da
          );

          /*if (precioPromediovalidar >= 2000) {
            this.calcularCerradasGrupos(
              cerradasGruposSeniorMexico,
              cerradasGruposListaSeniorMexico,
              da
            );
          } else {
            this.calcularCerradasGrupos(
              cerradasGruposJuniorMexico,
              cerradasGruposListaJuniorMexico,
              da
            );
          }*/
        } else if (pr.idcodigopais === 56) {

          this.calcularCerradasGrupos(
            cerradasGruposGeneralChile,
            cerradasGruposListaGeneralChile,
            da
          );

          /*if (precioPromediovalidar >= 2000) {
            this.calcularCerradasGrupos(
              cerradasGruposSeniorMexico,
              cerradasGruposListaSeniorMexico,
              da
            );
          } else {
            this.calcularCerradasGrupos(
              cerradasGruposJuniorMexico,
              cerradasGruposListaJuniorMexico,
              da
            );
          }*/
        } else {

          this.calcularCerradasGrupos(
            cerradasGruposGeneralOtros,
            cerradasGruposListaGeneralOtros,
            da
          );
          /*  
          if (precioPromediovalidar >= 2000) {
            this.calcularCerradasGrupos(
              cerradasGruposSeniorOtros,
              cerradasGruposListaSeniorOtros,
              da
            );
          } else {
            this.calcularCerradasGrupos(
              cerradasGruposJuniorOtros,
              cerradasGruposListaJuniorOtros,
              da
            );
          }*/
        }
      });
    });
    let totalMetaFinal = 0.0;
    cerradasGruposLista.forEach((da) => {
      totalMetaFinal += cerradasGrupos[da.grupo] * da.valor;
    });
    totalMetaFinal = totalOCMeta == 0 ? 0 : totalMetaFinal / totalOCMeta;
    totalMetaFinal = Math.round(totalMetaFinal * 100) / 100;

    let asesoresGeneralPeru: IConsolidadoAsesor[] = [];
    let asesoresGeneralColombia: IConsolidadoAsesor[] = [];
    let asesoresGeneralBolivia: IConsolidadoAsesor[] = [];
    let asesoresGeneralMexico: IConsolidadoAsesor[] = [];
    let asesoresGeneralChile: IConsolidadoAsesor[] = [];
    let asesoresGeneralOtros: IConsolidadoAsesor[] = [];
    let asesoresSeniorPeru: IConsolidadoAsesor[] = [];
    let asesoresSeniorColombia: IConsolidadoAsesor[] = [];
    let asesoresSeniorBolivia: IConsolidadoAsesor[] = [];
    let asesoresSeniorMexico: IConsolidadoAsesor[] = [];
    let asesoresSeniorOtros: IConsolidadoAsesor[] = [];
    let asesoresJuniorPeru: IConsolidadoAsesor[] = [];
    let asesoresJuniorColombia: IConsolidadoAsesor[] = [];
    let asesoresJuniorBolivia: IConsolidadoAsesor[] = [];
    let asesoresJuniorMexico: IConsolidadoAsesor[] = [];
    let asesoresJuniorOtros: IConsolidadoAsesor[] = [];

    asesores.forEach((pt) => {
      let idAsesor = pt.idAsesor;
      let totalOCPeru = 0;
      let TCmetaPeru = 0;
      let totalOCColombia = 0;
      let TCmetaColombia = 0;
      let totalOCBolivia = 0;
      let TCmetaBolivia = 0;
      let totalOCMexico = 0;
      let TCmetaMexico = 0;
      let totalOCChile = 0;
      let TCmetaChile = 0;
      let totalOCOtros = 0;
      let TCmetaOtros = 0;

      consolidadoAsesores[idAsesor].forEach((datos) => {
        if (datos.pais === 51) {
          totalOCPeru =
            totalOCPeru +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},51`] ?? 0);
          TCmetaPeru =
            TCmetaPeru +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},51`] ?? 0) *
              datos.valor;
        } else if (datos.pais === 57) {
          totalOCColombia =
            totalOCColombia +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},57`] ?? 0);
          TCmetaColombia =
            TCmetaColombia +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},57`] ?? 0) *
              datos.valor;
        } else if (datos.pais === 591) {
          totalOCBolivia =
            totalOCBolivia +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},591`] ?? 0);
          TCmetaBolivia =
            TCmetaBolivia +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},591`] ?? 0) *
              datos.valor;
        } else if (datos.pais === 52) {
          totalOCMexico =
            totalOCMexico +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},52`] ?? 0);
          TCmetaMexico =
            TCmetaMexico +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},52`] ?? 0) *
              datos.valor;
        } else if (datos.pais === 56) {
          totalOCChile =
            totalOCChile +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},56`] ?? 0);
          TCmetaChile =
            TCmetaChile +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},56`] ?? 0) *
              datos.valor;
        } else {
          totalOCOtros =
            totalOCOtros +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},0`] ?? 0);
          TCmetaOtros =
            TCmetaOtros +
            (consolidadoAsesorGrupo[`${idAsesor},${datos.grupo},0`] ?? 0) *
              datos.valor;
        }
      });

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
      let metaAsesorChile = this.calcularTCFila(TCmetaChile, totalOCChile);
      let metaAsesorOtros = this.calcularTCFila(TCmetaOtros, totalOCOtros);
      //Para Tipo Asesores
      let ingresosAsesor = dataPrecio.filter(
        (item) => item.idasesor == idAsesor
      );
      let montototal = 0;
      let octotal = 0;
      let precioPromediovalidar = 0;
      ingresosAsesor.forEach((t) => {
        montototal += t.precioListaFinal;
        octotal += t.oportunidadesOCTotal;
      });
      precioPromediovalidar = montototal / octotal;
      ingresosAsesor.forEach((ia) => {
        let obj: IConsolidadoAsesor = {};
        obj.nombreCoordinador = pt.nombreCoordinador;
        obj.nombreAsesor = pt.nombreAsesor;
        obj.IdAsesor = idAsesor;
        obj.inscritos = ia.oportunidadesOCAnyIS;
        obj.cerradas = ia.oportunidadesOCTotal;
        obj.tc =
          ia.oportunidadesOCTotal == 0
            ? 0
            : ia.oportunidadesOCAnyIS / ia.oportunidadesOCTotal;
        obj.tcMeta = 0; //(Math.round(metaAsesor * 100) / 100) / 100;
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
          obj.tcMeta = Math.round(metaAsesorPeru * 100) / 100 / 100;
          obj.RealByMeta = Math.round((obj.tc * 100 * 100) / metaAsesorPeru);
          obj.ingresoMeta = Math.round(
            obj.tcMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);

          asesoresGeneralPeru.push(obj);
          /*
          if (precioPromediovalidar >= 2000) {
            asesoresSeniorPeru.push(obj);
          } else {
            asesoresJuniorPeru.push(obj);
          }*/

        } else if (ia.idcodigopais === 57) {
          obj.tcMeta = Math.round(metaAsesorColombia * 100) / 100 / 100;
          obj.RealByMeta = Math.round(
            (obj.tc * 100 * 100) / metaAsesorColombia
          );
          obj.ingresoMeta = Math.round(
            obj.tcMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
          
          asesoresGeneralColombia.push(obj);
          /*if (precioPromediovalidar >= 2000) {
            asesoresSeniorColombia.push(obj);
          } else {
            asesoresJuniorColombia.push(obj);
          }*/
        } else if (ia.idcodigopais === 591) {
          obj.tcMeta = Math.round(metaAsesorBolivia * 100) / 100 / 100;
          obj.RealByMeta = Math.round((obj.tc * 100 * 100) / metaAsesorBolivia);
          obj.ingresoMeta = Math.round(
            obj.tcMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);

          asesoresGeneralBolivia.push(obj);
          /*if (precioPromediovalidar >= 2000) {
            asesoresSeniorBolivia.push(obj);
          } else {
            asesoresJuniorBolivia.push(obj);
          }*/
        } else if (ia.idcodigopais === 52) {
          obj.tcMeta = Math.round(metaAsesorMexico * 100) / 100 / 100;
          obj.RealByMeta =
            metaAsesorMexico == 0
              ? 0
              : Math.round((obj.tc * 100 * 100) / metaAsesorMexico);
          obj.ingresoMeta = Math.round(
            obj.tcMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM =
            obj.ingresoMeta == 0
              ? 0
              : Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
          
          asesoresGeneralMexico.push(obj);
          /*
          if (precioPromediovalidar >= 2000) {
            asesoresSeniorMexico.push(obj);
          } else {
            asesoresJuniorMexico.push(obj);
          }*/
        } else if (ia.idcodigopais === 56) {
          obj.tcMeta = Math.round(metaAsesorChile * 100) / 100 / 100;
          obj.RealByMeta =
            metaAsesorChile == 0
              ? 0
              : Math.round((obj.tc * 100 * 100) / metaAsesorChile);
          obj.ingresoMeta = Math.round(
            obj.tcMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM =
            obj.ingresoMeta == 0
              ? 0
              : Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);
          
          asesoresGeneralChile.push(obj);
          /*
          if (precioPromediovalidar >= 2000) {
            asesoresSeniorChile.push(obj);
          } else {
            asesoresJuniorChile.push(obj);
          }*/
        } else {
          obj.tcMeta = Math.round(metaAsesorOtros * 100) / 100 / 100;
          obj.RealByMeta =
            metaAsesorOtros == 0
              ? 0
              : Math.round((obj.tc * 100 * 100) / metaAsesorOtros);
          obj.ingresoMeta = Math.round(
            obj.tcMeta * ia.oportunidadesOCTotal * obj.ingresoMetaPromedio
          );
          obj.IRByIM = Math.round((obj.ingresoReal * 100) / obj.ingresoMeta);

          asesoresGeneralOtros.push(obj);
          /*if (precioPromediovalidar >= 2000) {
            asesoresSeniorOtros.push(obj);
          } else {
            asesoresJuniorOtros.push(obj);
          }*/

        }
      });
    });

    let metaFinalGeneralPeru = this.calcularMetaFinal(
      cerradasGruposListaGeneralPeru,
      cerradasGruposGeneralPeru
    );
    let metaFinalGeneralColombia = this.calcularMetaFinal(
      cerradasGruposListaGeneralColombia,
      cerradasGruposGeneralColombia
    );
    let metaFinalGeneralBolivia = this.calcularMetaFinal(
      cerradasGruposListaGeneralBolivia,
      cerradasGruposGeneralBolivia
    );
    let metaFinalGeneralMexico = this.calcularMetaFinal(
      cerradasGruposListaGeneralMexico,
      cerradasGruposGeneralMexico
    );
    let metaFinalGeneralChile = this.calcularMetaFinal(
      cerradasGruposListaGeneralChile,
      cerradasGruposGeneralChile
    );
    let metaFinalGeneralOtros = this.calcularMetaFinal(
      cerradasGruposListaGeneralOtros,
      cerradasGruposGeneralOtros
    );


    let metaFinalSeniorPeru = this.calcularMetaFinal(
      cerradasGruposListaSeniorPeru,
      cerradasGruposSeniorPeru
    );
    let metaFinalSeniorColombia = this.calcularMetaFinal(
      cerradasGruposListaSeniorColombia,
      cerradasGruposSeniorColombia
    );
    let metaFinalSeniorBolivia = this.calcularMetaFinal(
      cerradasGruposListaSeniorBolivia,
      cerradasGruposSeniorBolivia
    );
    let metaFinalSeniorMexico = this.calcularMetaFinal(
      cerradasGruposListaSeniorMexico,
      cerradasGruposSeniorMexico
    );
    let metaFinalSeniorOtros = this.calcularMetaFinal(
      cerradasGruposListaSeniorOtros,
      cerradasGruposSeniorOtros
    );
    let metaFinalJuniorPeru = this.calcularMetaFinal(
      cerradasGruposListaJuniorPeru,
      cerradasGruposJuniorPeru
    );
    let metaFinalJuniorColombia = this.calcularMetaFinal(
      cerradasGruposListaJuniorColombia,
      cerradasGruposJuniorColombia
    );
    let metaFinalJuniorBolivia = this.calcularMetaFinal(
      cerradasGruposListaJuniorBolivia,
      cerradasGruposJuniorBolivia
    );
    let metaFinalJuniorMexico = this.calcularMetaFinal(
      cerradasGruposListaJuniorMexico,
      cerradasGruposJuniorMexico
    );
    let metaFinalJuniorOtros = this.calcularMetaFinal(
      cerradasGruposListaJuniorOtros,
      cerradasGruposJuniorOtros
    );


    this.cargarGridsAsesores(
      'general',
      'peru',
      asesoresGeneralPeru,
      metaFinalGeneralPeru
    );
    this.cargarGridsAsesores(
      'general',
      'colombia',
      asesoresGeneralColombia,
      metaFinalGeneralColombia
    );
    this.cargarGridsAsesores(
      'general',
      'bolivia',
      asesoresGeneralBolivia,
      metaFinalGeneralBolivia
    );
    this.cargarGridsAsesores(
      'general',
      'mexico',
      asesoresGeneralMexico,
      metaFinalGeneralMexico
    );
    this.cargarGridsAsesores(
      'general',
      'chile',
      asesoresGeneralChile,
      metaFinalGeneralChile
    );
    this.cargarGridsAsesores(
      'general',
      'otros',
      asesoresGeneralOtros,
      metaFinalGeneralOtros
    );


    this.cargarGridsAsesores(
      'senior',
      'peru',
      asesoresSeniorPeru,
      metaFinalSeniorPeru
    );
    this.cargarGridsAsesores(
      'senior',
      'colombia',
      asesoresSeniorColombia,
      metaFinalSeniorColombia
    );
    this.cargarGridsAsesores(
      'senior',
      'bolivia',
      asesoresSeniorBolivia,
      metaFinalSeniorBolivia
    );
    this.cargarGridsAsesores(
      'senior',
      'mexico',
      asesoresSeniorMexico,
      metaFinalSeniorMexico
    );
    this.cargarGridsAsesores(
      'senior',
      'otros',
      asesoresSeniorOtros,
      metaFinalSeniorOtros
    );

    this.cargarGridsAsesores(
      'junior',
      'peru',
      asesoresJuniorPeru,
      metaFinalJuniorPeru
    );
    this.cargarGridsAsesores(
      'junior',
      'colombia',
      asesoresJuniorColombia,
      metaFinalJuniorColombia
    );
    this.cargarGridsAsesores(
      'junior',
      'bolivia',
      asesoresJuniorBolivia,
      metaFinalJuniorBolivia
    );
    this.cargarGridsAsesores(
      'junior',
      'mexico',
      asesoresJuniorMexico,
      metaFinalJuniorMexico
    );
    this.cargarGridsAsesores(
      'junior',
      'otros',
      asesoresJuniorOtros,
      metaFinalJuniorOtros
    );
  }

  calcularCerradasGrupos(
    cerradasGrupos: {
      [key: number]: number;
    },
    cerradasGruposLista: {
      grupo: number;
      valor: number;
    }[],
    consolidado: IConsolidado
  ) {
    if (!cerradasGrupos[consolidado.grupo]) {
      cerradasGruposLista.push({
        grupo: consolidado.grupo,
        valor: consolidado.tcMeta,
      });
      cerradasGrupos[consolidado.grupo] = consolidado.oportunidadesCerradas;
    } else
      cerradasGrupos[consolidado.grupo] += consolidado.oportunidadesCerradas;
  }

  generarGridTasaConversionAsesor(
    dataMain: IConsolidadoAgrupado,
    indexGrid: number
  ) {
    let mdata: { [key: string]: any } = {};
    let todoData = dataMain.data;
    let columnas: any = [];
    let muestra: { [key: string]: number } = {};
    let agregatesFix: AggregateDescriptor[] = [];
    let filtro: number[] = [];

    todoData.forEach((da) => {
      if (!muestra[da.idasesor]) {
        muestra[da.idasesor] = da.oportunidadesCerradas;
      } else {
        muestra[da.idasesor] += da.oportunidadesCerradas;
      }
    });
    for (let key in muestra) {
      if (muestra[key] > this.dataFormFiltro.muestraMinima)
        filtro.push(Number(key));
    }

    todoData.forEach((da) => {
      let llave = da.nombre;
      if (!filtro.includes(da.idasesor)) {
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
        mdata[llave][`A_${da.pais}IS`] = da.inscritosMatriculados;
        mdata[llave][`A_${da.pais}OC`] = da.oportunidadesCerradas;
        mdata[llave][`A_${da.pais}TC`] = this.calcularTCFila(
          mdata[llave][`A_${da.pais}IS`],
          mdata[llave][`A_${da.pais}OC`]
        );
      } else {
        if (
          isNaN(mdata[llave][`A_${da.pais}IS`]) ||
          isNaN(mdata[llave][`A_${da.pais}OC`])
        ) {
          mdata[llave][`A_${da.pais}IS`] = da.inscritosMatriculados;
          mdata[llave][`A_${da.pais}OC`] = da.oportunidadesCerradas;
          mdata[llave][`A_${da.pais}TC`] = this.calcularTCFila(
            mdata[llave][`A_${da.pais}IS`],
            mdata[llave][`A_${da.pais}OC`]
          );
        } else {
          mdata[llave][`A_${da.pais}IS`] += da.inscritosMatriculados;
          mdata[llave][`A_${da.pais}OC`] += da.oportunidadesCerradas;
          mdata[llave][`A_${da.pais}TC`] = this.calcularTCFila(
            mdata[llave][`A_${da.pais}IS`],
            mdata[llave][`A_${da.pais}OC`]
          );
        }
      }
      mdata[llave]['CTotalIS'] += da.inscritosMatriculados;
      mdata[llave]['CTotalOC'] += da.oportunidadesCerradas;
      mdata[llave]['CTotalTC'] = this.calcularTCFila(
        mdata[llave]['CTotalIS'],
        mdata[llave]['CTotalOC']
      );
      mdata[llave]['idcategoriaOrigen'] = da.idcategoriaOrigen;
      mdata[llave]['probabilidad'] = dataMain.grupo;
    });
    let datos = [];
    for (let dat in mdata) {
      datos.push(mdata[dat]);
    }

    let total = {
      title: 'Total',
      width: 200,
      field1: 'CTotalIS',
      field2: 'CTotalOC',
      columns: [
        {
          field: 'CTotalIS',
          title: 'IS',
          width: 70,
        },
        {
          field: 'CTotalOC',
          title: 'OC',
          width: 70,
        },
        {
          field: 'CTotalTC',
          title: 'TC',
          format: '{0:p}',
          width: 70,
        },
      ],
    };

    let temp: { [key: string]: IConsolidado } = {};
    todoData.forEach((da) => {
      let llave = da.pais;
      if (!temp[llave]) {
        temp[llave] = da;
      }
    });
    // temp.forEach((da) => {
    for (const key in temp) {
      let da = temp[key];
      let field1 = `A_${da.pais}IS`;
      let field2 = `A_${da.pais}OC`;
      let field3 = `A_${da.pais}TC`;
      agregatesFix.push(
        { field: field1, aggregate: 'sum' },
        { field: field2, aggregate: 'sum' }
      );
      columnas.push({
        title: da.nombrePais,
        width: 400,
        field1: field1,
        field2: field2,
        columns: [
          {
            field: field1,
            title: 'IS',
            width: 100,
          },
          {
            field: field2,
            title: 'OC',
            width: 100,
          },
          {
            field: field3,
            title: 'TC',
            format: '#.00 %',
            width: 100,
          },
        ],
      });
    }
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

    agregatesFix.push(
      { field: 'CTotalIS', aggregate: 'sum' },
      { field: 'CTotalOC', aggregate: 'sum' },
      { field: 'BAgrupadoIS', aggregate: 'sum' },
      { field: 'BAgrupadoOC', aggregate: 'sum' }
    );

    this.categoriaDatoConsolidado[indexGrid].columnGroup = columnas;
    this.categoriaDatoConsolidado[indexGrid].grid.data = datos;
    this.categoriaDatoConsolidado[indexGrid].grid.aggregateResult = aggregateBy(
      datos,
      agregatesFix
    );
  }

  generarGridTasaConversionAsesor2(desagregado: IDesagregado, index1: number) {
    let mdata: { [key: string]: any } = {};
    let oportunidadCerradasAsesor: { [key: number]: number } = {};
    let filtroMuestraMinima: number[] = [];
    let dataMain = cloneData(desagregado.listaMuyAlta);

    dataMain.forEach((da) => {
      if (!oportunidadCerradasAsesor[da.idasesor])
        oportunidadCerradasAsesor[da.idasesor] = da.oportunidadesCerradas;
      else oportunidadCerradasAsesor[da.idasesor] += da.oportunidadesCerradas;
    });

    for (let idAsesor in oportunidadCerradasAsesor) {
      if (
        oportunidadCerradasAsesor[idAsesor] > this.dataFormFiltro.muestraMinima
      )
        filtroMuestraMinima.push(Number(idAsesor));
    }
    dataMain.forEach((da) => {
      let key = da.nombre;
      if (!filtroMuestraMinima.includes(da.idasesor)) {
        key = 'Otros';
        da.nombre = 'Otros';
        da.nombreCoordinador = ' Otros';
      }
      const ca_nombre = this.reemplazarEspacio(da.ca_nombre);
      if (!mdata[key]) {
        mdata[key] = {
          nombreCoordinador: da.nombreCoordinador,
          nombre: da.nombre,
        };

        mdata[key]['CTotalIS'] = 0;
        mdata[key]['CTotalOC'] = 0;
        mdata[key]['CTotalTC'] = 0;
        mdata[key]['CTotalTCMeta'] = 0;
        mdata[key]['PPromedio'] = 0;
        mdata[key]['RealByMeta'] = 0;
        mdata[key]['IReal'] = 0;
        mdata[key]['IMeta'] = 0;
        mdata[key]['IMetaByIReal'] = 0;

        mdata[key][`A_${ca_nombre}IS`] = da.inscritosMatriculados;
        mdata[key][`A_${ca_nombre}OC`] = da.oportunidadesCerradas;
        mdata[key]['CTotalTCMeta'] = da.tcMeta / 100;
      } else {
        if (
          isNaN(mdata[key][`A_${ca_nombre}IS`]) ||
          isNaN(mdata[key][`A_${ca_nombre}OC`])
        ) {
          mdata[key][`A_${ca_nombre}IS`] = da.inscritosMatriculados;
          mdata[key][`A_${ca_nombre}OC`] = da.oportunidadesCerradas;
        } else {
          mdata[key][`A_${ca_nombre}IS`] += da.inscritosMatriculados;
          mdata[key][`A_${ca_nombre}OC`] += da.oportunidadesCerradas;
        }
      }
      mdata[key][`A_${ca_nombre}TC`] = this.calcularTCFila(
        mdata[key][`A_${ca_nombre}IS`],
        mdata[key][`A_${ca_nombre}OC`]
      );

      mdata[key]['CTotalIS'] += da.inscritosMatriculados;
      mdata[key]['CTotalOC'] += da.oportunidadesCerradas;
      mdata[key]['CTotalTC'] = this.calcularTCFila(
        mdata[key]['CTotalIS'],
        mdata[key]['CTotalOC']
      );
      mdata[key]['RealByMeta'] =
        mdata[key]['CTotalTC'] / mdata[key]['CTotalTCMeta'];
      mdata[key]['idcategoriaOrigen'] = da.idcategoriaOrigen;
      mdata[key]['orden'] = desagregado.orden;
      mdata[key]['grupo'] = desagregado.grupo;
      mdata[key]['pais'] = desagregado.pais;
    });
    let datos = [];
    for (let key in mdata) {
      datos.push(mdata[key]);
    }
    datos = datos.sort((a, b) => {
      if (a.nombreCoordinador < b.nombreCoordinador) return 1;
      if (a.nombreCoordinador > b.nombreCoordinador) return -1;
      return 0;
    });

    let agregatesFix: AggregateDescriptor[] = [
      { field: 'CTotalTCMeta', aggregate: 'average' },
      { field: 'CTotalIS', aggregate: 'sum' },
      { field: 'CTotalOC', aggregate: 'sum' },
      { field: 'BAgrupadoIS', aggregate: 'sum' },
      { field: 'BAgrupadoOC', aggregate: 'sum' },
    ];

    this.gridComplemento[index1].grid.data = datos;
    this.gridComplemento[index1].grid.aggregateDescriptor = agregatesFix;
    this.gridComplemento[index1].grid.aggregateResult = aggregateBy(
      datos,
      agregatesFix
    );
  }

  private reemplazarEspacio(str: string) {
    return str.replace(/\s/g, '_');
  }

  private calcularTCFila(IM: number, OC: number): number {
    return OC > 0 ? IM / OC : 0;
  }

  calcularTCTotalV2() {
    let suma1 = 0;
    let suma2 = 0;
    this.gridCategoriaTotal.data.forEach((element) => {
      suma1 += element['CTotalIS'];
      suma2 += element['CTotalOC'];
    });
    let totalMetaFinal = this.gridCategoriaTotal.objFooterTemp.totalMetaFinal;

    if (suma2 > 0) {
      let result = (suma1 * 100) / suma2;
      result = (result / totalMetaFinal) * 100;
      result = Math.round(result);
      return result;
    } else {
      return 0;
    }
  }

  calcularTCTotal(data: any[], campo1: string, campo2: string): number {
    let suma1 = 0;
    let suma2 = 0;
    data.forEach((element) => {
      if (element[campo1]) suma1 += element[campo1];
      if (element[campo2]) suma2 += element[campo2];
    });
    if (suma2 > 0) return Math.round(((suma1 * 100) / suma2) * 10) / 10;
    else return 0;
  }

  calcularTCTotalV2_1(data: any[], IM: string, OC: string, metaTotal: number) {
    let sum = 0;
    let sum2 = 0;
    data.forEach((element) => {
      sum += element[IM];
      sum2 += element[OC];
    });

    if (sum2 > 0) {
      let result = (sum * 100) / sum2;
      result = (result / metaTotal) * 100;
      result = Math.round(result);
      return result;
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

  calcularTCTotalV5(data: any[], IM: any, OC: any, finalMeta: any) {
    let IR: any = 0;
    let IS: any = 0;

    data.forEach((element) => {
      if (!isNaN(element[IM])) IR += element[IM];
      if (!isNaN(element[OC])) IS += element[OC];
    });
    if (IS > 0) {
      let result = IR / IS;
      result = (result / finalMeta) * 100;
      return Math.round(result);
    } else {
      return 0;
    }
  }

  calcularTCV6(precioIS: number, precioOC: number): number {
    if (precioOC > 0) return Math.trunc((precioIS / precioOC) * 100);
    else return 0;
  }

  calcularTCTotalV6(
    data: any[],
    ingresois: any,
    is: any,
    ingresooc: any,
    oc: any,
    finalMeta: any
  ) {
    let sumIS = 0,
      sumOC = 0,
      sumIIS = 0,
      sumIOC = 0;

    data.forEach((element: any) => {
      sumIS += element[is];
      sumIIS += element[ingresois];
      sumOC += element[oc];
      sumIOC += element[ingresooc];
    });

    let PPIS = 0;
    let PPOC = 0;

    if (sumIS > 0) {
      let result = sumIIS / sumIS;
      PPIS = Math.floor(result);
    } else {
      PPIS = 0;
    }

    if (sumOC > 0) {
      let result2 = sumIOC / sumOC;
      result2 = (result2 / finalMeta) * 100;
      PPOC = Math.floor(result2);
    } else {
      PPOC = 0;
    }

    if (PPOC > 0) {
      let result3 = (PPIS / PPOC) * 100;
      return Math.floor(result3);
    } else {
      return 0;
    }
  }

  calcularIngresoMes(data: any) {
    let IM: any = 0;
    data.forEach((element: any) => {
      IM += element.ingresoMes;
    });
    return String(IM);
  }

  calcularTCV7(ingresomes: any, ingresoreal: any) {
    if (ingresoreal > 0) {
      return Math.trunc((ingresomes / ingresoreal) * 100);
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
      return Math.trunc((sum / sum2) * 100);
    } else {
      return 0;
    }
  }

  calcularTCTotalCategoria(data: any, IM: any, OC: any, meta: any) {
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
  calcularTCTotalV4() {
    let sum = 0,
      sum2 = 0;
    this.gridCategoriaTotal.data.forEach((element) => {
      sum += element.IMeta;
      sum2 += element.CTotalOC;
    });

    if (sum2 > 0) {
      let result = sum / sum2;
      result =
        (result / this.gridCategoriaTotal.objFooterTemp.totalMetaFinal) * 100;
      result = Math.floor(result);
      return result;
    } else {
      return 0;
    }
  }

  calcularTCTotalV6_2() {
    let totalIS = 0,
      totalIngresoIS = 0,
      totalOC = 0,
      totalIngresoOC = 0;

    this.gridCategoriaTotal.data.forEach((element) => {
      totalIS += element['CTotalIS'];
      totalIngresoIS += element['IngresoRealIS'];
      totalOC += element['CTotalOC'];
      totalIngresoOC += element['IMeta'];
    });

    let PPIS = 0;
    let PPOC = 0;
    if (totalIS > 0) {
      let result = totalIngresoIS / totalIS;
      PPIS = Math.floor(result);
    } else {
      PPIS = 0;
    }

    if (totalOC > 0) {
      let result2 = totalIngresoOC / totalOC;
      result2 =
        (result2 / this.gridCategoriaTotal.objFooterTemp.totalMetaFinal) * 100;
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
}
