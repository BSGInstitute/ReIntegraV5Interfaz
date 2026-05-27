-- DRY RUN: Do not execute. Review before applying.
-- Change   : rename-casos-exito-mkt / SP_T_AlumnoCasoExito_Eliminar
-- Date     : 2026-05-26
-- Author   : [Nombre del responsable]
-- Risk     : low

IF EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_Eliminar]')
      AND type IN (N'P', N'PC')
)
BEGIN
    DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_Eliminar];
    PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_Eliminar] eliminado para recreacion.';
END
GO
/**
=============================================
Author: [Nombre del responsable]
Fecha Creacion: 2026-05-26
Descripcion: Realiza la eliminacion logica de un caso de exito estableciendo
             Estado = 0. No se realiza eliminacion fisica del registro.
             La fecha de modificacion se actualiza automaticamente con GETDATE().
Parametros entrada:
  @Id                  INT         - Identificador del registro a eliminar
  @UsuarioModificacion VARCHAR(50) - Usuario que realiza la operacion
Excepciones: Ninguna
Retorna: Nada (SET NOCOUNT ON)
Version: 1.0
Ejemplo Validacion:
  EXEC [mkt].[SP_T_AlumnoCasoExito_Eliminar] @Id = 1, @UsuarioModificacion = 'admin'
-- =============================================
*/
CREATE PROCEDURE [mkt].[SP_T_AlumnoCasoExito_Eliminar]
    @Id                  INT,
    @UsuarioModificacion VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [mkt].[T_AlumnoCasoExito]
    SET
        Estado              = 0,
        UsuarioModificacion = @UsuarioModificacion,
        FechaModificacion   = GETDATE()
    WHERE
        Id = @Id;
END
GO

PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_Eliminar] creado correctamente.';
GO

/**
 * ROLLBACK — Descomentar y revisar antes de ejecutar.
 * Verificar dependencias antes de ejecutar en produccion.
 *
 * IF EXISTS (
 *     SELECT 1 FROM sys.objects
 *     WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_Eliminar]')
 *       AND type IN (N'P', N'PC')
 * )
 *     DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_Eliminar];
 *
 * PRINT 'ROLLBACK completado: SP [mkt].[SP_T_AlumnoCasoExito_Eliminar] eliminado.';
 */
