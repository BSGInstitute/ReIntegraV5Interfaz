import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

interface NivelEsquema {
  esquema: string;
  idEsquema: number;
  idNivel: number;
  idRemarketingEmbudoEsquema: number;
  nivel: string;
}

interface Esquema {
  idEsquema: number;
  nombre: string;
  niveles: NivelEsquema[];
  seleccionado: boolean;
  nivelesSeleccionados: boolean[];
}

@Component({
  selector: 'app-embudo',
  templateUrl: './embudo.component.html',
  styleUrls: ['./embudo.component.scss']
})
export class EmbudoComponent implements OnInit, OnChanges {

  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    if (this.datosActualizar != undefined) {
      // Si ya cargamos los esquemas, actualizar con los datos
      if (this.esquemasCargados) {
        this.cargarDatosActualizar();
      } else {
        // Si no, guardar los datos para cuando se carguen
        this.datosPendientes = this.datosActualizar;
      }
      this.considerarEmbudo = this.datosActualizar?.considerarEmbudo || false;
    }
  }

  ngOnInit(): void {
    this.cargarEsquemas();
  }

  // Variables principales
  considerarEmbudo = false;
  nivelEmbudoEsquema1Envio: any;
  nivelEmbudoEsquema2Envio: any;
  esquemas: Esquema[] = [];
  cargando = false;
  esquemasCargados = false;
  datosPendientes: any = null;

  // Modelo para emitir al componente padre
  modeloEmbudo = {
    considerarEmbudo: false,
    nivelesEmbudoEsquema1Envio: [] as number[],
    nivelesEmbudoEsquema2Envio: [] as number[]
  };

  // Cargar esquemas desde el API
  cargarEsquemas(): void {
    this.cargando = true;
    this.integraService.getJsonResponse(constApiMarketing.RemarketingEmbudoNivelEsquema)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          if (response.body && response.body.length > 0) {
            this.procesarEsquemas(response.body);
            this.esquemasCargados = true;

            // Si hay datos pendientes, cargarlos ahora
            if (this.datosPendientes) {
              this.cargarDatosActualizar();
              this.datosPendientes = null;
            }
          } else {
            this.alertaService.notificationWarning('No se encontraron esquemas disponibles');
          }
        },
        error: (e: any) => {
          console.error('Error cargando esquemas:', e);
          this.alertaService.notificationWarning(`Surgió un error al cargar los esquemas: ${e.error?.title || e.message}`);
        }
      });
  }

  // Procesar la respuesta del API para organizar los esquemas
  procesarEsquemas(datos: any[]): void {
    // Agrupar por esquema
    const esquemasMap = new Map<number, Esquema>();

    datos.forEach((item: any) => {
      const idEsquema = item.idEsquema;

      if (!esquemasMap.has(idEsquema)) {
        esquemasMap.set(idEsquema, {
          idEsquema: idEsquema,
          nombre: item.esquema,
          niveles: [],
          seleccionado: false,
          nivelesSeleccionados: []
        });
      }

      const esquema = esquemasMap.get(idEsquema)!;
      esquema.niveles.push({
        esquema: item.esquema,
        idEsquema: item.idEsquema,
        idNivel: item.idNivel,
        idRemarketingEmbudoEsquema: item.idRemarketingEmbudoEsquema,
        nivel: item.nivel
      });
    });

    // Convertir a array y ordenar
    this.esquemas = Array.from(esquemasMap.values());

    // Ordenar esquemas por id
    this.esquemas.sort((a, b) => a.idEsquema - b.idEsquema);

    // Ordenar niveles dentro de cada esquema
    this.esquemas.forEach(esquema => {
      esquema.niveles.sort((a, b) => a.idNivel - b.idNivel);
      // Inicializar arrays de selección
      esquema.nivelesSeleccionados = new Array(esquema.niveles.length).fill(false);
    });

    this.cdRef.detectChanges();
  }

  // Cargar datos al actualizar
  cargarDatosActualizar(): void {
    if (!this.datosActualizar) return;

    this.considerarEmbudo = this.datosActualizar?.considerarEmbudo || false;

    // Resetear todos los esquemas primero
    this.esquemas.forEach(esquema => {
      esquema.seleccionado = false;
      esquema.nivelesSeleccionados = esquema.nivelesSeleccionados.map(() => false);
    });

    // Cargar datos específicos
    if (this.datosActualizar?.esquemas && this.esquemas.length > 0) {
      this.datosActualizar.esquemas.forEach((esquemaData: any) => {
        const esquema = this.esquemas.find(e => e.idEsquema === esquemaData.idEsquema);
        if (esquema) {
          esquema.seleccionado = true;

          // Marcar niveles seleccionados
          if (esquemaData.nivelesSeleccionados) {
            esquemaData.nivelesSeleccionados.forEach((idNivel: number) => {
              const nivelIndex = esquema.niveles.findIndex(n => n.idNivel === idNivel);
              if (nivelIndex !== -1) {
                esquema.nivelesSeleccionados[nivelIndex] = true;
              }
            });
          }
        }
      });
    }

    // Cargar listaNivelEmbudoEsquema1 si existe - versión similar a obtenerAreaCapacitacion
    if (this.datosActualizar?.listaNivelEmbudoEsquema1 && this.datosActualizar.listaNivelEmbudoEsquema1.length > 0) {
      this.cargarListaNivelesEsquema(1, this.datosActualizar.listaNivelEmbudoEsquema1);
    }

    // Cargar listaNivelEmbudoEsquema2 si existe - versión similar a obtenerAreaCapacitacion
    if (this.datosActualizar?.listaNivelEmbudoEsquema2 && this.datosActualizar.listaNivelEmbudoEsquema2.length > 0) {
      this.cargarListaNivelesEsquema(2, this.datosActualizar.listaNivelEmbudoEsquema2);
    }

    // También manejar formato antiguo por compatibilidad
    if (this.datosActualizar?.nivelesEmbudoEsquema1Envio || this.datosActualizar?.nivelesEmbudoEsquema2Envio) {
      this.cargarFormatoAntiguo();
    }

    // Verificar y marcar esquemas si algún nivel está seleccionado
    this.verificarEsquemasPorNiveles();

    this.actualizarModelo();
  }

  // Cargar lista de niveles para un esquema específico - similar a obtenerAreaCapacitacion
  cargarListaNivelesEsquema(idEsquema: number, listaNiveles: any[]): void {
    const esquema = this.esquemas.find(e => e.idEsquema === idEsquema);
    if (!esquema || !listaNiveles) return;

    // Versión similar al ejemplo que me diste
    const nivelesSeleccionadosTemp: boolean[] = new Array(esquema.niveles.length).fill(false);
    let tieneSelecciones = false;

    // Primero, marcar todos los checkboxes basado en listaNiveles
    this.esquemas.forEach((esquemaItem) => {
      if (esquemaItem.idEsquema === idEsquema) {
        // Para cada nivel en el esquema
        esquemaItem.niveles.forEach((nivel, index) => {
          // Verificar si este nivel está en listaNiveles
          const encontrado = listaNiveles.find((item: any) =>
            item.valor === nivel.idNivel ||
            item.Valor === nivel.idNivel ||
            item.idNivel === nivel.idNivel
          );

          if (encontrado) {
            esquemaItem.nivelesSeleccionados[index] = true;
            nivelesSeleccionadosTemp[index] = true;
            tieneSelecciones = true;
          }
        });
      }
    });

    // Si hay selecciones, marcar el esquema
    if (tieneSelecciones) {
      esquema.seleccionado = true;
    }
  }

  // Versión alternativa más simple, parecida a tu ejemplo
  cargarListaNivelesEsquemaAlternativo(idEsquema: number, listaNiveles: any[]): void {
    const esquema = this.esquemas.find(e => e.idEsquema === idEsquema);
    if (!esquema || !listaNiveles) return;

    // Similar al ejemplo que me mostraste de obtenerAreaCapacitacion
    const nivelesIds: number[] = [];

    // Para cada nivel en listaNiveles
    listaNiveles.forEach((nivelData: any) => {
      // Buscar en todos los niveles del esquema
      esquema.niveles.forEach((nivel, index) => {
        if (nivel.idNivel === nivelData.valor ||
            nivel.idNivel === nivelData.Valor ||
            nivel.idNivel === nivelData.idNivel) {
          esquema.nivelesSeleccionados[index] = true;
          nivelesIds.push(nivel.idNivel);
        }
      });
    });

    // Si encontramos niveles, marcar el esquema
    if (nivelesIds.length > 0) {
      esquema.seleccionado = true;
    }
  }

  // Cargar formato antiguo para compatibilidad
  cargarFormatoAntiguo(): void {
    // Esquema 1 (ID 1)
    const esquema1 = this.esquemas.find(e => e.idEsquema === 1);
    if (esquema1 && this.datosActualizar?.nivelesEmbudoEsquema1Envio) {
      esquema1.seleccionado = this.datosActualizar.seleccionarEsquema1 || false;

      // Mapear índices a idNivel
      this.datosActualizar.nivelesEmbudoEsquema1Envio.forEach((index: number) => {
        if (esquema1.niveles[index]) {
          esquema1.nivelesSeleccionados[index] = true;
        }
      });
    }

    // Esquema 2 (ID 2)
    const esquema2 = this.esquemas.find(e => e.idEsquema === 2);
    if (esquema2 && this.datosActualizar?.nivelesEmbudoEsquema2Envio) {
      esquema2.seleccionado = this.datosActualizar.seleccionarEsquema2 || false;

      // Mapear índices a idNivel
      this.datosActualizar.nivelesEmbudoEsquema2Envio.forEach((index: number) => {
        if (esquema2.niveles[index]) {
          esquema2.nivelesSeleccionados[index] = true;
        }
      });
    }
  }

  // Verificar y marcar esquemas basado en niveles seleccionados
  verificarEsquemasPorNiveles(): void {
    this.esquemas.forEach(esquema => {
      // Si algún nivel está seleccionado, marcar el esquema
      if (esquema.nivelesSeleccionados.some(seleccionado => seleccionado)) {
        esquema.seleccionado = true;
      }
      // Si ningún nivel está seleccionado, desmarcar el esquema
      else if (!esquema.nivelesSeleccionados.some(seleccionado => seleccionado)) {
        esquema.seleccionado = false;
      }
    });
  }

  // Manejar cambio del checkbox principal
  setConsiderarEmbudo(estado: boolean): void {
    // Uso de setTimeout para evitar problemas de detección de cambios
    setTimeout(() => {
      this.considerarEmbudo = estado;

      if (!estado) {
        // Si se desactiva, limpiar todos los esquemas
        this.esquemas.forEach(esquema => {
          esquema.seleccionado = false;
          esquema.nivelesSeleccionados = esquema.nivelesSeleccionados.map(() => false);
        });
      }

      this.actualizarModelo();
      this.cdRef.detectChanges();
    });
  }

  // Toggle para un esquema
  toggleEsquema(esquemaIndex: number, estado: boolean): void {
    setTimeout(() => {
      this.esquemas[esquemaIndex].seleccionado = estado;

      if (!estado) {
        // Si se desactiva, limpiar niveles del esquema
        this.esquemas[esquemaIndex].nivelesSeleccionados =
          this.esquemas[esquemaIndex].nivelesSeleccionados.map(() => false);
      }

      this.actualizarModelo();
      this.cdRef.detectChanges();
    });
  }

  // Actualizar niveles de un esquema
  actualizarNivelesEsquema(esquemaIndex: number, nivelIndex: number, estado: boolean): void {
    setTimeout(() => {
      this.esquemas[esquemaIndex].nivelesSeleccionados[nivelIndex] = estado;

      // Verificar si algún nivel está seleccionado
      const algunNivelSeleccionado = this.esquemas[esquemaIndex].nivelesSeleccionados.some(sel => sel);

      // Si se selecciona un nivel, marcar automáticamente el esquema
      if (estado && !this.esquemas[esquemaIndex].seleccionado) {
        this.esquemas[esquemaIndex].seleccionado = true;
      }
      // Si se deseleccionan todos los niveles, desmarcar el esquema
      else if (!algunNivelSeleccionado && this.esquemas[esquemaIndex].seleccionado) {
        this.esquemas[esquemaIndex].seleccionado = false;
      }

      this.actualizarModelo();
      this.cdRef.detectChanges();
    });
  }

  // Actualizar el modelo y emitir cambios
  actualizarModelo(): void {
    const esquemasParaEnvio = this.esquemas
      .filter(esquema => esquema.seleccionado)
      .map(esquema => {
      const nivelesSeleccionadosIds: number[] = [];

      esquema.nivelesSeleccionados.forEach((seleccionado, index) => {
        if (seleccionado) {
        nivelesSeleccionadosIds.push(esquema.niveles[index].idNivel);
        }
      });

      return {
        idEsquema: esquema.idEsquema,
        nombre: esquema.nombre,
        nivelesSeleccionados: nivelesSeleccionadosIds.sort((a, b) => a - b)
      };
      });

    // Guardar los ids seleccionados para esquema 1 y 2
    this.nivelEmbudoEsquema1Envio = [];
    this.nivelEmbudoEsquema2Envio = [];

    const esquema1 = this.esquemas.find(e => e.idEsquema === 1);
    if (esquema1) {
      esquema1.nivelesSeleccionados.forEach((sel, idx) => {
      if (sel) {
        this.nivelEmbudoEsquema1Envio.push({ Valor: esquema1.niveles[idx].idNivel });
      }
      });
    }

    const esquema2 = this.esquemas.find(e => e.idEsquema === 2);
    if (esquema2) {
      esquema2.nivelesSeleccionados.forEach((sel, idx) => {
      if (sel) {
        this.nivelEmbudoEsquema2Envio.push({ Valor: esquema2.niveles[idx].idNivel });
      }
      });
    }

    this.modeloEmbudo = {
      considerarEmbudo: this.considerarEmbudo,
      nivelesEmbudoEsquema1Envio: this.nivelEmbudoEsquema1Envio,
      nivelesEmbudoEsquema2Envio: this.nivelEmbudoEsquema2Envio
    };
  }

  // Método para obtener el estado actual
  obtenerEstadoEmbudo(): any {
    return { ...this.modeloEmbudo };
  }

  // Método para resetear el formulario
  resetearEmbudo(): void {
    this.considerarEmbudo = false;
    this.esquemas.forEach(esquema => {
      esquema.seleccionado = false;
      esquema.nivelesSeleccionados = esquema.nivelesSeleccionados.map(() => false);
    });
    this.actualizarModelo();
  }

  // Helper para dividir niveles en columnas
  dividirEnColumnas(niveles: NivelEsquema[], columnas: number = 2): NivelEsquema[][] {
    const resultado: NivelEsquema[][] = [];
    const itemsPorColumna = Math.ceil(niveles.length / columnas);

    for (let i = 0; i < columnas; i++) {
      const inicio = i * itemsPorColumna;
      const fin = inicio + itemsPorColumna;
      resultado.push(niveles.slice(inicio, fin));
    }

    return resultado;
  }

  // Verificar si un esquema tiene muchos niveles
  tieneMuchosNiveles(esquema: Esquema): boolean {
    return esquema.niveles.length > 5;
  }

  // Helper para obtener el índice de un nivel
  getNivelIndex(esquema: Esquema, nivel: NivelEsquema): number {
    return esquema.niveles.findIndex(n => n.idNivel === nivel.idNivel);
  }
}
