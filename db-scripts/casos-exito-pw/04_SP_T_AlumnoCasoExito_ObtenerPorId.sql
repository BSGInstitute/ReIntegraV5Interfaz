-- DRY RUN: Do not execute. Review before applying.
-- Change   : rename-casos-exito-mkt / SP_T_AlumnoCasoExito_ObtenerPorId
-- Date     : 2026-05-26
-- Author   : [Nombre del responsable]
-- Risk     : low

IF EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_ObtenerPorId]')
      AND type IN (N'P', N'PC')
)
BEGIN
    DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ObtenerPorId];
    PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_ObtenerPorId] eliminado para recreacion.';
END
GO
/**
=============================================
Author: [Nombre del responsable]
Fecha Creacion: 2026-05-26
Descripcion: Retorna el detalle completo de un caso de exito por su Id,
             incluyendo el nombre del pais. No aplica filtro por Estado,
             permitiendo recuperar registros eliminados logicamente.
Parametros entrada: @Id INT - Identificador del caso de exito
Excepciones: Ninguna
Retorna: Fila unica con todos los campos de T_AlumnoCasoExito + NombrePais
Version: 1.0
Ejemplo Validacion: EXEC [mkt].[SP_T_AlumnoCasoExito_ObtenerPorId] @Id = 1
=============================================
*/
CREATE PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ObtenerPorId]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ACE.Id,
        ACE.NombreAlumno,
        ACE.NombrePrograma,
        ACE.FotoPerfil,
        ACE.FotoPerfilAlf,
        ACE.Testimonio,
        ACE.IdPais,
        P.NombrePais,
        ACE.Posicion,
        ACE.EstadoVisibilidad,
        ACE.Estado,
        ACE.UsuarioCreacion,
        ACE.UsuarioModificacion,
        ACE.FechaCreacion,
        ACE.FechaModificacion,
        ACE.RowVersion,
        ACE.IdMigracion
    FROM
        [mkt].[T_AlumnoCasoExito] ACE
        INNER JOIN [conf].[T_Pais] P ON P.Id = ACE.IdPais
    WHERE
        ACE.Id = @Id;
END
GO

PRINT 'SP [mkt].[SP_T_AlumnoCasoExito_ObtenerPorId] creado correctamente.';
GO

/**
 * ROLLBACK — Descomentar y revisar antes de ejecutar.
 * Verificar dependencias antes de ejecutar en produccion.
 *
 * IF EXISTS (
 *     SELECT 1 FROM sys.objects
 *     WHERE object_id = OBJECT_ID(N'[mkt].[SP_T_AlumnoCasoExito_ObtenerPorId]')
 *       AND type IN (N'P', N'PC')
 * )
 *     DROP PROCEDURE [mkt].[SP_T_AlumnoCasoExito_ObtenerPorId];
 *
 * PRINT 'ROLLBACK completado: SP [mkt].[SP_T_AlumnoCasoExito_ObtenerPorId] eliminado.';
 */
