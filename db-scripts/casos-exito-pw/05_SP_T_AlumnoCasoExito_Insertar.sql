-- DRY RUN: Do not execute. Review before applying.
-- Change   : rename-casos-exito-mkt / SP_T_AlumnoCasoExito_Insertar
-- Date     : 2026-05-26
-- Author   : [Nombre del responsable]
-- Risk     : low

IF EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_Insertar]')
      AND type IN (N'P', N'PC')
)
BEGIN
    DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_Insertar];
    PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_Insertar] eliminado para recreacion.';
END
GO
/**
=============================================
Author: [Nombre del responsable]
Fecha Creacion: 2026-05-26
Descripcion: Inserta un nuevo caso de exito de alumno en la tabla [mkt].[T_AlumnoCasoExito].
             El campo Estado se fija en 1 (activo) automaticamente.
             Las fechas de creacion y modificacion se establecen con GETDATE().
Parametros entrada:
  @NombreAlumno        VARCHAR(150) - Nombre completo del alumno
  @NombrePrograma      VARCHAR(300) - Nombre del programa academico
  @FotoPerfil          VARCHAR(150) - Nombre del archivo de foto (nullable)
  @FotoPerfilAlf       VARCHAR(150) - Nombre alfanumerico del archivo de foto (nullable)
  @Testimonio          VARCHAR(MAX) - Testimonio del alumno (nullable)
  @IdPais              INT          - FK hacia conf.T_Pais
  @Posicion            INT          - Orden de aparicion
  @EstadoVisibilidad   BIT          - Visibilidad en portal (1=Visible, 0=Oculto)
  @UsuarioCreacion     VARCHAR(50)  - Usuario que realiza la insercion
  @UsuarioModificacion VARCHAR(50)  - Usuario de ultima modificacion (igual a creacion en alta)
  @IdMigracion         UNIQUEIDENTIFIER - Id de migracion (nullable)
Excepciones: Ninguna
Retorna: Id del registro insertado
Version: 1.0
Ejemplo Validacion:
  EXEC [mkt].[SP_T_AlumnoCasoExito_Insertar]
      @NombreAlumno = 'Juan Perez', @NombrePrograma = 'MBA', @FotoPerfil = NULL,
      @FotoPerfilAlf = NULL, @Testimonio = 'Excelente programa',
      @IdPais = 1, @Posicion = 1, @EstadoVisibilidad = 1,
      @UsuarioCreacion = 'admin', @UsuarioModificacion = 'admin', @IdMigracion = NULL
=============================================

*/
CREATE PROCEDURE [mkt].[SP_T_AlumnoCasoExito_Insertar]
    @NombreAlumno        VARCHAR(150),
    @NombrePrograma      VARCHAR(300),
    @FotoPerfil          VARCHAR(150),
    @FotoPerfilAlf       VARCHAR(150),
    @Testimonio          VARCHAR(MAX),
    @IdPais              INT,
    @Posicion            INT,
    @EstadoVisibilidad   BIT,
    @UsuarioCreacion     VARCHAR(50),
    @UsuarioModificacion VARCHAR(50),
    @IdMigracion         UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [mkt].[T_AlumnoCasoExito] (
        NombreAlumno,
        NombrePrograma,
        FotoPerfil,
        FotoPerfilAlf,
        Testimonio,
        IdPais,
        Posicion,
        EstadoVisibilidad,
        Estado,
        UsuarioCreacion,
        UsuarioModificacion,
        FechaCreacion,
        FechaModificacion,
        IdMigracion
    )
    OUTPUT inserted.Id
    VALUES (
        @NombreAlumno,
        @NombrePrograma,
        @FotoPerfil,
        @FotoPerfilAlf,
        @Testimonio,
        @IdPais,
        @Posicion,
        @EstadoVisibilidad,
        1,
        @UsuarioCreacion,
        @UsuarioModificacion,
        GETDATE(),
        GETDATE(),
        @IdMigracion
    );
END
GO

PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_Insertar] creado correctamente.';
GO

/**
 * ROLLBACK — Descomentar y revisar antes de ejecutar.
 * Verificar dependencias antes de ejecutar en produccion.
 *
 * IF EXISTS (
 *     SELECT 1 FROM sys.objects
 *     WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_Insertar]')
 *       AND type IN (N'P', N'PC')
 * )
 *     DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_Insertar];
 *
 * PRINT 'ROLLBACK completado: SP [mkt].[SP_T_AlumnoCasoExito_Insertar] eliminado.';
 */
