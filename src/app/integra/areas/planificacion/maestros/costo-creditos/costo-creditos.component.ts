import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';

interface PrecioPorPais {
    id?: number;
    idPais: number;
    nombrePais: string;
    codigoPais: string;
    moneda: string;
    precioUnitario: number;
    precioPaquete: number;
}

interface BeneficioPorPais {
    id?: number;
    idPais: number;
    nombrePais: string;
    descripcion: string;
    monto: number;
    moneda: string;
}

interface Pais {
    id: number;
    nombre: string;
    codigo: string;
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
        { id: 1, nombre: 'Internacional', codigo: 'INT', moneda: 'USD' },
        { id: 2, nombre: 'Perú', codigo: 'PE', moneda: 'PEN' },
        { id: 3, nombre: 'México', codigo: 'MX', moneda: 'MXN' },
        { id: 4, nombre: 'Chile', codigo: 'CL', moneda: 'CLP' },
        { id: 5, nombre: 'Colombia', codigo: 'CO', moneda: 'COP' },
        { id: 6, nombre: 'Argentina', codigo: 'AR', moneda: 'ARS' },
        { id: 7, nombre: 'Brasil', codigo: 'BR', moneda: 'BRL' },
        { id: 8, nombre: 'Ecuador', codigo: 'EC', moneda: 'USD' },
        { id: 9, nombre: 'Bolivia', codigo: 'BO', moneda: 'BOB' },
    ];

    preciosPorPais: PrecioPorPais[] = [];
    beneficiosPorPais: BeneficioPorPais[] = [];

    paisSeleccionadoPrecios: Pais | null = null;
    paisSeleccionadoBeneficios: Pais | null = null;

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
        if (!this.paisSeleccionadoBeneficios) {
            this.alertaService.notificationWarning('Seleccione un país');
            return;
        }

        this.beneficiosPorPais.push({
            idPais: this.paisSeleccionadoBeneficios.id,
            nombrePais: this.paisSeleccionadoBeneficios.nombre,
            moneda: this.paisSeleccionadoBeneficios.moneda,
            descripcion: '',
            monto: 0
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

    obtener() {
        this.gridCostoCreditos.loading = true;
        // TODO: Reemplazar con el endpoint real cuando esté disponible
        // this.integraService
        //   .getJsonResponse(constApiPlanificacion.CostoCreditosObtener)
        //   .subscribe({
        //     next: (resp: HttpResponse<CostoCreditoPaquete[]>) => {
        //       this.gridCostoCreditos.loading = false;
        //       this.gridCostoCreditos.data$.next(resp.body);
        //     },
        //     error: (error) => {
        //       this.gridCostoCreditos.loading = false;
        //       let mensaje = this.alertaService.getMessageErrorService(error);
        //       this.alertaService.notificationWarning(mensaje);
        //     },
        //   });

        // Datos de ejemplo con la nueva estructura
        setTimeout(() => {
            const datosEjemplo: CostoCreditoPaquete[] = [
                {
                    id: 1,
                    nombrePaquete: 'Básico',
                    cantidadCreditos: 20,
                    precios: [
                        { idPais: 1, nombrePais: 'Internacional', codigoPais: 'INT', moneda: 'USD', precioUnitario: 2, precioPaquete: 40 },
                        { idPais: 2, nombrePais: 'Perú', codigoPais: 'PE', moneda: 'PEN', precioUnitario: 7.6, precioPaquete: 152 },
                        { idPais: 3, nombrePais: 'México', codigoPais: 'MX', moneda: 'MXN', precioUnitario: 41.3, precioPaquete: 826 },
                    ],
                    beneficios: [
                        { idPais: 1, nombrePais: 'Internacional', moneda: 'USD', descripcion: 'Descuento por volumen', monto: 0.5 },
                    ]
                },
                {
                    id: 2,
                    nombrePaquete: 'Estándar',
                    cantidadCreditos: 50,
                    precios: [
                        { idPais: 1, nombrePais: 'Internacional', codigoPais: 'INT', moneda: 'USD', precioUnitario: 1.9, precioPaquete: 95 },
                        { idPais: 2, nombrePais: 'Perú', codigoPais: 'PE', moneda: 'PEN', precioUnitario: 6.4, precioPaquete: 320 },
                    ],
                    beneficios: []
                },
                {
                    id: 3,
                    nombrePaquete: 'Premium',
                    cantidadCreditos: 150,
                    precios: [
                        { idPais: 1, nombrePais: 'Internacional', codigoPais: 'INT', moneda: 'USD', precioUnitario: 1.3, precioPaquete: 195 },
                        { idPais: 4, nombrePais: 'Chile', codigoPais: 'CL', moneda: 'CLP', precioUnitario: 1206.4, precioPaquete: 180960 },
                        { idPais: 5, nombrePais: 'Colombia', codigoPais: 'CO', moneda: 'COP', precioUnitario: 4882, precioPaquete: 732300 },
                    ],
                    beneficios: [
                        { idPais: 1, nombrePais: 'Internacional', moneda: 'USD', descripcion: 'Soporte prioritario', monto: 100 },
                        { idPais: 4, nombrePais: 'Chile', moneda: 'CLP', descripcion: 'Beneficio especial', monto: 50000 },
                    ]
                },
            ];
            this.gridCostoCreditos.data$.next(datosEjemplo);
            this.gridCostoCreditos.loading = false;
        }, 500);
    }

    insertar() {
        if (this.formCostoCreditos.valid) {
            let jsonEnvio = this.procesarPaquete();
            this.gridCostoCreditos.loading = true;
            this.loaderModal = true;

            // TODO: Reemplazar con el endpoint real cuando esté disponible
            // this.integraService
            //   .postJsonResponse(
            //     constApiPlanificacion.CostoCreditosInsertar,
            //     jsonEnvio
            //   )
            //   .subscribe({
            //     next: (resp: HttpResponse<CostoCreditoPaquete>) => {
            //       this.gridCostoCreditos.loading = false;
            //       this.loaderModal = false;
            //       this.gridCostoCreditos.loadData();
            //       this.modalRef.close();
            //       this.alertaService.mensajeExitoso();
            //       this.obtener();
            //     },
            //     error (error) => {
            //       this.loaderModal = false;
            //       let mensaje = this.alertaService.getMessageErrorService(error);
            //       this.alertaService.notificationWarning(mensaje);
            //       this.gridCostoCreditos.loading = false;
            //     },
            //   });

            // Simulación temporal
            setTimeout(() => {
                this.gridCostoCreditos.loading = false;
                this.loaderModal = false;
                this.modalRef.close();
                this.alertaService.mensajeExitoso();
                this.obtener();
            }, 500);
        } else {
            this.formCostoCreditos.markAllAsTouched();
        }
    }

    actualizar() {
        if (this.formCostoCreditos.valid) {
            let jsonEnvio = this.procesarPaquete();
            this.gridCostoCreditos.loading = true;
            this.loaderModal = true;

            // TODO: Reemplazar con el endpoint real cuando esté disponible
            // this.integraService
            //   .putJsonResponse(
            //     constApiPlanificacion.CostoCreditosActualizar,
            //     jsonEnvio
            //   )
            //   .subscribe({
            //     next: (resp: HttpResponse<CostoCreditoPaquete>) => {
            //       this.gridCostoCreditos.loading = false;
            //       this.gridCostoCreditos.assignValues(
            //         this.gridCostoCreditos.dataItemEditTemp,
            //         resp.body
            //       );
            //       this.gridCostoCreditos.loadData();
            //       this.modalRef.close();
            //       this.loaderModal = false;
            //       this.alertaService.mensajeExitoso();
            //     },
            //     error: (error) => {
            //       this.modalRef.close();
            //       this.loaderModal = false;
            //       let mensaje = this.alertaService.getMessageErrorService(error);
            //       this.alertaService.notificationWarning(mensaje);
            //       this.gridCostoCreditos.loading = false;
            //     },
            //   });

            // Simulación temporal
            setTimeout(() => {
                this.gridCostoCreditos.loading = false;
                this.loaderModal = false;
                this.modalRef.close();
                this.alertaService.mensajeExitoso();
                this.obtener();
            }, 500);
        } else {
            this.formCostoCreditos.markAllAsTouched();
        }
    }

    eliminar(id: number, index: number) {
        this.gridCostoCreditos.loading = true;

        // TODO: Reemplazar con el endpoint real cuando esté disponible
        // this.integraService
        //   .deleteJsonResponse(`${constApiPlanificacion.CostoCreditosEliminar}/${id}`)
        //   .subscribe({
        //     next: (resp: HttpResponse<boolean>) => {
        //       this.gridCostoCreditos.loading = false;
        //       if (resp.body) {
        //         this.gridCostoCreditos.data.splice(index, 1);
        //         this.gridCostoCreditos.loadView();
        //         this.alertaService.mensajeIcon(
        //           '¡Eliminado!',
        //           'El paquete ha sido eliminado.',
        //           'success'
        //         );
        //         this.obtener();
        //       }
        //     },
        //     error: (error) => {
        //       this.gridCostoCreditos.loading = false;
        //       let mensaje = this.alertaService.getMessageErrorService(error);
        //       this.alertaService.notificationWarning(mensaje);
        //     },
        //   });

        // Simulación temporal
        setTimeout(() => {
            this.gridCostoCreditos.loading = false;
            this.alertaService.mensajeIcon(
                '¡Eliminado!',
                'El paquete ha sido eliminado.',
                'success'
            );
            this.obtener();
        }, 500);
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

