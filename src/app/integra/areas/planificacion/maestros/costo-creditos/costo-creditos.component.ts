import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';

interface CostoCreditoPaquete {
    id: number;
    nombrePaquete: string;
    cantidadCreditos: number;
    costoInternacionalPaquete?: number;
    costoInternacionalIndividual?: number;
    costoPeruPaquete?: number;
    costoPeruIndividual?: number;
    costoMexicoPaquete?: number;
    costoMexicoIndividual?: number;
    costoChilePaquete?: number;
    costoChileIndividual?: number;
    costoColombiaPaquete?: number;
    costoColombiaIndividual?: number;
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

    formCostoCreditos: FormGroup = this.formBuilder.group({
        nombrePaquete: [null, Validators.required],
        cantidadCreditos: [null, [Validators.required, Validators.min(1)]],
        // Beneficios
        beneficio1Internacional: [null, Validators.min(0)],
        beneficio2Internacional: [null, Validators.min(0)],
        beneficio1Peru: [null, Validators.min(0)],
        beneficio2Peru: [null, Validators.min(0)],
        beneficio1Mexico: [null, Validators.min(0)],
        beneficio2Mexico: [null, Validators.min(0)],
        beneficio1Chile: [null, Validators.min(0)],
        beneficio2Chile: [null, Validators.min(0)],
        beneficio1Colombia: [null, Validators.min(0)],
        beneficio2Colombia: [null, Validators.min(0)],
        // Precios
        costoInternacionalPaquete: [null, [Validators.required, Validators.min(0)]],
        costoInternacionalIndividual: [null, [Validators.required, Validators.min(0)]],
        costoPeruPaquete: [null, [Validators.required, Validators.min(0)]],
        costoPeruIndividual: [null, [Validators.required, Validators.min(0)]],
        costoMexicoPaquete: [null, [Validators.required, Validators.min(0)]],
        costoMexicoIndividual: [null, [Validators.required, Validators.min(0)]],
        costoChilePaquete: [null, [Validators.required, Validators.min(0)]],
        costoChileIndividual: [null, [Validators.required, Validators.min(0)]],
        costoColombiaPaquete: [null, [Validators.required, Validators.min(0)]],
        costoColombiaIndividual: [null, [Validators.required, Validators.min(0)]],
    });

    ngOnInit(): void {
        this.configurarGrid();
        this.obtener();
        this.setupCalculations();
    }

    setupCalculations() {
        // Suscribirse a cambios en cantidad de créditos y costos individuales para calcular costos de paquete
        this.formCostoCreditos.get('cantidadCreditos')?.valueChanges.subscribe(() => {
            this.calcularCostosPaquete();
        });

        // Suscripciones para cada país
        this.formCostoCreditos.get('costoInternacionalIndividual')?.valueChanges.subscribe(() => {
            this.calcularCostoPaquete('costoInternacionalPaquete', 'costoInternacionalIndividual');
        });

        this.formCostoCreditos.get('costoPeruIndividual')?.valueChanges.subscribe(() => {
            this.calcularCostoPaquete('costoPeruPaquete', 'costoPeruIndividual');
        });

        this.formCostoCreditos.get('costoMexicoIndividual')?.valueChanges.subscribe(() => {
            this.calcularCostoPaquete('costoMexicoPaquete', 'costoMexicoIndividual');
        });

        this.formCostoCreditos.get('costoChileIndividual')?.valueChanges.subscribe(() => {
            this.calcularCostoPaquete('costoChilePaquete', 'costoChileIndividual');
        });

        this.formCostoCreditos.get('costoColombiaIndividual')?.valueChanges.subscribe(() => {
            this.calcularCostoPaquete('costoColombiaPaquete', 'costoColombiaIndividual');
        });
    }

    calcularCostoPaquete(paqueteField: string, individualField: string) {
        const cantidadCreditos = this.formCostoCreditos.get('cantidadCreditos')?.value;
        const costoIndividual = this.formCostoCreditos.get(individualField)?.value;

        if (cantidadCreditos && costoIndividual) {
            const costoPaquete = cantidadCreditos * costoIndividual;
            this.formCostoCreditos.get(paqueteField)?.setValue(costoPaquete, { emitEvent: false });
        }
    }

    calcularCostosPaquete() {
        // Recalcular todos los costos de paquete cuando cambia la cantidad de créditos
        this.calcularCostoPaquete('costoInternacionalPaquete', 'costoInternacionalIndividual');
        this.calcularCostoPaquete('costoPeruPaquete', 'costoPeruIndividual');
        this.calcularCostoPaquete('costoMexicoPaquete', 'costoMexicoIndividual');
        this.calcularCostoPaquete('costoChilePaquete', 'costoChileIndividual');
        this.calcularCostoPaquete('costoColombiaPaquete', 'costoColombiaIndividual');
    }

    procesarPaquete(): CostoCreditoPaquete {
        let data = this.formCostoCreditos.getRawValue();

        let paquete: CostoCreditoPaquete = {
            id: this.isNew ? 0 : this.gridCostoCreditos.dataItemEditTemp.id,
            nombrePaquete: data.nombrePaquete,
            cantidadCreditos: data.cantidadCreditos,
            costoInternacionalPaquete: data.costoInternacionalPaquete,
            costoInternacionalIndividual: data.costoInternacionalIndividual,
            costoPeruPaquete: data.costoPeruPaquete,
            costoPeruIndividual: data.costoPeruIndividual,
            costoMexicoPaquete: data.costoMexicoPaquete,
            costoMexicoIndividual: data.costoMexicoIndividual,
            costoChilePaquete: data.costoChilePaquete,
            costoChileIndividual: data.costoChileIndividual,
            costoColombiaPaquete: data.costoColombiaPaquete,
            costoColombiaIndividual: data.costoColombiaIndividual,
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

        // Datos de ejemplo basados en la imagen
        setTimeout(() => {
            const datosEjemplo: CostoCreditoPaquete[] = [
                {
                    id: 1,
                    nombrePaquete: 'Básico',
                    cantidadCreditos: 20,
                    costoInternacionalPaquete: 40,
                    costoInternacionalIndividual: 3,
                    costoPeruPaquete: 152,
                    costoPeruIndividual: 7.6,
                    costoMexicoPaquete: 826,
                    costoMexicoIndividual: 41.3,
                    costoChilePaquete: 41762,
                    costoChileIndividual: 2088.1,
                    costoColombiaPaquete: 168999,
                    costoColombiaIndividual: 8449.9,
                },
                {
                    id: 2,
                    nombrePaquete: 'Estándar',
                    cantidadCreditos: 50,
                    costoInternacionalPaquete: 95,
                    costoInternacionalIndividual: 1.9,
                    costoPeruPaquete: 320,
                    costoPeruIndividual: 6.4,
                    costoMexicoPaquete: 1743,
                    costoMexicoIndividual: 34.9,
                    costoChilePaquete: 88164,
                    costoChileIndividual: 1763.3,
                    costoColombiaPaquete: 356775,
                    costoColombiaIndividual: 7135.5,
                },
                {
                    id: 3,
                    nombrePaquete: 'Premium',
                    cantidadCreditos: 150,
                    costoInternacionalPaquete: 195,
                    costoInternacionalIndividual: 1.3,
                    costoPeruPaquete: 656,
                    costoPeruIndividual: 4.4,
                    costoMexicoPaquete: 3577,
                    costoMexicoIndividual: 23.9,
                    costoChilePaquete: 3577,
                    costoChileIndividual: 1206.4,
                    costoColombiaPaquete: 732328,
                    costoColombiaIndividual: 4882,
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
        if (dataItem) {
            this.gridCostoCreditos.dataItemEditTemp = dataItem;
            this.formCostoCreditos.patchValue({
                nombrePaquete: dataItem.nombrePaquete,
                cantidadCreditos: dataItem.cantidadCreditos,
                costoInternacionalPaquete: dataItem.costoInternacionalPaquete,
                costoInternacionalIndividual: dataItem.costoInternacionalIndividual,
                costoPeruPaquete: dataItem.costoPeruPaquete,
                costoPeruIndividual: dataItem.costoPeruIndividual,
                costoMexicoPaquete: dataItem.costoMexicoPaquete,
                costoMexicoIndividual: dataItem.costoMexicoIndividual,
                costoChilePaquete: dataItem.costoChilePaquete,
                costoChileIndividual: dataItem.costoChileIndividual,
                costoColombiaPaquete: dataItem.costoColombiaPaquete,
                costoColombiaIndividual: dataItem.costoColombiaIndividual,
            });
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

