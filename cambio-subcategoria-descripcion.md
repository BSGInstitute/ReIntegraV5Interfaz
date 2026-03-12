# Cambio: Invertir información SubCategoría / Descripción de la Subcategoría

## Fecha
2026-03-11

## Descripción
Se invirtieron los valores mostrados en los campos **SubCategoría** (dropdown) y **Descripción de la Subcategoría** (textbox) en los formularios de crear y editar solicitud del módulo de Gestión de Reclamos.

### Antes
| Campo | Valor mostrado |
|---|---|
| Dropdown SubCategoría | `nombre` |
| Textbox Descripción de la Subcategoría | `titulo` |

### Después
| Campo | Valor mostrado |
|---|---|
| Dropdown SubCategoría | `titulo` |
| Textbox Descripción de la Subcategoría | `nombre` |

## Archivos modificados

### `gestion-reclamos.component.html`
`src/app/integra/areas/operaciones/gestion-atencion-cliente/gestion-reclamos/gestion-reclamos.component.html`

- **Formulario Crear (~línea 483):** `textField="nombre"` → `textField="titulo"`
- **Formulario Crear (~línea 490):** `[defaultItem]="{nombre: 'Seleccione', id: null}"` → `[defaultItem]="{titulo: 'Seleccione', id: null}"`
- **Formulario Editar (~línea 834):** `textField="nombre"` → `textField="titulo"`
- **Formulario Editar (~línea 841):** `[defaultItem]="{nombre: 'Seleccione', id: null}"` → `[defaultItem]="{titulo: 'Seleccione', id: null}"`

### `gestion-reclamos.component.ts`
`src/app/integra/areas/operaciones/gestion-atencion-cliente/gestion-reclamos/gestion-reclamos.component.ts`

- **Método `SolicitudBySubCategoria` (~línea 583):** `this.tituloSubCategoria = this.dataSolicitudFiltro[0]?.titulo` → `this.dataSolicitudFiltro[0]?.nombre`
- **Método `SolicitudBySubCategoria2` (~línea 607):** `this.tituloSubCategoria = this.dataSolicitudFiltro[0]?.titulo` → `this.dataSolicitudFiltro[0]?.nombre`

## Impacto
- El dropdown de SubCategoría ahora muestra la descripción (`titulo`) para facilitar la selección del usuario.
- El textbox de solo lectura "Descripción de la Subcategoría" ahora muestra el nombre corto (`nombre`).
- Aplica tanto al formulario de **crear** como al de **editar** solicitud.
