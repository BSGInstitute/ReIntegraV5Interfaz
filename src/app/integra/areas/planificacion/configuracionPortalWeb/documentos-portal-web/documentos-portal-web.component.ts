import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SeccionPlantillaPw, DocumentoSeccionPw, ColumnasReporte, IDocumentosPortaWeb, SubSeccionTipoDetallePw, ListaSubSeccionesPw, ListaGridListaSecciones, SeccionPwFiltroPlantillaPw, EnvioDocumento, DocumentoPw, VersionDocumentoBeneficio } from '@planificacion/models/interfaces/documentosportalweb';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageSizeItem, AddEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface versionesDPW {
  Id:number;
  IdDocumentoPw: number;
  introduccion: string;
  idVersionPrograma: number;
}

@Component({
  selector: 'app-documentos-portal-web',
  templateUrl: './documentos-portal-web.component.html',
  styleUrls: ['./documentos-portal-web.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentosPortalWebComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  // Variable Globales
  gridDocumentosPw = new KendoGrid();
  gridListaRevisionNivel = new KendoGrid();
  listaSeleccion: number[] = [];
  comboPlantilla: IComboBase1[];
  dataVersion : versionesDPW[] = [];
  plantillas: SeccionPlantillaPw[] = [];
  documentos: DocumentoSeccionPw[] = [];
  loaderModal: boolean = false;
  htmlPlantilla: any;
  esNuevo: boolean = false;
  modalRef: NgbModalRef = null;
  listaColumna: ColumnasReporte[] = [];

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  sort: SortDescriptor[] = [
    {
      field: 'idSeccionTipoDetallePw',
      dir: 'asc',
    },
  ];

  columnasReporte: any[] = [
    {
      field: null,
      title: null,
      width: 100,
    },
  ];

  formDatosDocumento: FormGroup = this.formBuilder.group({
    id: 0,
    nombre: [null, Validators.required],
    idPlantilla: [0, [Validators.required]],
  });

  
  formVersionBeneficios: FormGroup = this.formBuilder.group({
    Introduccion1: "",
    Introduccion2: "",
    Introduccion3: "",
  });
  ngOnInit(): void {
    this.obtenerComboPlantilla();
    this.generarReporte();
  }

  //OBTENER - GENERAR REPORTE
  obtenerComboPlantilla() {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.PlantillaPwObtenerPlantillaPw}`)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.comboPlantilla = resp.body;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerPlantillas(idPlantilla: number, documentos?: DocumentoSeccionPw[]) {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.PlantillaMaestroPwObtenerPlantillaSeccionMaestraPorIdPlantilla}/${idPlantilla}`
      )
      .subscribe({
        next: (resp: HttpResponse<SeccionPlantillaPw[]>) => {
          this.plantillas = [];
          if (documentos == null) {
            resp.body.forEach((e) => {
              if (e.idSeccionTipoContenido == 1) {
                e.cabecera = '';
                e.piePagina = '';
                e.idGrid = `grid_${e.id}_${e.id}`;
                e.listaSubSeccionesPw.forEach((f) => {
                  f.field = `_${f.idSeccionTipoDetallePw}_${e.id}`;
                });
                e.grid = new KendoGrid();
                this.configurarGridConsultasForo(e.grid, e.listaSubSeccionesPw);
              }
            });
          } else {
            resp.body.forEach((e) => {
              let seccionGrid = documentos.find((x) => x.idSeccionPW == e.id);
              if (e.idSeccionTipoContenido == 1) {
                if (seccionGrid != null) {
                  e.idGrid = `grid_${e.id}_${e.id}`;
                  e.listaSubSeccionesPw.forEach((f) => {
                    f.field = `_${f.idSeccionTipoDetallePw}_${e.id}`;
                  });
                  e.grid = new KendoGrid();
                  this.configurarGridConsultasForo(e.grid, e.listaSubSeccionesPw);
                  e.cabecera = seccionGrid.cabecera;
                  e.piePagina = seccionGrid.piePagina;
                  let numeroFilas = seccionGrid.listaSubSeccionesPw.map(x => x.numeroFila);
                  numeroFilas = Array.from(new Set(numeroFilas));
                  numeroFilas.forEach((x) => {
                    let fila = seccionGrid.listaSubSeccionesPw.filter((a) => a.numeroFila == x )
                    let objGrid: {
                      [key: string]: string 
                    } = {}
                    fila.forEach((i) => {
                      objGrid[`_${i.idSeccionTipoDetallePw}_${seccionGrid.idSeccionPW}`] = i.contenidoSubSeccion;
                    });
                    e.grid.data.push(objGrid);
                  })
                } else {
                  e.idGrid = `grid_${e.id}_${e.id}`;
                  e.listaSubSeccionesPw = e.listaSubSeccionesPw;
                  e.grid = new KendoGrid();
                  e.cabecera = '';
                  e.piePagina = '';
                  e.listaSubSeccionesPw.forEach((f) => {
                    f.field = `_${f.idSeccionTipoDetallePw}_${e.id}`;
                  });
                  this.configurarGridConsultasForo(e.grid, e.listaSubSeccionesPw);
                }

              } else if (e.idSeccionTipoContenido == 2) {
                if (seccionGrid == undefined || seccionGrid == null) {
                  e.contenido = ''
                } else {
                  e.contenido = seccionGrid.contenido
                }
              }
            });
          }
          this.plantillas = resp.body;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerDocumentosSeccionEditar(dataItem: IDocumentosPortaWeb) {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.DocumentoSeccionPwObtenerDocumentoSeccionEditar}/${dataItem.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<DocumentoSeccionPw[]>) => {
          this.documentos = [];
          this.documentos = resp.body;
          this.obtenerPlantillas(dataItem.idPlantillaPw, this.documentos);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  crearObjetoDesdeLista(
    lista: ColumnasReporte[],
    data: SubSeccionTipoDetallePw[]
  ): Record<string, string> {
    const objetoResultado: Record<string, any> = {};

    for (const elemento of lista) {
      objetoResultado[elemento.field] = data.find(
        (e) => e.nombreSubSeccion == elemento.title
      ).contenidoSubSeccion;
    }
    0;
    return objetoResultado;
  }

  crearObjetoDesdeListaForm(
    lista: ListaSubSeccionesPw[]
  ): Record<string, string> {
    const objetoResultado: Record<string, any> = {};
    for (const elemento of lista) {
      objetoResultado[elemento.field] = null;
    }
    return objetoResultado;
  }

  generarReporte() {
    this.gridDocumentosPw.data = [];
    this.gridDocumentosPw.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.DocumentoPwObtenerTodo)
      .subscribe({
        next: (resp: HttpResponse<IDocumentosPortaWeb[]>) => {
          this.gridDocumentosPw.loading = false;
          this.gridDocumentosPw.data = resp.body;
          if (resp.body.length)
            this.alertaService.notificationSuccessBotom(
              'Documentos generados exitosamente.'
            );
          else this.alertaService.notificationSuccessBotom('Sin datos.');
        },
        error: (error) => {
          this.gridDocumentosPw.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  //FUNCIONES PRINCIPALES

  insertarDocumento() {
    if (this.formDatosDocumento.valid) {
      let data = this.objetoEnviar();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.DocumentoPwInsertarDocumento,
          JSON.stringify(data)
        )
        .subscribe({
          next: (response: HttpResponse<DocumentoPw>) => {
            this.loaderModal = false;
            Swal.fire(
              '¡Creado!',
              'El documento ha sido creado correctamente.',
              'success'
            );
            this.generarReporte();
            this.modalRef.close();
          },
          error: (e) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }

  actualizarDocumento() {
    if (this.formDatosDocumento.valid) {
      let data = this.objetoEnviar();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.DocumentoPwActualizarDocumento,
          JSON.stringify(data)
        )
        .subscribe({
          next: (response: HttpResponse<DocumentoPw>) => {
            this.loaderModal = false;
            Swal.fire(
              '¡Actualizado!',
              'El documento ha sido modificado correctamente.',
              'success'
            );
            this.generarReporte();
            this.modalRef.close();
          },
          error: (e) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }

  eliminarDocumento(dataItem: IDocumentosPortaWeb) {
    this.alertaService
      .swalFireOptions({
        title: '¿Está seguro de Eliminar Documento?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.DocumentoPwEliminarDocumento}/${dataItem.id}`
            )
            .subscribe({
              next: (response: HttpResponse<Boolean[]>) => {
                this.loaderModal = false;
                Swal.fire(
                  '¡Eliminado!',
                  'Documento eliminado correctamente.',
                  'success'
                );
                this.generarReporte();
              },
              error: (error) => {
                this.loaderModal = false;
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        }
      });
  }

  //ABRIR MODALES
  cargar : boolean =false;
  async abrirModalNuevoEditarDocumento(modal: any, dataItem?: IDocumentosPortaWeb) {
    this.formDatosDocumento.reset();
    this.formVersionBeneficios.reset();
    this.plantillas = [];
    this.documentos = [];
    if (dataItem) {
      this.esNuevo = false;
      this.formDatosDocumento.patchValue({
        id: dataItem.id,
        nombre: dataItem.nombre,
        idPlantilla: dataItem.idPlantillaPw,
      });
      this.obtenerDocumentosSeccionEditar(dataItem);
      const introducciones = await this.obtenerIntroduccion(dataItem.id);
      this.asignarIntroducciones(introducciones);
    } else {
      this.esNuevo = true;
    }
    this.modalRef = this.modalService.open(modal, {
      size: 'xl',
      backdrop: 'static',
    });
  }

  //OTROS

  obtenerNombrePlantilla(idPlantilla: number) {
    let item = this.comboPlantilla.find((x) => x.id === idPlantilla);
    return item?.nombre ?? 'Sin Plantilla';
  }

  configurarGridConsultasForo(
    gridPlantilla: KendoGrid,
    columnas: ListaSubSeccionesPw[]
  ) {
    gridPlantilla.habilitarEstadoNewRow = true;
    gridPlantilla.formGroup = this.formBuilder.group(
      this.crearObjetoDesdeListaForm(columnas)
    );
    gridPlantilla.addEvent$.subscribe((resp) => { 
      console.log("Resp",resp)
      console.log(columnas)
      console.log(gridPlantilla)
    });
    gridPlantilla.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    gridPlantilla.removeEvent$.subscribe((resp) => {
      gridPlantilla.data.splice(resp.index, 1);
      gridPlantilla.data = [...gridPlantilla.data];
    });
    gridPlantilla.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as any;
      gridPlantilla.data = [valorForm, ...gridPlantilla.data];
    });
  }


  objetoEnviar() {
    let dataFrom = this.formDatosDocumento.getRawValue();
    let objDocumento: IDocumentosPortaWeb = {
      id: this.esNuevo ? 0 : dataFrom.id,
      nombre: dataFrom.nombre,
      idPlantillaPw: dataFrom.idPlantilla,
      estadoFlujo: 1,
    };
    let introduccionBasica:VersionDocumentoBeneficio ={
      IdVersionPrograma : 1,
      introduccion : this.formVersionBeneficios.get('Introduccion1').value,
    }
    let introduccionProfesional:VersionDocumentoBeneficio ={
      IdVersionPrograma : 2,
      introduccion : this.formVersionBeneficios.get('Introduccion2').value,
    }
    let introduccionGerencial:VersionDocumentoBeneficio ={
      IdVersionPrograma : 3,
      introduccion : this.formVersionBeneficios.get('Introduccion3').value,
    }
    console.log("Basica : " , introduccionBasica,)
    console.log("Profesional : " ,introduccionProfesional )
    console.log("Gerencial : " , introduccionGerencial)
    let ListaIntroduccionVersiones:Array<VersionDocumentoBeneficio> =[];
    ListaIntroduccionVersiones.push(introduccionBasica);
    ListaIntroduccionVersiones.push(introduccionProfesional);
    ListaIntroduccionVersiones.push(introduccionGerencial);
    let listaPlantilla: SeccionPwFiltroPlantillaPw[] = [];
    this.plantillas.forEach((x) => {
      if (x.tipo == 0) {
        if (x.idSeccionTipoContenido == 2) {
          let objeto: SeccionPwFiltroPlantillaPw = {
            id: x.id,
            contenido: window.btoa(unescape(encodeURIComponent(x.contenido))),
            titulo: x.nombre,
            cabecera: x.cabecera? x.cabecera :'',
            piePagina: '',
            idPlantillaPw: x.idPlantillaPw,
            idPlantilla: x.idPlantilla,
            posicion: x.posicion,
            tipo: x.tipo,
            idSeccionMaestroPw: x.idSeccionMaestraPw,
            nombreSeccionTipoContenido: 'Texto',
            zonaWeb: x.zonaWeb,
            visibleWeb: false,
            ordenEeb: x.ordenEeb,
            idSeccionTipoDetallePw: null,
            idSeccionPW: x.id,
            idSeccionTipoContenido: x.idSeccionTipoContenido
          };

          objeto['listaGridListaSecciones'] = [];

          listaPlantilla.push(objeto);
        } else if (x.idSeccionTipoContenido == 1) {
          let valorListaSubSeccion;
          if (x.listaSubSeccionesPw[0] != undefined) {
            valorListaSubSeccion = x.listaSubSeccionesPw[0].idSeccionTipoDetallePw
          } else {
            valorListaSubSeccion = 0
          }
          let objeto: SeccionPwFiltroPlantillaPw = {
            id: x.id,
            contenido: '',
            titulo: x.nombre,
            cabecera: x.cabecera,
            piePagina: x.piePagina,
            idPlantillaPw: x.idPlantillaPw,
            idPlantilla: x.idPlantilla,
            posicion: x.posicion,
            tipo: x.tipo,
            idSeccionMaestroPw: x.idSeccionMaestraPw,
            nombreSeccionTipoContenido: 'Grilla',
            zonaWeb: x.zonaWeb,
            visibleWeb: false,
            ordenEeb: x.ordenEeb,
            idSeccionTipoDetallePw: valorListaSubSeccion,
            idSeccionPW: x.id,
            idSeccionTipoContenido: x.idSeccionTipoContenido,
            listaGridListaSecciones: []
          };
          
          objeto['listaGridListaSecciones'] = [];
          
          let cont = 1
          if (x.grid.data != undefined || x.grid.data != null) {
            x.grid.data.forEach((data: any) => {
              for (const key in data) {
                  let dataGrilla: ListaGridListaSecciones = {
                    clave: key,
                    valor: data[key],
                    numeroFila: cont,
                  }
                  objeto.listaGridListaSecciones.push(dataGrilla);
              }
              cont++
            });
          } else {
            x.grid.data.forEach((data: any) => {
              for (const key in data) {
                  let dataGrilla: ListaGridListaSecciones = {
                    clave: '',
                    valor: '',
                    numeroFila: cont,
                  }
                  objeto.listaGridListaSecciones.push(dataGrilla);
              }
              cont++
            });
          }
          
          listaPlantilla.push(objeto);
        }
      } else {
        let objeto: SeccionPwFiltroPlantillaPw = {
          id: x.id,
          contenido: window.btoa(unescape(encodeURIComponent(x.contenido))),
          titulo: x.nombre,
          cabecera: '',
          piePagina: '',
          idPlantillaPw: x.idPlantillaPw,
          idPlantilla: x.idPlantilla,
          posicion: x.posicion,
          tipo: x.tipo,
          idSeccionMaestroPw: x.idSeccionMaestraPw,
          zonaWeb: x.zonaWeb,
          visibleWeb: false,
          ordenEeb: x.ordenEeb,
          idSeccionTipoDetallePw: null,
          idSeccionPW: x.id,
          idSeccionTipoContenido: x.idSeccionTipoContenido
        }
        
        objeto['listaGridListaSecciones'] = [];

        let cont = 1
        if (x.grid.data != undefined || x.grid.data != null) {
          x.grid.data.forEach((data: any) => {
            for (const key in data) {
                let dataGrilla: ListaGridListaSecciones = {
                  clave: key,
                  valor: data[key],
                  numeroFila: cont,
                }
                objeto.listaGridListaSecciones.push(dataGrilla);
            }
            cont++
          });
        } else {
          x.grid.data.forEach((data: any) => {
            for (const key in data) {
                let dataGrilla: ListaGridListaSecciones = {
                  clave: '',
                  valor: '',
                  numeroFila: cont,
                }
                objeto.listaGridListaSecciones.push(dataGrilla);
            }
            cont++
          });
        }
        listaPlantilla.push(objeto);
      }
    });
    let envio: EnvioDocumento = {
      objetoDocumento: objDocumento,
      lista: listaPlantilla,
      listaIntroduccionBeneficios:ListaIntroduccionVersiones,
    };
    return envio;
  }

  asignarvalores(dataItem :IDocumentosPortaWeb )
  {
    this.obtenerIntroduccion(dataItem.id);
    if (this.dataVersion) {
      this.dataVersion.forEach((version) => {
        console.log("Versiones:", version);
        switch (version.idVersionPrograma) {
          case 1:
            this.formVersionBeneficios.get('Introduccion1').setValue(version.introduccion);
            break;
          case 2:
            this.formVersionBeneficios.get('Introduccion2').setValue(version.introduccion);
            break;
          case 3:
            this.formVersionBeneficios.get('Introduccion3').setValue(version.introduccion);
            break;
        }
      });
    }
  }
  async obtenerIntroduccion(idDocumentoPw: number): Promise<versionesDPW[]> {
    try {
      const resp: HttpResponse<versionesDPW[]> = await this.integraService
        .getJsonResponse(`${constApiPlanificacion.DocumentoPwObtenerIntroduccionVersionDocumento}/${idDocumentoPw}`)
        .toPromise();
  
      console.log("Introducciones obtenidas:", resp.body);
      return resp.body || [];
    } catch (error) {
      console.error('Error al obtener introducciones:', error);
      const mensaje = this.alertaService.getMessageErrorService(error);
      this.alertaService.notificationWarning(mensaje);
      return [];
    }
  }

  asignarIntroducciones(introducciones: versionesDPW[]): void {
    introducciones.forEach((version) => {
      const controlName = `Introduccion${version.idVersionPrograma}`;
      if (this.formVersionBeneficios.get(controlName)) {
        this.formVersionBeneficios.get(controlName).setValue(version.introduccion);
      }
    });
    if (!introducciones.some((v) => v.idVersionPrograma === 1)) {
      this.formVersionBeneficios.get('Introduccion1').setValue('');
    }
    if (!introducciones.some((v) => v.idVersionPrograma === 2)) {
      this.formVersionBeneficios.get('Introduccion2').setValue('');
    }
    if (!introducciones.some((v) => v.idVersionPrograma === 3)) {
      this.formVersionBeneficios.get('Introduccion3').setValue('');
    }
  }




  

}
