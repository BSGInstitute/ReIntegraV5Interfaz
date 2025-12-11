import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  DrawerComponent,
  DrawerSelectEvent,
} from '@progress/kendo-angular-layout';
import { CrmService } from '@shared/services/crm.service';
import { UserService } from '@shared/services/user.service';
import { IGrupoModulo, ISubGrupoModulo } from '@shared/models/interfaces/imenu';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { RingoverSDKService } from '@shared/services/ringover-sdk.service';
import { MarcacionPersonalService } from '@shared/services/marcacion-personal.service';
import { TipoMarcacion } from '@shared/models/interfaces/imarcacion-personal';

/**
 * @description Componente principal menu
 * @author Flavio Rodrigo Mamani Fabian
 * @version 2.0.1
 * @history
 * * --/--/-- Creacion de componentes y menus de pruebas
 * * --/--/-- Interaccion con modulos de usaurio
 * * --/--/-- Estilos y carga de iconos
 * * 24/06/2023 Ajuste y limpieza de codigo
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('drawer') drawer: DrawerComponent;
  constructor(
    private _router: Router,
    private _crmService: CrmService,
    private _userService: UserService,
    private _titleService: Title,
    private _ringoverSDKService: RingoverSDKService,
    private _marcacionPersonalService: MarcacionPersonalService
  ) {}

  private _sourceModulos: IGrupoModulo[] = [];
  private _subscriptions: Subscription = new Subscription();
  private _itemIndex: any;
  itemsModulos: any[] = [];
  flexBasis: string = 'flex-basis: 0px;';
  toggle: boolean = false;
  ngOnInit(): void {
    this.configWindow();
    this.initSubscribeObservables();
    this.inicializarMarcacion();
  }
  ngAfterViewInit(): void {
    this.drawer.toggle(this.toggle);
    this.flexBasis = 'flex-basis: 0px;';
  }
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
    this._marcacionPersonalService.detenerIntervalos();
    this._sourceModulos = null;
    this._subscriptions = null;
    this._itemIndex = null;
    this.itemsModulos = null;
    this.flexBasis = null;
    this.toggle = null;
  }
  get showBtnConectarCrm$() {
    return this._crmService.showBtnConectarCrm$;
  }
  get showBtnRingover$() {
    return this._crmService.showBtnRingover$;
  }
  get srcImgAvatar$() {
    return this._userService.avatar$;
  }
  get nombreAsesor$() {
    return this._userService.nombrePersonal$;
  }
  get esCrmActivo$(){
    return this._crmService.esCrmActivo$
  }
  get mostrarBotonesMarcacion$(): Observable<boolean> {
    return this._marcacionPersonalService.mostrarBotonesMarcacion$;
  }
  private initSubscribeObservables() {
    let sub1$ = this._userService.moduloUsuario$.subscribe((resp) => {
      if (resp != null) {
        this.cargarModulos(resp);
      }
    });
    this._subscriptions.add(sub1$);
  }
  private cargarModulos(resp: IGrupoModulo[]) {
    resp.forEach((e) => {
      e.level = 1;
      e.children = false;
      if (e.subGrupoModulo.length > 0) {
        e.children = true;
        e.subGrupoModulo.forEach((x) => {
          x.level = 2;
          x.children = false;
          if (x.modulos.length > 0) {
            x.children = true;
            x.modulos.forEach((x) => {
              x.level = 3;
            });
          }
        });
      }
    });
    this._sourceModulos = resp;
    this.itemsModulos = resp.map((x) => {
      let item = {
        idGrupo: x.idGrupo,
        nombreGrupo: x.nombreGrupo,
        subGrupoModulo: x.subGrupoModulo,
        text: x.nombreGrupo,
        icon: this.getIconMenuGrupo(x.nombreGrupo),
        level: x.level,
        selected: false,
        children: x.children,
        expanded: false,
      };
      return item;
    });
  }
  private getIconMenuGrupo(grupo: string) {
    let icon: string = '';
    switch (grupo) {
      case 'COMERCIAL':
        icon = 'k-i-globe';
        break;
      case 'PLANIFICACION':
        icon = 'k-i-saturation';
        break;
      case 'MARKETING':
        icon = 'k-i-share';
        break;
      case 'FINANZAS':
        icon = 'k-i-dollar';
        break;
      case 'GESTIÓN DE PERSONAS':
        icon = 'k-i-myspace';
        break;
      case 'REPORTES':
        icon = 'k-i-paste-plain-text';
        break;
      case 'OPERACIONES':
        icon = 'k-i-page-properties';
        break;
      case 'FUR':
        icon = 'k-i-percent';
        break;
      case 'CAJAS':
        icon = 'k-i-inbox';
        break;
      case 'INGRESOS':
        icon = 'k-i-validation-data';
        break;
      case 'MAESTROS GENERALES':
        icon = 'k-i-thumbnails-down';
        break;
      default:
        icon = 'k-i-track-changes-accept';
        break;
    }
    return icon;
  }

  private validarWebphoneActivo(): boolean {
    if (window.name == 'tabActivo') {
      localStorage.removeItem('WebphoneActivo');
      sessionStorage.removeItem('WebphoneActivo');
      window.name = '';
    }
    if (window.localStorage) {
      let estado = localStorage.getItem('WebphoneActivo');
      if (estado == '1' && window.name != 'tabActivo') {
        this._crmService.showBtnMostrarWebphone$.next(false);
        this._crmService.showBtnReiniciarWebphone$.next(false);
        return false;
      } else {
        window.name = 'tabActivo';
        localStorage.setItem('WebphoneActivo', '1');
        return true;
      }
    } else if (window.sessionStorage) {
      console.log('Tu Browser no soporta localStorage!');
      let estado = sessionStorage.getItem('WebphoneActivo');
      if (estado == '1' && window.name != 'tabActivo') {
        this._crmService.showBtnMostrarWebphone$.next(false);
        this._crmService.showBtnReiniciarWebphone$.next(false);
        return false;
      } else {
        window.name = 'tabActivo';
        sessionStorage.setItem('WebphoneActivo', '1');
        return true;
      }
    }
    return false;
  }
  private configWindow() {
    window.addEventListener('storage', (e) => {
      if (e.key == 'WebphoneActivo') {
        if (window.name == 'tabActivo') {
          sessionStorage.removeItem('WebphoneActivo');
          localStorage.removeItem('WebphoneActivo');
          window.name = '';
          this.toggleCRM();
        }
      }
    });
    window.addEventListener('beforeunload', (e) => {
      if (window.name == 'tabActivo') {
        sessionStorage.removeItem('WebphoneActivo');
        localStorage.removeItem('WebphoneActivo');
        window.name = '';
      }
    });
  }
  toggleCRM() {
    this.validarWebphoneActivo();
    let statusCRM = this._crmService.esCrmActivo$.value;
    if (statusCRM) {
      localStorage.removeItem('WebphoneActivo');
      sessionStorage.removeItem('WebphoneActivo');
      window.name = '';
      statusCRM = !statusCRM;
    } else {
      if (window.localStorage) {
        let estado = localStorage.getItem('WebphoneActivo');
        if (estado == '1' && window.name != 'tabActivo') {
          this._crmService.showBtnMostrarWebphone$.next(false);
          this._crmService.showBtnReiniciarWebphone$.next(false);
          this.activarCRMtabActual();
        } else {
          window.name = 'tabActivo';
          localStorage.setItem('WebphoneActivo', '1');
          statusCRM = !statusCRM;
        }
      } else if (window.sessionStorage) {
        console.log('Tu Browser no soporta localStorage!');
        let estado = sessionStorage.getItem('WebphoneActivo');
        if (estado == '1' && window.name != 'tabActivo') {
          this._crmService.showBtnMostrarWebphone$.next(false);
          this._crmService.showBtnReiniciarWebphone$.next(false);
          this.activarCRMtabActual();
        } else {
          window.name = 'tabActivo';
          sessionStorage.setItem('WebphoneActivo', '1');
          statusCRM = !statusCRM;
        }
      }
    }
    this._crmService.esCrmActivo$.next(statusCRM);
    this._crmService.showCRM$.next(statusCRM);
  }
  private activarCRMtabActual() {
    Swal.fire({
      title: 'Ya existe un CRM activo, ¿Desea desactivarlo?',
      showCancelButton: true,
      confirmButtonText: 'Si',
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('WebphoneActivo');
        localStorage.removeItem('WebphoneActivo');
        window.name = '';
      }
    });
  }
  onSelectItem(ev: DrawerSelectEvent): void {
    this._itemIndex = this.itemsModulos.findIndex((e: any) => e == ev.item);
    switch (ev.item.level) {
      case 1:
        let grupo = ev.item;
        let grupoTemp: IGrupoModulo = this._sourceModulos.find(
          (x) => x.idGrupo == grupo.idGrupo
        );
        grupo.expanded = !grupo.expanded;
        let subGrupoModulo = grupoTemp.subGrupoModulo.map((x) => {
          let item = {
            idModuloSistemaTipo: x.idModuloSistemaTipo,
            idGrupo: x.idGrupo,
            nombreModuloSistemaTipo: x.nombreModuloSistemaTipo,
            text: x.nombreModuloSistemaTipo,
            icon: 'k-i-folder',
            level: x.level,
            selected: false,
            children: x.children,
            expanded: false,
          };
          return item;
        });
        grupo.expanded
          ? this.addChildren(subGrupoModulo)
          : this.removeChildren(1, grupo);
        break;
      case 2:
        let subGrupo = ev.item;
        let subGrupoTemp: ISubGrupoModulo = this._sourceModulos
          .find((x) => x.idGrupo == subGrupo.idGrupo)
          .subGrupoModulo.find(
            (y) => y.idModuloSistemaTipo == subGrupo.idModuloSistemaTipo
          );
        subGrupo.icon = !subGrupo.expanded ? 'k-i-folder-open' : 'k-i-folder';
        let modulos = subGrupoTemp.modulos.map((x) => {
          let item = {
            idGrupo: x.idGrupo,
            idModuloSistemaTipo: x.idModuloSistemaTipo,
            idModulo: x.idModulo,
            nombreModulo: x.nombreModulo,
            url: x.url,
            text: x.nombreModulo,
            icon: '',
            level: x.level,
            selected: false,
            expanded: false,
          };
          return item;
        });
        subGrupo.expanded = !subGrupo.expanded;
        subGrupo.expanded
          ? this.addChildren(modulos)
          : this.removeChildren(2, subGrupo);
        break;
      case 3:
        this.drawerToggle();
        if (ev.item.url) {
          this._router.navigate([ev.item.url]);
          this._titleService.setTitle(ev.item.text);
        }
        break;
      default:
        break;
    }
  }
  private addChildren(children: Array<any>): void {
    console.log(children);
    this.itemsModulos.splice(this._itemIndex + 1, 0, ...children);
  }
  private removeChildren(level: number, item: any): void {
    if (level == 1) {
      let filtro = this.itemsModulos.filter(
        (e) => e.level != level && e.idGrupo == item.idGrupo
      );
      let dataFinal: any[] = [];
      this.itemsModulos.forEach((e) => {
        let index = filtro.findIndex((x) => x == e);
        if (index == -1) {
          dataFinal.push(e);
        }
      });
      this.itemsModulos = dataFinal;
    }
    if (level == 2) {
      let filtro = this.itemsModulos.filter(
        (e) =>
          e.level != level && e.idModuloSistemaTipo == item.idModuloSistemaTipo
      );
      let dataFinal: any[] = [];
      this.itemsModulos.forEach((e) => {
        let index = filtro.findIndex((x) => x == e);
        if (index == -1) {
          dataFinal.push(e);
        }
      });
      this.itemsModulos = dataFinal;
    }
  }
  drawerToggle() {
    console.log(this.itemsModulos);
    this.toggle = !this.toggle;
    if (this.toggle == true) {
      this.flexBasis = 'flex-basis: 270px;';
    } else {
      this.flexBasis = 'flex-basis: 0px;';
    }
  }
  cerrarSesion() {
    this._crmService.mantenerMarcadorAutomatico();
    this._router.navigate(['/IniciarSesion']);
  }
  iniciarRingover(){
    this._ringoverSDKService.iniciarRingover();
  }
  toggleRingover(){
    try{
      this._ringoverSDKService.toggle();
    }catch{
    }
  }
  get checkStatusRingover(){
    return this._ringoverSDKService.checkStatus();
  }

 
  private inicializarMarcacion(): void {
    const userName = this._userService.userName;
    if (userName) {
      this._marcacionPersonalService.inicializarMarcacion(userName);
    }
  }

  /**
   * Inserta una marcación del personal
   * @param tipoMarcacion Tipo de marcación (1: Ingreso, 2: Salida Almuerzo, 3: Llegada Almuerzo, 4: Salida)
   */
  insertarMarcacion(tipoMarcacion: TipoMarcacion): void {
    const userName = this._userService.userName;
    if (userName) {
      this._marcacionPersonalService.insertarMarcacion(userName, tipoMarcacion);
    }
  }
}
