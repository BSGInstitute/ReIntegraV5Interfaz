export interface IComboBase1 {
  id: number;
  nombre: string;
}

export interface IComboBase2 {
  codigo: number;
  nombre: string;
}

export interface IClaveValor {
  clave: string;
  valor: string | boolean | number;
}

export interface IKendoGridState{
  skip: number;
  take: number;
}
