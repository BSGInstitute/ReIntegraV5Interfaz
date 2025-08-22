import { NumberSymbol } from "@angular/common";

export interface TagsEstilo {
    id: number;
    idTag: number;
    idEstilo:number;
    valor: string; 
  }

  export interface TagsEstiloCrear{
    id: number;
    idTag: number;
    idEstilo:number;
    valor: string;
  }

  export interface TagsEstiloEnvio{
    id: number;
    idTag: number;
    idEstilo:number;
    valor: string;
    usuario:string;
  }
  export interface FormularioStilo{
    id: number;
    idFormulario: number;
    clave: 'button-guardar';
    styles: 'background';
    class: 'btn-sm btn-md-outline btn primery';
    valor: 'Guardar';
    width: '';
  }
  export interface FormularioStilo{
    id: number;
    idFormulario: number;
    clave: 'button-guardar';
    styles: 'background';
    class: 'btn-sm btn-md-outline btn primery';
    valor: 'Guardar';
    width: '';
  }
  export interface Formularios{
    id: number;
    nombre:number;
    categoria: number
  }