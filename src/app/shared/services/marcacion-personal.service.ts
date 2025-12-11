import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from './integra.service';
import { AlertaService } from './alerta.service';
import { UserService } from './user.service';
import { constApiGlobal } from '@environments/constApi';
import {
  IInsertarMarcacionResponse,
  IAreaPersonalResponse,
  ITiempoInactividadResponse,
  TipoMarcacion,
  IEstadoBotonesMarcacion,
} from '@shared/models/interfaces/imarcacion-personal';
import Swal from 'sweetalert2';

/**
 * @service Servicio de Marcación Personal
 * @description Gestiona la marcación de asistencia del personal (ingreso, salidas de almuerzo y salida final)
 * @author BSG Institute
 * @version 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class MarcacionPersonalService {
  private _mostrarBotonesMarcacion$ = new BehaviorSubject<boolean>(false);
  private _estadoBotones$ = new BehaviorSubject<IEstadoBotonesMarcacion>({
    ingreso: false,
    salidaAlmuerzo: false,
    llegadaAlmuerzo: false,
    salida: false,
  });
  private _horaActual$ = new BehaviorSubject<string>('');
  private _fechaActual$ = new BehaviorSubject<string>('');

  private intervaloClock: Subscription | null = null;
  private intervaloInactividad: Subscription | null = null;
  private intervaloDialog: any = null;

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private userService: UserService
  ) {}

  get mostrarBotonesMarcacion$(): Observable<boolean> {
    return this._mostrarBotonesMarcacion$.asObservable();
  }

  get estadoBotones$(): Observable<IEstadoBotonesMarcacion> {
    return this._estadoBotones$.asObservable();
  }

  get horaActual$(): Observable<string> {
    return this._horaActual$.asObservable();
  }

  get fechaActual$(): Observable<string> {
    return this._fechaActual$.asObservable();
  }

  /**
   * Inicializa el servicio de marcación
   * @param usuario Usuario del personal
   */
  inicializarMarcacion(usuario: string): void {
    this.verificarAreaPersonal(usuario);
  }

  /**
   * Verifica el área del personal para determinar si debe mostrar botones de marcación
   * Usa el UserService para obtener el área del personal desde dataPersonal$
   * @param usuario Usuario del personal
   */
  private verificarAreaPersonal(usuario: string): void {
    this.userService.dataPersonal$.subscribe({
      next: (response) => {
        if (response != null && response.datosPersonal) {
          const areaAbrev = response.datosPersonal.areaAbrev;
          if (areaAbrev && areaAbrev !== 'OP' && areaAbrev !== 'VE') {
            this._mostrarBotonesMarcacion$.next(true);
            this.iniciarMonitoreoInactividad(usuario);
          } else {
            this._mostrarBotonesMarcacion$.next(false);
          }
        } else {
          this._mostrarBotonesMarcacion$.next(false);
        }
      },
      error: (error) => {
        console.error('Error al obtener datos del personal:', error);
        this._mostrarBotonesMarcacion$.next(false);
      },
    });
  }

  /**
   * Inserta una marcación del personal con validación de DNI
   * @param usuario Usuario del personal
   * @param tipoBoton Tipo de marcación (1: Ingreso, 2: Salida Almuerzo, 3: Llegada Almuerzo, 4: Salida)
   */
  insertarMarcacion(usuario: string, tipoBoton: TipoMarcacion): void {
    const tipoTexto = this.obtenerTextoTipoMarcacion(tipoBoton);

    // Mostrar modal para solicitar código de documento
    this.solicitarCodigoDocumento(usuario, tipoBoton, tipoTexto);
  }

  /**
   * Muestra modal para solicitar código del documento de identidad
   * @param usuario Usuario del personal
   * @param tipoBoton Tipo de marcación
   * @param tipoTexto Texto descriptivo del tipo
   */
  private solicitarCodigoDocumento(
    usuario: string,
    tipoBoton: TipoMarcacion,
    tipoTexto: string
  ): void {
    Swal.fire({
      title: 'Asistencia',
      html: `
        <p style="margin-bottom: 20px;">Para confirmar su marcación ingrese el <b>Código</b> de su <b>documento de identidad</b> y click en <b>'Confirmar'</b></p>
        <div style="text-align: left; margin: 0 auto; max-width: 400px;">
          <label style="font-weight: bold; margin-bottom: 5px; display: block;">CÓDIGO DE DOCUMENTO</label>
          <input type="text" id="inputDNI" class="swal2-input" placeholder="Ingrese código" style="margin: 0; text-transform: uppercase;">
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
      allowOutsideClick: false,
      preConfirm: () => {
        const input = document.getElementById('inputDNI') as HTMLInputElement;
        const codigo = input?.value?.trim().toUpperCase();
        if (!codigo) {
          Swal.showValidationMessage('Debe ingresar el código del documento');
          return false;
        }
        return codigo;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.validarYRegistrarMarcacion(usuario, tipoBoton, result.value, tipoTexto);
      }
    });

    // Auto-focus en el input cuando se abre el modal
    setTimeout(() => {
      const input = document.getElementById('inputDNI') as HTMLInputElement;
      if (input) {
        input.focus();
        input.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.toUpperCase();
        });
      }
    }, 100);
  }

  /**
   * Valida el código del documento y registra la marcación
   * @param usuario Usuario del personal
   * @param tipoBoton Tipo de marcación
   * @param codigoDocumento Código del documento ingresado
   * @param tipoTexto Texto descriptivo del tipo
   */
  private validarYRegistrarMarcacion(
    usuario: string,
    tipoBoton: TipoMarcacion,
    codigoDocumento: string,
    tipoTexto: string
  ): void {
    // Obtener el documento del usuario desde UserService
    this.userService.dataPersonal$.subscribe({
      next: (response) => {
        if (response != null && response.datosPersonal) {
          const documentoPersonal = response.datosPersonal.documento?.toString().trim();

          if (codigoDocumento !== documentoPersonal) {
            this.mostrarModalError('No son los datos correctos, intentar otra vez.');
            return;
          }
          this.registrarMarcacion(usuario, tipoBoton, tipoTexto);
        } else {
          this.alertaService.notificationError('No se pudo obtener los datos del personal');
        }
      },
      error: (error) => {
        console.error('Error al obtener datos del personal:', error);
        this.alertaService.notificationError('Error al validar documento');
      },
    });
  }

  /**
   * Registra la marcación en el servidor
   * @param usuario Usuario del personal
   * @param tipoBoton Tipo de marcación
   * @param tipoTexto Texto descriptivo del tipo
   */
  private registrarMarcacion(
    usuario: string,
    tipoBoton: TipoMarcacion,
    tipoTexto: string
  ): void {
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.RegistroMarcacionInsertarMarcacionPersonal}/${usuario}/${tipoBoton}`
      )
      .subscribe({
        next: (resp: HttpResponse<IInsertarMarcacionResponse>) => {
          const data = resp.body;

          if (data?.esInsertado && !data?.esMarcado) {
            this.mostrarModalExitoso(tipoTexto);
          }
          else if (!data?.esInsertado && data?.esMarcado) {
            this.mostrarModalYaMarco();
          }
          else if (data?.cumpleTiempoMinimo === false && tipoBoton === TipoMarcacion.LlegadaAlmuerzo) {
            this.mostrarModalTiempoMinimo();
          }
          else {
            this.mostrarModalError(`Hubo un problema en la marcación de ${tipoTexto}`);
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.mostrarModalError(`Error al registrar marcación: ${mensaje}`);
        },
      });
  }

  /**
   * Muestra modal de error
   * @param mensaje Mensaje de error
   */
  private mostrarModalError(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#d33',
    });
  }

  /**
   * Muestra modal de error por tiempo mínimo de refrigerio
   */
  private mostrarModalTiempoMinimo(): void {
    Swal.fire({
      title: 'Error',
      html: 'El tiempo mínimo dedicado al refrigerio no podrá ser inferior a <b>45 minutos</b>, probar nuevamente cuando haya transcurrido ese tiempo o más, gracias.',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#d33',
    });
  }

  /**
   * Muestra modal indicando que ya marcó
   */
  private mostrarModalYaMarco(): void {
    Swal.fire({
      title: 'Alerta',
      text: 'Usted ya marcó esta asistencia.',
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#0d6efd',
    });
  }

  /**
   * Muestra modal de marcación exitosa
   * @param tipoTexto Tipo de marcación realizada
   */
  private mostrarModalExitoso(tipoTexto: string): void {
    Swal.fire({
      title: 'Exitoso',
      html: `
        <h6>Gracias por registrar su asistencia de <b>${tipoTexto}</b>.</h6>
        <br>
        <p style="font-size: 12px; text-align: left;">
          <b>Nota:</b> Dentro del marco del reglamento interno se considera falta grave al incumplimiento de las obligaciones.<br>
          <b>Capítulo VI:</b> Normas de control de asistencia al trabajo.<br>
          <b>Artículo 23°</b> "El trabajador deberá proceder personalmente a registrar su ingreso y su salida de la institución..."
        </p>
      `,
      icon: 'success',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#5cb85c',
    });
  }

  /**
   * Obtiene el texto descriptivo del tipo de marcación
   * @param tipo Tipo de marcación
   * @returns Texto descriptivo
   */
  private obtenerTextoTipoMarcacion(tipo: TipoMarcacion): string {
    switch (tipo) {
      case TipoMarcacion.Ingreso:
        return 'Entrada';
      case TipoMarcacion.SalidaAlmuerzo:
        return 'Salida almuerzo';
      case TipoMarcacion.LlegadaAlmuerzo:
        return 'Llegada almuerzo';
      case TipoMarcacion.Salida:
        return 'Salida';
      default:
        return 'Desconocido';
    }
  }

  /**
   * Muestra una alerta de marcación por inactividad
   * @param usuario Usuario del personal
   * @param tipoBoton Tipo de botón de marcación
   */
  private mostrarAlertaMarcacion(usuario: string, tipoBoton: TipoMarcacion): void {
    let mensaje = '';

    switch (tipoBoton) {
      case TipoMarcacion.Ingreso:
        mensaje = 'Ud. no tiene marcación de ingreso, ¿desea marcar su hora de ingreso?';
        break;
      case TipoMarcacion.SalidaAlmuerzo:
        mensaje = 'Ud. está inactivo por más de 15 minutos, se marcará como hora de salida de almuerzo';
        break;
      case TipoMarcacion.Salida:
        mensaje = 'Ud. está inactivo por más de 15 minutos, se marcará como hora de salida de la empresa';
        break;
    }

    let contador = 1;

    if (this.intervaloDialog) {
      clearInterval(this.intervaloDialog);
    }

    this.intervaloDialog = setInterval(() => {
      if (contador === 1) {
        Swal.fire({
          title: 'Registro marcación',
          text: mensaje,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'SI',
          cancelButtonText: 'NO',
          allowOutsideClick: false,
        }).then((result) => {
          clearInterval(this.intervaloDialog);
          if (result.isConfirmed) {
            this.insertarMarcacion(usuario, tipoBoton);
          }
        });
      } else if (contador === 60) {
        // Después de 60 segundos, marcar automáticamente
        clearInterval(this.intervaloDialog);
        this.insertarMarcacion(usuario, tipoBoton);
        Swal.close();
      }
      contador++;
    }, 1000);
  }

  /**
   * Obtiene el tiempo de inactividad del usuario
   * @param usuario Usuario del personal
   */
  private obtenerTiempoInactivo(usuario: string): void {
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.RegistroMarcacionObtenerTiempoInactividadPersonal}/${usuario}`
      )
      .subscribe({
        next: (resp: HttpResponse<ITiempoInactividadResponse>) => {
          const data = resp.body;
          if (data?.marcacion != null) {
            // Si el tiempo de inactividad es >= 15 minutos y no hay salida de almuerzo
            if (data.tiempoInactivo >= 15 && data.marcacion.m2 == null) {
              this.mostrarAlertaMarcacion(usuario, TipoMarcacion.SalidaAlmuerzo);
            }
            // Si el tiempo de inactividad es >= 15 minutos y ya regresó del almuerzo
            if (data.tiempoInactivo >= 15 && data.marcacion.m3 != null) {
              this.mostrarAlertaMarcacion(usuario, TipoMarcacion.Salida);
            }
          }
        },
        error: (error) => {
          console.error('Error al obtener tiempo de inactividad:', error);
        },
      });
  }

  /**
   * Inicia el monitoreo de inactividad
   * @param usuario Usuario del personal
   */
  private iniciarMonitoreoInactividad(usuario: string): void {
    this.intervaloInactividad = interval(300000).subscribe(() => {
      this.obtenerTiempoInactivo(usuario);
    });
  }


  private iniciarReloj(): void {
    this.actualizarReloj();
    this.intervaloClock = interval(500).subscribe(() => {
      this.actualizarReloj();
    });
  }


  private actualizarReloj(): void {
    const today = new Date();
    let hr: number | string = today.getHours();
    let min: number | string = today.getMinutes();
    let sec: number | string = today.getSeconds();
    const ap = hr < 12 ? 'AM' : 'PM';

    hr = hr === 0 ? 12 : hr;
    hr = hr > 12 ? hr - 12 : hr;

    hr = this.checkTime(hr);
    min = this.checkTime(min);
    sec = this.checkTime(sec);

    this._horaActual$.next(`${hr}:${min}:${sec} ${ap}`);

    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const curWeekDay = days[today.getDay()];
    const curDay = today.getDate();
    const curMonth = months[today.getMonth()];
    const curYear = today.getFullYear();

    this._fechaActual$.next(`${curWeekDay}, ${curDay} ${curMonth} ${curYear}`);
  }

  /**
   * Agrega un cero adelante si el número es menor a 10
   * @param i Número a formatear
   * @returns Número formateado
   */
  private checkTime(i: number): string {
    return i < 10 ? '0' + i : i.toString();
  }


  detenerIntervalos(): void {
    if (this.intervaloClock) {
      this.intervaloClock.unsubscribe();
      this.intervaloClock = null;
    }
    if (this.intervaloInactividad) {
      this.intervaloInactividad.unsubscribe();
      this.intervaloInactividad = null;
    }
    if (this.intervaloDialog) {
      clearInterval(this.intervaloDialog);
      this.intervaloDialog = null;
    }
  }

  ngOnDestroy(): void {
    this.detenerIntervalos();
  }
}
