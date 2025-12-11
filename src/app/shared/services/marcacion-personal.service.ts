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
   * Inserta una marcación del personal con solicitud de DNI
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
      title: '<strong>Confirmar Asistencia</strong>',
      html: `
        <div style="text-align: center; padding: 10px 20px;">
          <p style="font-size: 15px; color: #555; margin-bottom: 25px; line-height: 1.6;">
            Para confirmar su marcación de <strong>${tipoTexto}</strong>,<br>
            ingrese el código de su documento de identidad
          </p>
          <div style="max-width: 350px; margin: 0 auto;">
            <label style="
              font-weight: 600;
              font-size: 12px;
              color: #333;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              display: block;
              text-align: left;
              margin-bottom: 8px;
            ">Código de Documento</label>
            <input
              type="text"
              id="inputDNI"
              class="swal2-input"
              placeholder="Ej: 12345678"
              autocomplete="off"
              style="
                margin: 0;
                width: 100%;
                padding: 12px 16px;
                font-size: 16px;
                text-align: center;
                text-transform: uppercase;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                transition: border-color 0.3s ease;
              "
              onfocus="this.style.borderColor='#5cb85c'"
              onblur="this.style.borderColor='#e0e0e0'"
            >
          </div>
        </div>
      `,
      icon: 'question',
      iconColor: '#5cb85c',
      showCancelButton: true,
      confirmButtonText: '<i class="k-icon k-i-check"></i> Confirmar',
      cancelButtonText: '<i class="k-icon k-i-cancel"></i> Cancelar',
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#6c757d',
      buttonsStyling: true,
      customClass: {
        popup: 'swal-marcacion-popup',
        title: 'swal-marcacion-title',
        confirmButton: 'swal-marcacion-btn-confirm',
        cancelButton: 'swal-marcacion-btn-cancel'
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        const input = document.getElementById('inputDNI') as HTMLInputElement;
        const codigo = input?.value?.trim().toUpperCase();
        if (!codigo) {
          Swal.showValidationMessage('⚠️ Por favor, ingrese el código del documento');
          return false;
        }
        if (codigo.length < 4) {
          Swal.showValidationMessage('⚠️ El código debe tener al menos 4 caracteres');
          return false;
        }
        return codigo;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.registrarMarcacion(usuario, tipoBoton, result.value, tipoTexto);
      }
    });

    setTimeout(() => {
      const input = document.getElementById('inputDNI') as HTMLInputElement;
      if (input) {
        input.focus();
        input.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.toUpperCase();
        });
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            Swal.clickConfirm();
          }
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
    this.userService.dataPersonal$.subscribe({
      next: (response) => {

        if (response != null && response.datosPersonal) {
          // Intentar obtener el documento desde diferentes propiedades posibles
          const documentoPersonal = (
            response.datosPersonal.documento ||
            response.datosPersonal.nroDocumento ||
            response.datosPersonal.numeroDocumento ||
            response.datosPersonal.dni ||
            response.datosPersonal.numeroDocumentoIdentidad ||
            response.datosPersonal.docIdentidad
          )?.toString().trim().toUpperCase();

          const codigoIngresado = codigoDocumento.trim().toUpperCase();

          if (!documentoPersonal) {
            this.alertaService.notificationError(
              'No se pudo obtener el documento del personal. Contacte al administrador.'
            );
            return;
          }

          if (codigoIngresado !== documentoPersonal) {
            console.warn('⚠️ [WARN] Los documentos no coinciden');
            console.warn('Expected:', documentoPersonal);
            console.warn('Got:', codigoIngresado);
            this.mostrarModalError('No son los datos correctos, intentar otra vez.');
            return;
          }

          this.registrarMarcacion(usuario, tipoBoton, codigoIngresado, tipoTexto);
        } else {
          this.alertaService.notificationError('No se pudo obtener los datos del personal');
        }
      },
      error: (error) => {
        this.alertaService.notificationError('Error al validar documento');
      },
    });
  }

  /**
   * Registra la marcación en el servidor
   * @param usuario Usuario del personal
   * @param tipoBoton Tipo de marcación
   * @param documento Documento del personal
   * @param tipoTexto Texto descriptivo del tipo
   */
  private registrarMarcacion(
    usuario: string,
    tipoBoton: TipoMarcacion,
    documento: string,
    tipoTexto: string
  ): void {
    // Formato del endpoint: /api/RegistroMarcacion/InsertarMarcacionPersonal/{usuario}/{tipoBoton}/{documento}
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.RegistroMarcacionInsertarMarcacionPersonal}/${usuario}/${tipoBoton}/${documento}`
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
      title: '<strong>Error</strong>',
      html: `
        <div style="text-align: center; padding: 15px 20px;">
          <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 0;">
            ${mensaje}
          </p>
        </div>
      `,
      icon: 'error',
      iconColor: '#dc3545',
      confirmButtonText: '<i class="k-icon k-i-close"></i> Cerrar',
      confirmButtonColor: '#dc3545',
      customClass: {
        popup: 'swal-marcacion-popup',
        title: 'swal-marcacion-title',
        confirmButton: 'swal-marcacion-btn-confirm'
      },
      buttonsStyling: true,
    });
  }

  /**
   * Muestra modal de error por tiempo mínimo de refrigerio (1 hora)
   */
  private mostrarModalTiempoMinimo(): void {
    Swal.fire({
      title: '<strong>Tiempo Mínimo de Refrigerio</strong>',
      html: `
        <div style="text-align: center; padding: 15px 20px;">
          <div style="
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
          ">
            <p style="font-size: 16px; color: #856404; margin: 0; line-height: 1.6;">
              ⏰ El tiempo mínimo dedicado al refrigerio no puede ser inferior a <strong>1 hora</strong>
            </p>
          </div>
          <p style="font-size: 14px; color: #666; margin: 0; line-height: 1.5;">
            Por favor, intente nuevamente cuando haya transcurrido el tiempo completo
          </p>
        </div>
      `,
      icon: 'warning',
      iconColor: '#ffc107',
      confirmButtonText: '<i class="k-icon k-i-check"></i> Entendido',
      confirmButtonColor: '#ffc107',
      customClass: {
        popup: 'swal-marcacion-popup',
        title: 'swal-marcacion-title',
        confirmButton: 'swal-marcacion-btn-confirm'
      },
      buttonsStyling: true,
    });
  }

  /**
   * Muestra modal indicando que ya marcó
   */
  private mostrarModalYaMarco(): void {
    Swal.fire({
      title: '<strong>Marcación Registrada</strong>',
      html: `
        <div style="text-align: center; padding: 15px 20px;">
          <div style="
            background: #d1ecf1;
            border: 2px solid #17a2b8;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 10px;
          ">
            <p style="font-size: 16px; color: #0c5460; margin: 0; line-height: 1.6;">
              ✓ Usted ya registró esta marcación de asistencia anteriormente
            </p>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 10px; margin-bottom: 0;">
            No es necesario volver a marcar
          </p>
        </div>
      `,
      icon: 'info',
      iconColor: '#17a2b8',
      confirmButtonText: '<i class="k-icon k-i-check"></i> Entendido',
      confirmButtonColor: '#17a2b8',
      customClass: {
        popup: 'swal-marcacion-popup',
        title: 'swal-marcacion-title',
        confirmButton: 'swal-marcacion-btn-confirm'
      },
      buttonsStyling: true,
    });
  }

  /**
   * Muestra modal de marcación exitosa
   * @param tipoTexto Tipo de marcación realizada
   */
  private mostrarModalExitoso(tipoTexto: string): void {
    Swal.fire({
      title: '<strong>¡Marcación Exitosa!</strong>',
      html: `
        <div style="text-align: center; padding: 15px 20px;">
          <div style="
            background: #d4edda;
            border: 2px solid #28a745;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          ">
            <p style="font-size: 16px; color: #155724; margin: 0; line-height: 1.6;">
              ✓ Su marcación de <strong>${tipoTexto}</strong> se ha registrado correctamente
            </p>
          </div>

          <div style="
            background: #f8f9fa;
            border-left: 4px solid #6c757d;
            padding: 15px;
            margin-top: 20px;
            text-align: left;
            border-radius: 4px;
          ">
            <p style="font-size: 12px; color: #495057; margin: 0 0 10px 0; line-height: 1.5;">
              <strong>Nota Importante:</strong>
            </p>
            <p style="font-size: 11px; color: #6c757d; margin: 0 0 8px 0; line-height: 1.5;">
              Dentro del marco del reglamento interno se considera falta grave el incumplimiento de las obligaciones.
            </p>
            <p style="font-size: 11px; color: #6c757d; margin: 0; line-height: 1.5;">
              <strong>Capítulo VI - Artículo 23°:</strong> "El trabajador deberá proceder personalmente a registrar su ingreso y su salida de la institución..."
            </p>
          </div>
        </div>
      `,
      icon: 'success',
      iconColor: '#28a745',
      confirmButtonText: '<i class="k-icon k-i-check"></i> Aceptar',
      confirmButtonColor: '#28a745',
      customClass: {
        popup: 'swal-marcacion-popup',
        title: 'swal-marcacion-title',
        confirmButton: 'swal-marcacion-btn-confirm'
      },
      buttonsStyling: true,
      width: '550px',
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
