# Módulo de Calificación de ChatBot

Sistema para evaluar las interacciones del chatbot con los estudiantes.

## 🏗️ Arquitectura

### Principios SOLID Aplicados

**Single Responsibility Principle (SRP)**
- `ChatService`: Maneja únicamente las operaciones HTTP y gestión de estado
- `FilterService`: Responsable exclusivamente de la lógica de filtrado
- Cada componente tiene una única responsabilidad clara

**Open/Closed Principle (OCP)**
- Uso de interfaces y constantes que permiten extensión sin modificación
- Enums para estados que pueden extenderse

**Liskov Substitution Principle (LSP)**
- Interfaces bien definidas que garantizan contratos consistentes

**Interface Segregation Principle (ISP)**
- Interfaces específicas por funcionalidad (Student, Chat, Evaluation, FilterOptions)

**Dependency Inversion Principle (DIP)**
- Dependencias inyectadas mediante constructor
- Uso de abstracciones (Observable) en lugar de implementaciones concretas

## 📁 Estructura

```
calificacion-chat-bot/
├── models/
│   ├── interfaces.ts       # Definiciones de tipos
│   ├── constants.ts         # Constantes y enums
│   └── models.ts           # Barrel export
├── services/
│   ├── chat.service.ts     # Gestión de datos y API
│   └── filter.service.ts   # Lógica de filtrado
├── lista-alumno/
│   ├── lista-alumno.component.ts
│   ├── lista-alumno.component.html
│   └── lista-alumno.component.scss
├── chats-list/
│   ├── chats-list.component.ts
│   ├── chats-list.component.html
│   └── chats-list.component.scss
├── evaluation-form/
│   ├── evaluation-form.component.ts
│   ├── evaluation-form.component.html
│   └── evaluation-form.component.scss
└── registro-calificacion-chat-bot/
    ├── calificacion-chat-bot.component.ts
    ├── calificacion-chat-bot.component.html
    └── calificacion-chat-bot.component.scss
```

## 🔧 Servicios

### ChatService
**Responsabilidades:**
- Gestión del estado global (students$, chats$, filters$, loading$)
- Comunicación con API REST
- Manejo centralizado de errores HTTP

**Características:**
- Observables readonly para inmutabilidad
- Error handling robusto
- Loading state management
- Memory leak prevention con takeUntil

### FilterService
**Responsabilidades:**
- Aplicación de filtros a listas de estudiantes
- Lógica de búsqueda y filtrado

**Características:**
- Métodos privados para cada tipo de filtro
- Composición de filtros
- Código testeable y mantenible

## 🧩 Componentes

### ListaAlumnoComponent
Lista principal de estudiantes con capacidades de filtrado.

**Características:**
- Filtros en tiempo real
- Gestión de subscripciones con destroy$
- Uso de constantes para evitar magic numbers
- Readonly en inyecciones para prevenir reasignación

### ChatsListComponent
Muestra los chats de un estudiante específico.

**Características:**
- Navegación bidireccional
- Formateo de fechas consistente
- Estados visuales claros
- Memory leak prevention

### EvaluationFormComponent
Formulario reactivo para evaluar chats.

**Características:**
- Validaciones robustas
- Construcción modular del form
- Estados de carga
- Enums para ratings
- Feedback visual en errores

### CalificacionChatBotComponent (Contenedor)
Orquesta la navegación entre vistas.

**Características:**
- Gestión de estado local clara
- Métodos privados para operaciones internas
- Limpieza de estado en transiciones
- Refresh de datos tras evaluación

## 📊 Modelos

### Interfaces
```typescript
Student, Chat, Evaluation, EvaluationCriteria,
FilterOptions, RatingStatus
```

### Enums
```typescript
ViewState: Navegación entre pantallas
RatingLevel: Niveles de calificación (1-5)
```

### Constants
```typescript
RATING_LABELS: Etiquetas de calificación
CRITERIA_LABELS: Etiquetas de criterios
STATUS_COLORS: Colores de estados
RATING_THRESHOLDS: Umbrales de calificación
DATE_FORMAT_OPTIONS: Formato de fechas
```

## 🔄 Flujo de Datos

1. **Carga Inicial**: ChatService obtiene estudiantes
2. **Filtrado**: FilterService procesa filtros localmente
3. **Selección**: Usuario navega Student → Chat → Evaluation
4. **Evaluación**: Submit → API → Refresh → Navigate back
5. **Cleanup**: Subscripciones se limpian automáticamente

## 🎯 Buenas Prácticas Implementadas

### TypeScript
- Uso de `readonly` para prevenir mutaciones
- Tipos explícitos en parámetros y retornos
- Enums en lugar de strings literals
- Interfaces segregadas

### RxJS
- `takeUntil` para prevenir memory leaks
- `finalize` para cleanup operations
- `shareReplay` para compartir observables
- `tap` para side effects

### Angular
- OnDestroy implementado consistentemente
- ChangeDetection optimizado
- Dependency Injection con readonly
- Event Emitters tipados

### Clean Code
- Nombres descriptivos
- Métodos pequeños y focalizados
- Constantes extraídas
- Magic numbers eliminados
- Sin lógica en templates

## 🌐 API Endpoints

```typescript
GET  /api/chats/students              // Lista consolidada
GET  /api/chats/students/:id/chats    // Chats por alumno
POST /api/chats/evaluations           // Enviar evaluación
```

## ⚙️ Configuración

### Module Setup
```typescript
declarations: [
  CalificacionChatBotComponent,
  ListaAlumnoComponent,
  ChatsListComponent,
  EvaluationFormComponent
]
```

### Services
Ambos servicios usan `providedIn: 'root'` para singleton pattern.

## 🔒 Gestión de Memoria

Todos los componentes implementan:
```typescript
private readonly destroy$ = new Subject<void>();

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## 📝 Manejo de Errores

```typescript
private handleError(error: HttpErrorResponse): Observable<never> {
  // Log detallado
  // Mensaje user-friendly
  // Propagación del error
}
```

## 🎨 Estilos

- BEM methodology
- SCSS con nesting
- Variables reutilizables
- Responsive design
- Consistent spacing

## 🧪 Testabilidad

Diseño preparado para:
- Unit tests (servicios con métodos públicos pequeños)
- Integration tests (componentes con IoC)
- E2E tests (selectores semánticos)

## 📈 Escalabilidad

Estructura preparada para:
- Añadir nuevos filtros
- Nuevos criterios de evaluación
- Internacionalización
- Roles y permisos
- Analytics
