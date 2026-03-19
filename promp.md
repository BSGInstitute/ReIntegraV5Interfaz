Revisa el archivo src\app\integra\areas\planificacion\coordinacion-docentes\gestion-academica 
Implementa en mi proyecto una funcionalidad para obtener el catálogo completo de PEspecíficos usando la misma arquitectura y lógica del Controller principal existente.

Requisitos:
- Seguir exactamente el patrón actual de Controller + Service + Repository
- Reutilizar la misma estructura de respuestas, manejo de errores, rutas, DTOs, interfaces e inyección de dependencias
- No crear una arquitectura nueva
- Yo crearé personalmente el Stored Procedure en SQL Server
- No debes generarlo, solo debes usarlo desde el Repository
- Crear método en Repository para consumir el SP existente
- Crear método en Service
- Crear endpoint GET en Controller respetando la convención real del proyecto
- El endpoint debe traer todo una sola vez
- No implementar búsqueda por texto en backend
- La búsqueda se hará localmente en frontend/memoria
- Entregar también ejemplo de consumo en frontend con cache local:
  - cargar una sola vez
  - guardar en memoria
  - filtrar localmente al escribir
  - iniciar filtrado desde 3 letras
  - mostrar hasta 1000 resultados
- No traer columnas innecesarias
- No hacer joins innecesarios
- Genera el código completo listo para integrar:
  - DTO
  - IRepository
  - Repository usando el SP existente
  - IService
  - Service
  - Controller
  - configuración de DI si aplica
  - ejemplo de consumo frontend con cache
- Antes de escribir el código, revisa el Controller principal y replica exactamente su patrón. 
toda esta logica ira en el pEspecifico en el dropdown list que cambiara a lo que te pedi y servicios esta el ServiciosV5\IntegraV5Servicios que esta fuera de InterfazV5\IntegraV5Interfaz fuera de este proyecto de front 