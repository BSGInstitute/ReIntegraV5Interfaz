-- DRY RUN: Do not execute. Review before applying.
-- Change   : rename-casos-exito-mkt / SP_T_AlumnoCasoExito_ActualizarPosiciones
-- Date     : 2026-05-26
-- Author   : [Nombre del responsable]
-- Risk     : low

/**
 * NOTA: Este SP utiliza OPENJSON para parsear el JSON de posiciones.
 * Requiere nivel de compatibilidad de base de datos >= 130 (SQL Server 2016+).
 * Verificar con: SELECT compatibility_level FROM sys.databases WHERE name = DB_NAME()
 * Si el nivel es inferior a 130, ejecutar primero:
 *   ALTER DATABASE [NombreDB] SET COMPATIBILITY_LEVEL = 130;
 */

IF EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_ActualizarPosiciones]')
      AND type IN (N'P', N'PC')
)
BEGIN
    DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ActualizarPosiciones];
    PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_ActualizarPosiciones] eliminado para recreacion.';
END
GO
/**
=============================================
Author: [Nombre del responsable]
Fecha Creacion: 2026-05-26
Descripcion: Actualiza el orden de posicion de multiples casos de exito en una
             sola operacion a partir de un JSON con los nuevos valores.
             Solo actualiza registros activos (Estado = 1).
             La fecha de modificacion se actualiza automaticamente con GETDATE().
Parametros entrada:
  @JsonPosiciones      NVARCHAR(MAX) - JSON con array de objetos {Id, Posicion}.
                                       Ejemplo: '[{"Id":1,"Posicion":3},{"Id":2,"Posicion":1}]'
  @UsuarioModificacion VARCHAR(50)   - Usuario que realiza la operacion
Excepciones: Ninguna declarada; errores de parseo JSON propagados por el motor.
Retorna: Nada (SET NOCOUNT ON)
Version: 1.0
Compatibilidad: Requiere nivel de compatibilidad >= 130 (OPENJSON)
Ejemplo Validacion:
  EXEC [mkt].[SP_T_AlumnoCasoExito_ActualizarPosiciones]
      @JsonPosiciones = '[{"Id":1,"Posicion":2},{"Id":3,"Posicion":1}]',
      @UsuarioModificacion = 'admin'
=============================================
*/
CREATE PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ActualizarPosiciones]
    @JsonPosiciones      NVARCHAR(MAX),
    @UsuarioModificacion VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE ACE
    SET
        ACE.Posicion            = JP.Posicion,
        ACE.UsuarioModificacion = @UsuarioModificacion,
        ACE.FechaModificacion   = GETDATE()
    FROM
        [mkt].[T_AlumnoCasoExito] ACE
        INNER JOIN OPENJSON(@JsonPosiciones)
            WITH (
                Id       INT 'strict $.Id',
                Posicion INT 'strict $.Posicion'
            ) AS JP ON JP.Id = ACE.Id
    WHERE
        ACE.Estado = 1;
END
GO

PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_ActualizarPosiciones] creado correctamente.';
GO

/**
 * ROLLBACK — Descomentar y revisar antes de ejecutar.
 * Verificar dependencias antes de ejecutar en produccion.
 *
 * IF EXISTS (
 *     SELECT 1 FROM sys.objects
 *     WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_ActualizarPosiciones]')
 *       AND type IN (N'P', N'PC')
 * )
 *     DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ActualizarPosiciones];
 *
 * PRINT 'ROLLBACK completado: SP [mkt].[SP_T_AlumnoCasoExito_ActualizarPosiciones] eliminado.';
 */
