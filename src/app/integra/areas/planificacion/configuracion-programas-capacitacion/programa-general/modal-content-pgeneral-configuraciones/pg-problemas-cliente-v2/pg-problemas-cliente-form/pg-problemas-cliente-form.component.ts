import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { IProgramaGeneralFactor, ProgramaGeneralProblemaFactor, ProgramaGeneralProblemaFactorDetalle, ProgramaGeneralProblemaFactorSolucion } from '@planificacion/models/interfaces/ProgramaGeneralProblemaFactor';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

type Opcion = { id: number; nombre: string };

interface IProblemaFactorSolucion{
  id: number;
  idProgramaGeneralProblemaFactorSolucion: number;
  solucion: string;
  orden: number;
  nivel: number;
  seleccionado?: boolean;
}

interface SubSolucionSeleccionadoInterface {
  id: number;
  nombre: string;
  subregistros: { id: number; nombre: string; seleccionado: boolean }[];
  expanded: boolean;
}

@Component({
  selector: 'app-pg-problemas-cliente-form',
  templateUrl: './pg-problemas-cliente-form.component.html',
  styles: []
})
export class PgProblemasClienteFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() esNuevo = true;
  @Input() dataProblema: any = null;
  @Output() cerrado = new EventEmitter<void>();
  @Input() idPGeneral!: number; 
  ddlDefault: Opcion = { id: null as unknown as number, nombre: 'Seleccionar...' };

  opcProblema: ProgramaGeneralProblemaFactor[] = [];
  opcDetalle: ProgramaGeneralProblemaFactorDetalle[] = [];
  opcSolucion: ProgramaGeneralProblemaFactorSolucion[] = [];

  
  opcDetalleTitulo: ProgramaGeneralProblemaFactorDetalle[] = [];

  opcSolucionTitulo: ProgramaGeneralProblemaFactorSolucion[] = [];
  opcSolucionSubTitulo: ProgramaGeneralProblemaFactorSolucion[] = [];
  opcSolucionDescripcion: ProgramaGeneralProblemaFactorSolucion[] = [];
  subSolucionesCatalogo: Opcion[] = [];

  formProblema: FormGroup;
  
  mostrarCuadro = false;

  private registrosDisponiblesBase: IProblemaFactorSolucion[] = [];

  registrosDisponibles: IProblemaFactorSolucion[] = [];
  registrosPreSeleccionados: IProblemaFactorSolucion[] = [];
  registrosSeleccionados: IProblemaFactorSolucion[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private alertaService: AlertaService) {
    
    this.formProblema = this.formBuilder.group({
      id: 0,
      idPGeneral: 0,
      problemaId: [null, Validators.required],
      detalleId: [null],
      detalleTituloId: [null],
      solucionTituloId: [null],
      solucionSubTituloId: [null,Validators.required],
      solucionDescripcionId: [null],
      subSolucionesIds: [[] as number[]],
    });

    this.registrosDisponibles = this.registrosDisponiblesBase.map(r => ({ ...r, seleccionado: false }));
  }

  ngOnInit(): void {
    this.obtenerCombos();
    this.formProblema.get('problemaId')?.valueChanges.subscribe(id => {
      this.formProblema.patchValue({ detalleId: null });
      this.limpiarSubniveles(['detalleTituloId', 'solucionTituloId', 'solucionSubTituloId', 'solucionDescripcionId']);
    });

    this.formProblema.get('detalleId')?.valueChanges.subscribe(id => {
      this.cargarTitulos(id);
      this.formProblema.patchValue({ detalleTituloId: null });
      this.limpiarSubniveles(['solucionTituloId', 'solucionSubTituloId', 'solucionDescripcionId']);
    });

    this.formProblema.get('detalleTituloId')?.valueChanges.subscribe(id => {
      this.cargarSolucionTitulos(id);
      this.formProblema.patchValue({ solucionTituloId: null });
      this.limpiarSubniveles(['solucionSubTituloId', 'solucionDescripcionId']);
    });
    //Solucion
    this.formProblema.get('solucionSubTituloId')?.valueChanges.subscribe(id => {
      this.cargarSolucionTitulos(id);
      this.cargarSolucionDetalle(id);
      if (id) {
        this.mostrarCuadroSubtitulo(id);
      }
      this.limpiarSubniveles(['solucionTituloId','solucionDescripcionId']);
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataProblema) {
      this.formProblema.patchValue(this.dataProblema);
    } else if (!this.visible) {
      this.formProblema.reset();
    }
  }

  obtenerCombos() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.ProgramaGeneralProblemaFactorObtenerCombos)
      .subscribe({
        next: (resp: HttpResponse<IProgramaGeneralFactor>) => {
          this.opcProblema = resp.body?.problemaFactor ?? [];
          this.opcDetalle = resp.body?.problemaFactorDetalle ?? [];
          this.opcSolucion = resp.body?.problemaFactorSolucion ?? [];
          if (this.opcSolucion.length > 0) {
            this.opcSolucionSubTitulo = this.opcSolucion.filter(
              s => s.descripcion && s.descripcion.trim().length > 0
            );
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  ObtenerInformacionSubTitulo(id: number): void {
  if (!id || id <= 0) {
    this.alertaService.notificationWarning('Debe seleccionar un subtítulo válido antes de continuar.');
    return;
  }
  this.integraService
    .getJsonResponse(`/ProgramaGeneralProblemaFactorSubSolucion/ObtenerPorIdProgramaGeneralProblemaFactorSolucion/${id}`)
    .subscribe({
      next: (resp: HttpResponse<IProblemaFactorSolucion[]>) => {
        const data = resp.body ?? [];

        if (!Array.isArray(data) || data.length === 0) {
          this.alertaService.notificationInfo('No se encontraron subsoluciones para el subtítulo seleccionado.');
          this.registrosDisponiblesBase = [];
          this.mostrarCuadro = false;
          return;
        }

        // Asignar los registros
        this.registrosDisponiblesBase = data;

        // Mostrar el cuadro y sincronizar
        this.mostrarCuadro = true;
        this.syncDisponiblesConBase();
      },
      error: (error) => {
        const mensaje = this.alertaService.getMessageErrorService(error);
        this.alertaService.notificationWarning(`Error al obtener subsoluciones: ${mensaje}`);
        this.registrosDisponiblesBase = [];
        this.mostrarCuadro = false;
      },
    });
}

  mostrarCuadroSubtitulo(id: number): void {
    if (!id || id <= 0) {
      this.alertaService.notificationWarning('Seleccione un subtítulo antes de mostrar el cuadro.');
      this.mostrarCuadro = false;
      return;
    }

    // Llama al servicio que cargará los datos y mostrará el cuadro si hay información
    this.ObtenerInformacionSubTitulo(id);
  }

  limpiarSubniveles(campos: string[]) {
    campos.forEach(c => this.formProblema.patchValue({ [c]: null }));
  }
  

  cargarTitulos(detalleId: number) {
    this.opcDetalleTitulo = detalleId ? this.opcDetalle.filter(d => d.id === detalleId) : [];
  }


  cargarSolucionTitulos(detalleTituloId: number) {
    this.opcSolucionTitulo = detalleTituloId ? this.opcSolucion.filter(s => s.id === detalleTituloId && s.titulo.length > 0) : [];
  }

  cargarSolucionDetalle(detalleId: number) {
    this.opcSolucionDescripcion = detalleId ? this.opcSolucion.filter(s => s.id === detalleId && s.titulo.length > 0) : [];
  }

  cerrar() {
    this.cerrado.emit();
  }

  guardar(): void {
    if (!this.formProblema.valid) {
      this.formProblema.markAllAsTouched();
      this.alertaService.notificationWarning('Por favor, completa los campos requeridos antes de guardar.');
      return;
    }

    // Obtenemos los valores del formulario
    const formValues = this.formProblema.value;

    // Estructuramos los registros seleccionados (con subregistros, si existen)
    // const seleccionados = this.registrosSeleccionados.map((item: any) => ({
    //   id: item.id ?? null,
    //   solucion: item.solucion ?? null,
    //   subregistros: item.subregistros
    //     ? item.subregistros.filter((s: any) => s.seleccionado).map((s: any) => ({
    //         id: s.id,
    //         nombre: s.nombre,
    //       }))
    //     : [],
    // }));

    // Estructura final a enviar
    // const dataFinal = {
    //   ...formValues,
    //   registrosSeleccionados: seleccionados,
    //   fechaRegistro: new Date().toISOString(),
    // };
    const nuevoFormatoSoluciones =  this.registrosSeleccionados.map(item => ({
      IdProgramaGeneralProblemaFactorSubSolucion: item.id
    }));
    if (nuevoFormatoSoluciones.length === 0) {
      this.alertaService.notificationWarning('Por favor, debe tener asignado al menos un registro de solución.');
      return;
    }

    const dataTransformada = {
      idPGeneral:this.idPGeneral,
      IdProgramaGeneralProblemaFactor: formValues.problemaId,
      IdProgramaGeneralProblemaFactorDetalle: formValues.detalleId,
      AplicaNombreDetalle: formValues.detalleId != null,
      AplicaTituloDetalle: formValues.detalleTituloId != null,
      AplicaPieDePagina: false, 
      AplicaDescripcionSolucion: formValues.solucionDescripcionId != null,
      AplicaTituloSolucion: formValues.solucionTituloId != null,
      AplicaSubTituloSolucion: formValues.solucionSubTituloId != null,
      soluciones: nuevoFormatoSoluciones ,
    };
    this.integraService.postJsonResponse('/ProgramaGeneralProblemaDetalle/Insertar', dataTransformada)
      .subscribe({
        next: resp => this.alertaService.notificationSuccess('Guardado correctamente.'),
        error: err => this.alertaService.notificationError('Error al guardar.')
      });
  }


  // ===== SubSoluciones / selección =====

  private syncDisponiblesConBase() {
    const seleccionadosIds = new Set(this.registrosSeleccionados.map(r => r.id));
    this.registrosDisponibles = this.registrosDisponiblesBase
      .filter(r => !seleccionadosIds.has(r.id))
      .map(r => ({ ...r, seleccionado: false }));
  }

  seleccionar(item: IProblemaFactorSolucion) {
    const yaPreSeleccionado = this.registrosPreSeleccionados.some(x => x.id === item.id);
    const yaSeleccionado = this.registrosSeleccionados.some(x => x.id === item.id);

    if (!yaPreSeleccionado && !yaSeleccionado) {
      const subsoluciones = (item as any).subsoluciones?.map((s: any) => ({
        id: s.id,
        nombre: s.nombre,
        seleccionado: false
      })) ?? [];

      this.registrosPreSeleccionados.push({
        ...item,
        subregistros: subsoluciones,
        expanded: false
      } as any);
    }

    item.seleccionado = false;
  }


  deseleccionar(item: any) {
    const index = this.registrosSeleccionados.findIndex(x => x.id === item.id);
    if (index >= 0) {
      const original: IProblemaFactorSolucion = {
        id: item.id,
        idProgramaGeneralProblemaFactorSolucion: item.idProgramaGeneralProblemaFactorSolucion,
        solucion: item.solucion || item.nombre,
        orden: item.orden ?? 0,
        nivel: item.nivel ?? 0,
      };

      this.registrosDisponibles.push(original);
      this.registrosSeleccionados.splice(index, 1);
    }
  }

  pasarASeleccionados() {
    if (this.registrosPreSeleccionados.length === 0) {
      this.alertaService.notificationInfo('Debe seleccionar al menos un registro.');
      return;
    }

    const nuevos = this.registrosPreSeleccionados.filter(
      pre => !this.registrosSeleccionados.some(sel => sel.id === pre.id)
    );

    this.registrosSeleccionados.push(...nuevos);
    const idsPasados = new Set(nuevos.map(n => n.id));
    this.registrosDisponibles = this.registrosDisponibles.filter(d => !idsPasados.has(d.id));
    this.registrosPreSeleccionados = [];
  }

  revertirADisponibles() {
    if (this.registrosSeleccionados.length === 0) {
      this.alertaService.notificationInfo('No hay registros seleccionados para revertir.');
      return;
    }

    const devueltos = this.registrosSeleccionados.map(sel => ({
      id: sel.id,
      idProgramaGeneralProblemaFactorSolucion: sel.idProgramaGeneralProblemaFactorSolucion,
      solucion: sel.solucion,
      orden: sel.orden ?? 0,
      nivel: sel.nivel ?? 0,
    } as IProblemaFactorSolucion));

    const existentes = new Set(this.registrosDisponibles.map(d => d.id));
    devueltos.forEach(r => {
      if (!existentes.has(r.id)) this.registrosDisponibles.push(r);
    });

    this.registrosSeleccionados = [];
    this.registrosPreSeleccionados = [];
  }

  revertirTodo() {
    this.registrosDisponibles = this.registrosDisponiblesBase.map(r => ({ ...r, seleccionado: false }));
    this.registrosSeleccionados = [];
    this.registrosPreSeleccionados = [];
  }

  toggleExpand(item: SubSolucionSeleccionadoInterface) {
    item.expanded = !item.expanded;
  }
}
