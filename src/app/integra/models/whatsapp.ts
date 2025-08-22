export interface Dias {
    id:number;
    responsable: string;
    dia1: number;
    dia2: number;
    dia3: number;
    dia4: number;
    dia5: number;
    total: number;
  }
  
  export const DiasColumns = [
    {
      key: 'responsable',
      type: 'responsable',
      label: 'responsable',
    },
    {
      key: 'dia1',
      type: 'dia1',
      label: 'dia1',
    },
    {
        key: 'dia2',
        type: 'dia2',
        label: 'dia2',
      },
      {
        key: 'dia3',
        type: 'dia3',
        label: 'dia3',
      },
      {
        key: 'dia4',
        type: 'dia4',
        label: 'dia4',
      },
      {
        key: 'dia5',
        type: 'dia5',
        label: 'dia5',
      },
      {
        key: 'total',
        type: 'total',
        label: 'total',
      },
  ];