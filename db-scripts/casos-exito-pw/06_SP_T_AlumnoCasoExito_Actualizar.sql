-- DRY RUN: Do not execute. Review before applying.
-- Change   : rename-casos-exito-mkt / SP_T_AlumnoCasoExito_Actualizar
-- Date     : 2026-05-26
-- Author   : [Nombre del responsable]
-- Risk     : low

IF EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_Actualizar]')
      AND type IN (N'P', N'PC')
)
BEGIN
    DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_Actualizar];
    PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_Actualizar] eliminado para recreacion.';
END
GO
/**
=============================================
Author: [Nombre del responsable]
Fecha Creacion: 2026-05-26
Descripcion: Actualiza los campos editables de un caso de exito existente
             identificado por su Id. La fecha de modificacion se actualiza
             automaticamente con GETDATE().
Parametros entrada:
  @Id                  INT          - Identificador del registro a actualizar
  @NombreAlumno        VARCHAR(150) - Nombre completo del alumno
  @NombrePrograma      VARCHAR(300) - Nombre del programa academico
  @FotoPerfil          VARCHAR(150) - Nombre del archivo de foto (nullable)
  @FotoPerfilAlf       VARCHAR(150) - Nombre alfanumerico del archivo de foto (nullable)
  @Testimonio          VARCHAR(MAX) - Testimonio del alumno (nullable)
  @IdPais              INT          - FK hacia conf.T_Pais
  @Posicion            INT          - Orden de aparicion
  @EstadoVisibilidad   BIT          - Visibilidad en portal (1=Visible, 0=Oculto)
  @UsuarioModificacion VARCHAR(50)  - Usuario que realiza la modificacion
Excepciones: Ninguna
Retorna: Nada (SET NOCOUNT ON)
Version: 1.0
Ejemplo Validacion:
  EXEC [mkt].[SP_T_AlumnoCasoExito_Actualizar]
      @Id = 1, @NombreAlumno = 'Juan Perez Actualizado', @NombrePrograma = 'MBA Executive',
      @FotoPerfil = 'foto.jpg', @FotoPerfilAlf = 'fotojpg', @Testimonio = 'Muy buen programa',
      @IdPais = 2, @Posicion = 3, @EstadoVisibilidad = 1, @UsuarioModificacion = 'admin'
=============================================
*/

CREATE PROCEDURE [mkt].[SP_T_AlumnoCasoExito_Actualizar]
    @Id                  INT,
    @NombreAlumno        VARCHAR(150),
    @NombrePrograma      VARCHAR(300),
    @FotoPerfil          VARCHAR(150),
    @FotoPerfilAlf       VARCHAR(150),
    @Testimonio          VARCHAR(MAX),
    @IdPais              INT,
    @Posicion            INT,
    @EstadoVisibilidad   BIT,
    @UsuarioModificacion VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [mkt].[T_AlumnoCasoExito]
    SET
        NombreAlumno        = @NombreAlumno,
        NombrePrograma      = @NombrePrograma,
        FotoPerfil          = @FotoPerfil,
        FotoPerfilAlf       = @FotoPerfilAlf,
        Testimonio          = @Testimonio,
        IdPais              = @IdPais,
        Posicion            = @Posicion,
        EstadoVisibilidad   = @EstadoVisibilidad,
        UsuarioModificacion = @UsuarioModificacion,
        FechaModificacion   = GETDATE()
    WHERE
        Id = @Id;
END
GO

PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_Actualizar] creado correctamente.';
GO

/**
 * ROLLBACK — Descomentar y revisar antes de ejecutar.
 * Verificar dependencias antes de ejecutar en produccion.
 *
 * IF EXISTS (
 *     SELECT 1 FROM sys.objects
 *     WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_Actualizar]')
 *       AND type IN (N'P', N'PC')
 * )
 *     DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_Actualizar];
 *
 * PRINT 'ROLLBACK completado: SP [mkt].[SP_T_AlumnoCasoExito_Actualizar] eliminado.';
 */
