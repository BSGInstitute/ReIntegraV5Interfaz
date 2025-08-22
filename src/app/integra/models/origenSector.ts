import { KendoGrid } from '@shared/models/kendo-grid';
export interface ObtenerAsignacionOrigen{

    contadorConfigurado: number,
    contadorNoConfigurado: number,
    listaOrigenSectorConfigurado:[
      {idProveedorCampaniaIntegra:number,
        nombre:string,
      }
    ]
    listaOrigenSectorNoConfigurado:[
      {idProveedorCampaniaIntegra:number,
        nombre:string,
      }
    ]
}


export interface ObtenerOrigenSector{
  contadorCambios: number ,
  id: number,
  nombre: string,
  descripcion:string ,
  orden: number,
  cantidadOportunidad: number,
  esAgrupado: boolean,
  categoriaOrigenSector?: ICategoriaOrigenSector
  footer?: {
            datosCalidad: boolean,
            muyAltaAd: boolean,
            muyAltaAr: boolean,
            altaAd: boolean,
            altaAr: boolean,
            mediaAd: boolean,
            mediaAr: boolean,
  } | any
  grid?: KendoGrid
}

export interface ICategoriaOrigenSector{
  origenDatoCalidadDetalleIndividual: {
    idOrigenDatoCalidad: number,
    idCategoriaOrigen: number,
    nombre: string,
    datosCalidad: boolean,
    muyAltaAr: boolean,
    muyAltaAd: boolean,
    altaAd: boolean,
    altaAr: boolean,
    mediaAd: boolean,
    mediaAr: boolean
  }[],
  origenDatoCalidadDetalleAgrupado:
    {
      nombreCantidadAgrupadoVarDTO:
        {
          nombre: string,
          cantidadAgrupados:number,
        }

      ,
      listaOrigenesAgrupado:
        {
          datosCalidad: boolean,
          muyAltaAr: boolean,
          muyAltaAd: boolean,
          altaAd: boolean,
          altaAr: boolean,
          mediaAd: boolean,
          mediaAr: boolean
          agruparCategoriaOrigen: boolean

        }
    }
}
export interface ImodificarConfiguracion{
  esAgrupado: boolean,
  idorigenSector: number,
  idCategoriaOrigen: number,
  idOrigenDatoCalidad: number,
  datosCalidad: false,
  datoCalidadWhatsapp:boolean,
  datoCalidadMailing:boolean,
  nombre: string,
  muyAltaAd: true,
  muyAltaAr: true,
  altaAd: false,
  altaAr: true,
  mediaAd: false,
  mediaAr: true,
}
export interface ICrearSector{
  nombre: string,
  descripcion: string,
  listaProveedorCamapaniaIntegra: {
    IdProveedorCampaniaIntegra:number
  }[],
  ListaCategoriaOrigenIndividual:{
    idCategoriaOrigen:number,
  }[],
  ListaCategoriaOrigenAgrupado:{
    idCategoriaOrigen:number,
  }[],
  usuarioCreacion: string,
  usuarioModificacion: string,
}


export interface IModificarSector{
  id:number,
  nombre: string,
  descripcion: string,
  listaProveedorCamapaniaIntegra: {
    IdProveedorCampaniaIntegra:number
  }[],
  ListaCategoriaOrigenIndividual:{
    idCategoriaOrigen:number,
  }[],
  ListaCategoriaOrigenAgrupado:{
    idCategoriaOrigen:number,
  }[],
  usuarioCreacion: string,
  usuarioModificacion: string,
}


export interface listaActualizarConfiguracionIndividual{
  idorigendatoCalidad :number,
  DatosCalidad :boolean,
  DatoCalidadWhatsapp:boolean,
  DatoCalidadMailing:boolean,
  MuyAltaAr:boolean,
  MuyAltaAd :boolean,
  AltaAd :boolean,
  AltaAr :boolean,
  MediaAd :boolean,
  MediaAr :boolean,
  UsuarioModificacion :string,
}

export interface listaActualizarConfiguracionAgrupada{

  IdOrigenSector :number ,
  DatosCalidad :boolean ,
  DatoCalidadWhatsapp:boolean,
  DatoCalidadMailing:boolean,
  MuyAltaAr:boolean ,
  MuyAltaAd :boolean ,
  AltaAd :boolean ,
  AltaAr :boolean ,
  MediaAd :boolean ,
  MediaAr :boolean ,
  UsuarioModificacion :string ,
  }
export interface listaBloquePorProgramaCritico{

    idGrupoFiltroProgramaCritico :number ,
    nombre :string ,
    cantidadConfiguraciones:number,
    grid: KendoGrid
    dataOriginal: any[],
    Errores :string [],
    ListaProgramasGenerales:string[],
  }
  export interface listaBloqueConfiguracionOtrosProgramasGenerales{

    idGrupoFiltroProgramaCritico :number ,
    nombre :string ,
    cantidadConfiguraciones:number,
    grid: KendoGrid,
    dataOriginal: any[],

  }

  export interface ListaBloqueProgramasOtrasAreas{

    idGrupoFiltroProgramaCritico :number ,
    nombre :string ,
    cantidadConfiguraciones:number,
    grid: KendoGrid

  }

  export interface SumatoriaPorAsesor {
    IdAsignacionRegular:number ,
    CodigoProgramaGeneral:string ,
    NombreAsesor:string ,
    IndividualProporcionPeru:number ,
    IndividualProporcionColombia:number ,
    IndividualProporcionMexico:number ,
    IndividualProporcionBolivia:number ,
    IndividualProporcionChile:number ,
    IndividualProporcionInternacional:number ,
  };
  export interface SumatoriaPorConfiguracionDeAsesor {
    IdAsignacionRegular:number ,
    ProporcionPeru:number ,
    ProporcionColombia:number ,
    ProporcionMexico:number ,
    ProporcionBolivia:number ,
    ProporcionChile:number ,
    ProporcionInternacional:number ,
  };
  export interface SumaadorPorProgramaGeneral {
    Codigo:string ,
    SumaProporcionPeru:number ,
    SumaProporcionColombia:number ,
    SumaProporcionMexico:number ,
    SumaProporcionBolivia:number ,
    SumaProporcionChile:number ,
    SumaProporcionInternacional:number ,
  };

  export interface listaConfiguracionPorProgramaCritico{

    id :number ,
    idGrupoFiltroProgramaCritico :number ,
    codigo :number ,
    prioridad :number ,
    coordinador :number ,
    asesor :number ,


    aplicaProporcionPorPais: boolean,
    esLimiteCola :number ,
    limiteCola :number ,
    porcentajeTolerancia :number ,

    IdPeru :number ,
    EsProporcionManualPeru :boolean ,
    ProporcionManualPeru :number ,
    ProporcionPorPaisPeru :number ,

    IdColombia: number ,
    EsProporcionManualColombia: boolean ,
    ProporcionManualColombia: number ,
    ProporcionPorPaisColombia: number ,

    IdMexico: number ,
    EsProporcionManualMexico: boolean ,
    ProporcionManualMexico: number ,
    ProporcionPorPaisMexico: number ,

		IdBolivia: number ,
    EsProporcionManualBolivia: boolean ,
    ProporcionManualBolivia: number ,
    ProporcionPorPaisBolivia: number ,

    IdChile: number ,
    EsProporcionManualChile: boolean ,
    ProporcionManualChile: number ,
    ProporcionPorPaisChile: number ,

		IdInternacional: number ,
    EsProporcionManualInternacional: boolean ,
    ProporcionManualInternacional: number ,
    ProporcionPorPaisInternacional: number ,


    }
    export interface errorPersonalizado{
      error: string;
      message: string;
    }


    export interface listaBloqueProgramaGeneral{

      IdProgramaGeneral :number ,
      Codigo :string ,
    }

    export interface ComboBusqueda{

      comboProgramaCritico :ComboProgramaCritico [],
      comboProgramaGeneral :ComboProgramaGeneral [],
      comboAsesor :ComboAsesor[] ,
      comboCoordinador :ComboCoordinador [],
    }
    export interface ComboProgramaCritico{

      idGrupoFiltroProgramaCritico :number ,
      nombre :string ,
    }
    export interface ComboProgramaGeneral{

      idProgramaGeneral :number ,
      codigo :string ,
    }
    export interface ComboAsesor{

      idPersonal :number ,
      nombres :string ,
    }
    export interface ComboCoordinador{

      idPersonalJefe :number ,
      nombresJefe :string ,
    }
    export interface ListaAtributosBusqueda{

      idProgramasGeneral :number ,
      idGrupoFiltroProgramaCritico :number ,
      idAsesor :number ,
      idCoordinador :number ,
    }
    export interface ComboAsesores{
      id :number ,
      asesor :string ,
    }
    export interface ComboProgramaGeneral{
      idProgramaGeneral :number ,
      codigo :string ,
    }
    export interface ComboCategoriaOrigenSector{
      id :number ,
      nombre :string ,
    }
    export interface ConfiguracionAsesor{

      id :number ,
      estadoAsesor :string ,
      coordinador :string ,
      asesor :string ,
      oportunidadesAbiertas :number  ,
      topeOportunidad :number ,
      activarAsignacionAutomatica :boolean ,

    }

    export interface listaConfiguracionPorProgramaCritico{

      // Id,
      // IdAsignacionRegular,
      // Codigo,
      // CantidadTotal,
      // CantidadTotalPeru,
      // DatoCalidadPeru,
      // DistribucionPeru,
      // CantidadTotalColombia,
      // DatoCalidadColombia,
      // DistribucionColombia,
      // CantidadTotalBolivia,
      // DatoCalidadBolivia,
      // DistribucionBolivia,
      // CantidadTotalMexico,
      // DatoCalidadMexico,
      // DistribucionMexico,
      // CantidadTotalInternacional,
      // DistribucionInternacional,
      // DatoCalidadInternacional


      }



