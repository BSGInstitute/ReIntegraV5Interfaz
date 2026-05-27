-- DRY RUN: Do not execute. Review before applying.
-- Change   : rename-casos-exito-mkt / SP_T_AlumnoCasoExito_ObtenerCombo
-- Date     : 2026-05-26
-- Author   : [Nombre del responsable]
-- Risk     : low

IF EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_ObtenerCombo]')
      AND type IN (N'P', N'PC')
)
BEGIN
    DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ObtenerCombo];
    PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_ObtenerCombo] eliminado para recreacion.';
END
GO

/**
 =============================================
 Author: [Nombre del responsable]
 Fecha Creacion: 2026-05-26
 Descripcion: Retorna Id y NombreAlumno de los casos de exito activos y visibles,
              para uso en controles de seleccion (combo/dropdown).
 Parametros entrada: Ninguno
 Excepciones: Ninguna
 Retorna: Id, NombreAlumno de registros con Estado=1 y EstadoVisibilidad=1
 Version: 1.0
 Ejemplo Validacion: EXEC [mkt].[SP_T_AlumnoCasoExito_ObtenerCombo]
 =============================================
*/

CREATE PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ObtenerCombo]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ACE.Id,
        ACE.NombreAlumno
    FROM
        [mkt].[T_AlumnoCasoExito] ACE
    WHERE
        ACE.Estado = 1
        AND ACE.EstadoVisibilidad = 1
    ORDER BY
        ACE.Posicion ASC;
END
GO

PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_ObtenerCombo] creado correctamente.';
GO

/**
 * ROLLBACK — Descomentar y revisar antes de ejecutar.
 * Verificar dependencias antes de ejecutar en produccion.
 *
 * IF EXISTS (
 *     SELECT 1 FROM sys.objects
 *     WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_ObtenerCombo]')
 *       AND type IN (N'P', N'PC')
 * )
 *     DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ObtenerCombo];
 *
 * PRINT 'ROLLBACK completado: SP [mkt].[SP_T_AlumnoCasoExito_ObtenerCombo] eliminado.';
 */
