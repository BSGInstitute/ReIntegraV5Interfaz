-- DRY RUN: Do not execute. Review before applying.
-- Change   : rename-casos-exito-mkt / SP_T_AlumnoCasoExito_ActualizarVisibilidad
-- Date     : 2026-05-26
-- Author   : [Nombre del responsable]
-- Risk     : low

IF EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_ActualizarVisibilidad]')
      AND type IN (N'P', N'PC')
)
BEGIN
    DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ActualizarVisibilidad];
    PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_ActualizarVisibilidad] eliminado para recreacion.';
END
GO
/**
=============================================
Author: [Nombre del responsable]
Fecha Creacion: 2026-05-26
Descripcion: Actualiza el estado de visibilidad de un caso de exito en el portal web.
             Permite activar o desactivar la visibilidad sin modificar otros campos.
             La fecha de modificacion se actualiza automaticamente con GETDATE().
Parametros entrada:
  @Id                  INT         - Identificador del registro
  @EstadoVisibilidad   BIT         - Nuevo estado de visibilidad (1=Visible, 0=Oculto)
  @UsuarioModificacion VARCHAR(50) - Usuario que realiza la operacion
Excepciones: Ninguna
Retorna: Nada (SET NOCOUNT ON)
Version: 1.0
Ejemplo Validacion:
  EXEC [mkt].[SP_T_AlumnoCasoExito_ActualizarVisibilidad]
      @Id = 1, @EstadoVisibilidad = 0, @UsuarioModificacion = 'admin'
=============================================
*/
CREATE PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ActualizarVisibilidad]
    @Id                  INT,
    @EstadoVisibilidad   BIT,
    @UsuarioModificacion VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [mkt].[T_AlumnoCasoExito]
    SET
        EstadoVisibilidad   = @EstadoVisibilidad,
        UsuarioModificacion = @UsuarioModificacion,
        FechaModificacion   = GETDATE()
    WHERE
        Id = @Id;
END
GO

PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_ActualizarVisibilidad] creado correctamente.';
GO

/**
 * ROLLBACK — Descomentar y revisar antes de ejecutar.
 * Verificar dependencias antes de ejecutar en produccion.
 *
 * IF EXISTS (
 *     SELECT 1 FROM sys.objects
 *     WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_ActualizarVisibilidad]')
 *       AND type IN (N'P', N'PC')
 * )
 *     DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ActualizarVisibilidad];
 *
 * PRINT 'ROLLBACK completado: SP [mkt].[SP_T_AlumnoCasoExito_ActualizarVisibilidad] eliminado.';
 */
