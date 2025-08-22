import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormParametroSeo, ParametrosSeoPgeneral } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { cloneData } from '@shared/functions/clone-data';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Subscription } from 'rxjs';

/**
 * @module PgeneralModule
 * @description Componente de Programas Generales
 * @author Flavio R. Mamani Fabian
 * @version 1.2.0
 * @history
 * * 16/07/2023 Implementacion de componente
 * * 14/03/2024 Validacion y obtencion de datos
 **/
@Component({
  selector: 'app-pg-parametro-seo',
  templateUrl: './pg-parametro-seo.component.html',
  styleUrls: ['./pg-parametro-seo.component.scss'],
})
export class PgParametroSeoComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder) {}
  @Input() pgeneralService: PgeneralService;
  formParametroSeo: FormGroup = this._formBuilder.group({
    parametrosSeo: [null, Validators.required],
    imgPortada: [null],
    url: [null],
    imgPortadaAlt: [null],
    nombreWebHTML: [null],
    descripcionGeneral: [null],
  });
  gridContenidoParametroSeo: KendoGrid<ParametrosSeoPgeneral> = new KendoGrid();
  comboParametroSeo: ParametrosSeoPgeneral[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  private _subscriptions$ = new Subscription();
  ngOnInit(): void {
    this.configurarGridContenidoParametroSeo();
    this.initCombos();
    this.initSubscribeObservables();
    if(!this.pgeneralService.isNewPgeneral){
      this.asignarValoresForm();
    }
  }
  private initCombos() {
    this.comboParametroSeo = this.pgeneralService.combosModulo.parametroSeo.map(
      (x) => {
        let item: ParametrosSeoPgeneral = {
          id: 0,
          idPgeneral: 0,
          nombreParametroSeo: x.nombre,
          idParametroSeo: x.id,
          descripcion: '',
        };
        return item;
      }
    );
  }
  /**
   * Asigna los valores de parametro seo
   */
  private asignarValoresForm() {
    let dataItem = this.pgeneralService.dataItemPgeneral;
    this.formParametroSeo.get('imgPortada').setValue(dataItem.pwImgPortada);
    this.formParametroSeo
      .get('imgPortadaAlt')
      .setValue(dataItem.pwImgPortadaAlf);
    this.formParametroSeo.get('url').setValue(dataItem.pgTitulo);
    this.formParametroSeo.get('nombreWebHTML').setValue(dataItem.pwTituloHtml);
    this.formParametroSeo
      .get('descripcionGeneral')
      .setValue(dataItem.pwDescripcionGeneral);
  }
  /**
   * Inicializacion de subscribe en observables
   */
  private initSubscribeObservables() {
    let sub$ = this.pgeneralService.detalleProgramas$.subscribe((resp) => {
      if (resp != null) {
        this.gridContenidoParametroSeo.data = cloneData(resp.parametrosSeo);
        resp.parametrosSeo.forEach((x) => {
          let item = this.comboParametroSeo.find(
            (s) => s.idParametroSeo == x.idParametroSeo
          );
          if (item != null) {
            item.idPgeneral = x.idPgeneral;
            item.descripcion = x.descripcion;
            item.id = x.id;
          }
        });
        this.formParametroSeo.get('parametrosSeo').setValue(resp.parametrosSeo);
      }
    });
    this.pgeneralService.getDatosModalPgeneral$.subscribe(() => {
      this.pgeneralService.dataFormParametroSeo$.next(
        this.datosFormParametroSeo
      );
      let data = this.gridContenidoParametroSeo.data;
      this.pgeneralService.dataParametrosSeo$.next(data);
    })
    this._subscriptions$.add(sub$);
  }
  /**
   * Congiguracion de la grilla de contenido parametros seo
   */
  private configurarGridContenidoParametroSeo() {
    this.gridContenidoParametroSeo.formGroup = this._formBuilder.group({
      descripcion: null,
    });
    this.gridContenidoParametroSeo.cellClickEvent$.subscribe((resp) => {});
    this.gridContenidoParametroSeo.cellCloseEvent$.subscribe((resp) => {
      if (resp.columnField == 'descripcion') {
        resp.dataItem.descripcion = resp.formGroup.get('descripcion').value;
      }
    });
  }
  /**
   * Carga los elementos seleccionados en la grilla de parametros seo
   * @param event
   */
  onValueChangeParametroSeo(event: ParametrosSeoPgeneral[]) {
    let data = this.gridContenidoParametroSeo.data.filter(x => event.map(s => s.idParametroSeo).includes(x.idParametroSeo));
    let nuevosParametrosSeo = event.filter(
      (x) =>
        !data
          .map((s) => s.idParametroSeo)
          .includes(x.idParametroSeo)
    );

    let parametros = nuevosParametrosSeo.map((e) => {
      let item: ParametrosSeoPgeneral = {
        id: e.id,
        idPgeneral: e.idPgeneral,
        nombreParametroSeo: e.nombreParametroSeo,
        idParametroSeo: e.idParametroSeo,
        descripcion: e.descripcion,
      };
      return item;
    });
    this.gridContenidoParametroSeo.data = [
      ...data,
      ...parametros,
    ];
  }
  get datosFormParametroSeo(): FormParametroSeo{
    return this.formParametroSeo.getRawValue() as FormParametroSeo;
  }
}
