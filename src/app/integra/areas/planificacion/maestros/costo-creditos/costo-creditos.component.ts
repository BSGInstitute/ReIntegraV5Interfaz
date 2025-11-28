import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';

// Interfaces que coinciden con la estructura de la API (Response)
interface BeneficioAPI {
    id: number;
    nombre: string;
}

interface PaisAPI {
    id: number;
    idPais: number;
    pais?: string; // Campo agregado para el nombre del país
    idMoneda: number;
    costoIndividual: number;
    costoPrograma: number;
    beneficios: BeneficioAPI[];
}

interface PaqueteAPI {
    id: number;
    nombre: string;
    cantidadCreditos: number;
    paises: PaisAPI[];
}

// Interfaces para Request (lo que enviamos a la API)
interface BeneficioRequest {
    id?: number; // Solo para actualizar
    nombre: string;
}

interface PaisRequest {
    id?: number; // Solo para actualizar
    idPais: number;
    idMoneda: number;
    costoIndividual: number;
    costoPaquete: number;
    beneficios: BeneficioRequest[];
}

interface PaqueteInsertRequest {
    nombre: string;
    cantidadCredito: number;
    paises: PaisRequest[];
}

interface PaqueteUpdateRequest {
    id: number;
    nombre: string;
    cantidadCredito: number;
    paises: PaisRequest[];
}

// Interfaces para uso interno del componente
interface PrecioPorPais {
    id?: number;
    idPais: number;
    nombrePais: string;
    codigoPais: string;
    idMoneda: number;
    moneda: string;
    precioUnitario: number;
    precioPaquete: number;
}

interface BeneficioPorPais {
    id?: number;
    idPais: number;
    nombrePais: string;
    descripcion: string;
    moneda: string;
}

interface Pais {
    id: number;
    nombre: string;
    codigo: string;
    idMoneda: number;
    moneda: string;
}

interface CostoCreditoPaquete {
    id: number;
    nombrePaquete: string;
    cantidadCreditos: number;
    precios: PrecioPorPais[];
    beneficios: BeneficioPorPais[];
}

/**
 * @module PlanificacionModule
 * @description Componente de Costo de Créditos Tutor Virtual
 * @version 1.0.0
 * @history
 * * 26/11/2025 Implementación de CRUD de Costo de Créditos
 **/

@Component({
    selector: 'app-costo-creditos',
    templateUrl: './costo-creditos.component.html',
    styleUrls: ['./costo-creditos.component.scss'],
})
export class CostoCreditosComponent implements OnInit {
    constructor(
        private integraService: IntegraService,
        private alertaService: AlertaService,
        private formService: FormService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) { }

    isNew: boolean = false;
    loaderModal: boolean = false;
    modalRef: any;
    gridCostoCreditos = new KendoGrid<CostoCreditoPaquete>();

    // Listas dinámicas
    listaPaises: Pais[] = [
        { id: 0, nombre: 'Internacional', codigo: 'INT', idMoneda: 19, moneda: 'USD' },
        { id: 51, nombre: 'Perú', codigo: 'PE', idMoneda: 20, moneda: 'PEN' },
        { id: 52, nombre: 'México', codigo: 'MX', idMoneda: 6, moneda: 'MXN' },
        { id: 56, nombre: 'Chile', codigo: 'CL', idMoneda: 9, moneda: 'CLP' },
        { id: 57, nombre: 'Colombia', codigo: 'CO', idMoneda: 10, moneda: 'COP' },
        { id: 54, nombre: 'Argentina', codigo: 'AR', idMoneda: 7, moneda: 'ARS' },
        { id: 55, nombre: 'Brasil', codigo: 'BR', idMoneda: 8, moneda: 'BRL' },
        { id: 593, nombre: 'Ecuador', codigo: 'EC', idMoneda: 19, moneda: 'USD' },
        { id: 591, nombre: 'Bolivia', codigo: 'BO', idMoneda: 16, moneda: 'BOB' },
    ];

    preciosPorPais: PrecioPorPais[] = [];
    beneficiosPorPais: BeneficioPorPais[] = [];

    paisSeleccionadoPrecios: Pais | null = null;
    paisSeleccionadoBeneficios: Pais | null = null;

    /**
     * Obtiene la lista de países disponibles para beneficios
     * Solo incluye países que ya tienen precios configurados
     */
    get listaPaisesDisponiblesParaBeneficios(): Pais[] {
        // Obtener IDs de países con precios configurados
        const paisesConPrecios = this.preciosPorPais.map(p => p.idPais);
        // Filtrar la lista de países para solo incluir los que tienen precios
        return this.listaPaises.filter(pais => paisesConPrecios.includes(pais.id));
    }

    formCostoCreditos: FormGroup = this.formBuilder.group({
        nombrePaquete: [null, Validators.required],
        cantidadCreditos: [null, [Validators.required, Validators.min(1)]],
    });

    ngOnInit(): void {
        this.configurarGrid();
        this.obtener();
    }

    agregarPais() {
        if (!this.paisSeleccionadoPrecios) {
            this.alertaService.notificationWarning('Seleccione un país');
            return;
        }

        const existe = this.preciosPorPais.find(p => p.idPais === this.paisSeleccionadoPrecios!.id);
        if (existe) {
            this.alertaService.notificationWarning('El país ya fue agregado');
            return;
        }

        const cantidad = this.formCostoCreditos.get('cantidadCreditos')?.value || 0;

        this.preciosPorPais.push({
            idPais: this.paisSeleccionadoPrecios.id,
            nombrePais: this.paisSeleccionadoPrecios.nombre,
            codigoPais: this.paisSeleccionadoPrecios.codigo,
            idMoneda: this.paisSeleccionadoPrecios.idMoneda,
            moneda: this.paisSeleccionadoPrecios.moneda,
            precioUnitario: 0,
            precioPaquete: 0
        });

        this.paisSeleccionadoPrecios = null;
    }

    eliminarPais(index: number) {
        this.preciosPorPais.splice(index, 1);
    }

    onPrecioUnitarioChange(index: number) {
        const cantidad = this.formCostoCreditos.get('cantidadCreditos')?.value || 0;
        const precio = this.preciosPorPais[index];
        precio.precioPaquete = precio.precioUnitario * cantidad;
    }

    recalcularTodosLosPrecios() {
        const cantidad = this.formCostoCreditos.get('cantidadCreditos')?.value || 0;
        this.preciosPorPais.forEach(precio => {
            precio.precioPaquete = precio.precioUnitario * cantidad;
        });
    }

    agregarBeneficio() {
        // Validar que haya precios configurados
        if (this.preciosPorPais.length === 0) {
            this.alertaService.notificationWarning('Debe configurar al menos un precio antes de agregar beneficios');
            return;
        }

        if (!this.paisSeleccionadoBeneficios) {
            this.alertaService.notificationWarning('Seleccione un país');
            return;
        }

        // Verificar que el país tenga precio configurado
        const tienePrecio = this.preciosPorPais.some(p => p.idPais === this.paisSeleccionadoBeneficios!.id);
        if (!tienePrecio) {
            this.alertaService.notificationWarning('El país seleccionado no tiene precios configurados');
            return;
        }

        this.beneficiosPorPais.push({
            idPais: this.paisSeleccionadoBeneficios.id,
            nombrePais: this.paisSeleccionadoBeneficios.nombre,
            moneda: this.paisSeleccionadoBeneficios.moneda,
            descripcion: ''
        });

        this.paisSeleccionadoBeneficios = null;
    }

    eliminarBeneficio(index: number) {
        this.beneficiosPorPais.splice(index, 1);
    }

    procesarPaquete(): CostoCreditoPaquete {
        let data = this.formCostoCreditos.getRawValue();

        let paquete: CostoCreditoPaquete = {
            id: this.isNew ? 0 : this.gridCostoCreditos.dataItemEditTemp.id,
            nombrePaquete: data.nombrePaquete,
            cantidadCreditos: data.cantidadCreditos,
            precios: this.preciosPorPais.map(p => ({ ...p })),
            beneficios: this.beneficiosPorPais.map(b => ({ ...b })),
        };
        return paquete;
    }

    /**
     * Transforma los datos de la API al formato requerido por el componente
     */
    /**
     * Transforma datos de la API al formato del componente (para lectura)
     */
    private transformarDatosAPI(paquetesAPI: PaqueteAPI[]): CostoCreditoPaquete[] {
        return paquetesAPI.map(paquete => {
            const precios: PrecioPorPais[] = [];
            const beneficios: BeneficioPorPais[] = [];

            paquete.paises.forEach(paisAPI => {
                // Buscar el país en nuestra lista para obtener nombre, código y moneda
                const paisInfo = this.listaPaises.find(p => p.id === paisAPI.idPais);
                const nombrePais = paisAPI.pais || paisInfo?.nombre || 'Desconocido';
                const codigoPais = paisInfo?.codigo || '??';
                const moneda = paisInfo?.moneda || 'USD';

                // Agregar precio
                precios.push({
                    id: paisAPI.id,
                    idPais: paisAPI.idPais,
                    nombrePais: nombrePais,
                    codigoPais: codigoPais,
                    idMoneda: paisAPI.idMoneda,
                    moneda: moneda,
                    precioUnitario: paisAPI.costoIndividual,
                    precioPaquete: paisAPI.costoPrograma
                });

                // Agregar beneficios
                paisAPI.beneficios.forEach(beneficioAPI => {
                    beneficios.push({
                        id: beneficioAPI.id,
                        idPais: paisAPI.idPais,
                        nombrePais: nombrePais,
                        moneda: moneda,
                        descripcion: beneficioAPI.nombre
                    });
                });
            });

            return {
                id: paquete.id,
                nombrePaquete: paquete.nombre,
                cantidadCreditos: paquete.cantidadCreditos,
                precios: precios,
                beneficios: beneficios
            };
        });
    }

    /**
     * Transforma datos del componente al formato de la API para insertar
     */
    private transformarParaInsertar(paquete: CostoCreditoPaquete): PaqueteInsertRequest {
        // Agrupar precios y beneficios por país
        const paisesProcesados = new Map<number, PaisRequest>();

        // Procesar precios
        this.preciosPorPais.forEach(precio => {
            if (!paisesProcesados.has(precio.idPais)) {
                const paisInfo = this.listaPaises.find(p => p.id === precio.idPais);
                paisesProcesados.set(precio.idPais, {
                    idPais: precio.idPais,
                    idMoneda: precio.idMoneda,
                    costoIndividual: precio.precioUnitario,
                    costoPaquete: precio.precioPaquete,
                    beneficios: []
                });
            }
        });

        // Procesar beneficios
        this.beneficiosPorPais.forEach(beneficio => {
            const paisData = paisesProcesados.get(beneficio.idPais);
            if (paisData) {
                paisData.beneficios.push({
                    nombre: beneficio.descripcion
                });
            }
        });

        return {
            nombre: paquete.nombrePaquete,
            cantidadCredito: paquete.cantidadCreditos,
            paises: Array.from(paisesProcesados.values())
        };
    }

    /**
     * Transforma datos del componente al formato de la API para actualizar
     */
    private transformarParaActualizar(paquete: CostoCreditoPaquete): PaqueteUpdateRequest {
        // Agrupar precios y beneficios por país
        const paisesProcesados = new Map<number, PaisRequest>();

        // Procesar precios
        this.preciosPorPais.forEach(precio => {
            if (!paisesProcesados.has(precio.idPais)) {
                const paisInfo = this.listaPaises.find(p => p.id === precio.idPais);
                const paisRequest: PaisRequest = {
                    idPais: precio.idPais,
                    idMoneda: precio.idMoneda,
                    costoIndividual: precio.precioUnitario,
                    costoPaquete: precio.precioPaquete,
                    beneficios: []
                };
                // Solo agregar ID si existe (para actualización)
                if (precio.id) {
                    paisRequest.id = precio.id;
                }
                paisesProcesados.set(precio.idPais, paisRequest);
            }
        });

        // Procesar beneficios
        this.beneficiosPorPais.forEach(beneficio => {
            const paisData = paisesProcesados.get(beneficio.idPais);
            if (paisData) {
                const beneficioRequest: BeneficioRequest = {
                    nombre: beneficio.descripcion
                };
                // Solo agregar ID si existe (para actualización)
                if (beneficio.id) {
                    beneficioRequest.id = beneficio.id;
                }
                paisData.beneficios.push(beneficioRequest);
            }
        });

        return {
            id: paquete.id,
            nombre: paquete.nombrePaquete,
            cantidadCredito: paquete.cantidadCreditos,
            paises: Array.from(paisesProcesados.values())
        };
    }

    /**
     * Obtiene el ID de la moneda basado en el código
     * TODO: Esto debería venir de un servicio o combo de monedas
     */
    // private obtenerIdMoneda(codigoMoneda: string): number {
    //     const monedas: { [key: string]: number } = {
    //         'USD': 1,
    //         'PEN': 52,
    //         'MXN': 56,
    //         'CLP': 57,
    //         'COP': 54,
    //         'ARS': 55,
    //         'BRL': 593,
    //         'BOB': 591
    //     };
    //     return monedas[codigoMoneda] || 1; // Default USD
    // }

    obtener() {
        this.gridCostoCreditos.loading = true;
        this.integraService
            .getJsonResponse('/PaqueteTutorVirtual/ObtenerDetalle')
            .subscribe({
                next: (resp: HttpResponse<PaqueteAPI[]>) => {
                    this.gridCostoCreditos.loading = false;
                    if (resp.body) {
                        const datosTransformados = this.transformarDatosAPI(resp.body);
                        this.gridCostoCreditos.data$.next(datosTransformados);
                    }
                },
                error: (error) => {
                    this.gridCostoCreditos.loading = false;
                    let mensaje = this.alertaService.getMessageErrorService(error);
                    this.alertaService.notificationWarning(mensaje);
                },
            });
    }

    insertar() {
        if (this.formCostoCreditos.valid) {
            let paqueteTemp = this.procesarPaquete();
            let jsonEnvio = this.transformarParaInsertar(paqueteTemp);
            this.gridCostoCreditos.loading = true;
            this.loaderModal = true;

            this.integraService
                .postJsonResponse(
                    '/PaqueteTutorVirtual/Insertar',
                    jsonEnvio
                )
                .subscribe({
                    next: (resp: HttpResponse<any>) => {
                        this.gridCostoCreditos.loading = false;
                        this.loaderModal = false;
                        this.modalRef.close();
                        this.alertaService.mensajeExitoso();
                        this.obtener();
                    },
                    error: (error) => {
                        this.loaderModal = false;
                        this.gridCostoCreditos.loading = false;
                        let mensaje = this.alertaService.getMessageErrorService(error);
                        this.alertaService.notificationWarning(mensaje);
                    },
                });
        } else {
            this.formCostoCreditos.markAllAsTouched();
        }
    }

    actualizar() {
        if (this.formCostoCreditos.valid) {
            let paqueteTemp = this.procesarPaquete();
            let jsonEnvio = this.transformarParaActualizar(paqueteTemp);
            this.gridCostoCreditos.loading = true;
            this.loaderModal = true;

            this.integraService
                .putJsonResponse(
                    '/PaqueteTutorVirtual/Actualizar',
                    jsonEnvio
                )
                .subscribe({
                    next: (resp: HttpResponse<any>) => {
                        this.gridCostoCreditos.loading = false;
                        this.loaderModal = false;
                        this.modalRef.close();
                        this.alertaService.mensajeExitoso();
                        this.obtener();
                    },
                    error: (error) => {
                        this.loaderModal = false;
                        this.gridCostoCreditos.loading = false;
                        let mensaje = this.alertaService.getMessageErrorService(error);
                        this.alertaService.notificationWarning(mensaje);
                    },
                });
        } else {
            this.formCostoCreditos.markAllAsTouched();
        }
    }

    eliminar(id: number, index: number) {
        this.gridCostoCreditos.loading = true;

        this.integraService
            .deleteJsonResponse(`/PaqueteTutorVirtual/Eliminar/${id}`)
            .subscribe({
                next: (resp: HttpResponse<boolean>) => {
                    this.gridCostoCreditos.loading = false;
                    if (resp.body) {
                        this.gridCostoCreditos.data.splice(index, 1);
                        this.gridCostoCreditos.loadView();
                        this.alertaService.mensajeIcon(
                            '¡Eliminado!',
                            'El paquete ha sido eliminado correctamente.',
                            'success'
                        );
                        this.obtener();
                    }
                },
                error: (error) => {
                    this.gridCostoCreditos.loading = false;
                    let mensaje = this.alertaService.getMessageErrorService(error);
                    this.alertaService.notificationWarning(mensaje);
                },
            });
    }

    configurarGrid() {
        this.gridCostoCreditos.getRemoveEvent$().subscribe({
            next: (resp) => {
                this.alertaService.mensajeEliminar().then((result) => {
                    if (result.isConfirmed) {
                        this.eliminar(resp.dataItem.id, resp.index);
                    }
                });
            },
        });
    }

    abrirModal(content: any, dataItem?: CostoCreditoPaquete) {
        this.isNew = !dataItem;

        // Limpiar arrays
        this.preciosPorPais = [];
        this.beneficiosPorPais = [];

        if (dataItem) {
            this.gridCostoCreditos.dataItemEditTemp = dataItem;
            this.formCostoCreditos.patchValue({
                nombrePaquete: dataItem.nombrePaquete,
                cantidadCreditos: dataItem.cantidadCreditos,
            });

            // Cargar precios y beneficios existentes
            this.preciosPorPais = dataItem.precios?.map(p => ({ ...p })) || [];
            this.beneficiosPorPais = dataItem.beneficios?.map(b => ({ ...b })) || [];
        } else {
            this.formCostoCreditos.reset();
        }

        this.modalRef = this.modalService.open(content, { size: 'xl', centered: true });
    }

    getErrorMessage(controlName: string): string {
        return this.formService.errorMessage(
            this.formCostoCreditos.get(controlName) as FormControl,
            controlName
        );
    }
}

