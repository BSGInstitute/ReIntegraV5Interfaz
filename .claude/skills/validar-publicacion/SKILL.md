---
name: validar-publicacion
description: >
  Sincroniza la rama actual (pull/push), levanta el proyecto Angular con serve,
  valida que compile sin errores, genera el build de produccion y registra el resultado
  en reporte-build.txt.
  Trigger: When user says "validar publicacion", "validar build", "preparar deploy",
  or invokes /validar-publicacion.
user_invocable: true
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Antes de publicar o deployar el proyecto
- Cuando el usuario quiere validar que el proyecto compila y buildea correctamente
- Cuando se invoca `/validar-publicacion`

## Workflow

Ejecutar estos pasos EN ORDEN. Si alguno falla, detener y reportar en `reporte-build.txt`.

### Paso 1 — Sincronizar rama

```bash
git pull origin <rama-actual>
git push origin <rama-actual>
```

- Detectar la rama actual con `git branch --show-current`
- Si hay conflictos en el pull, DETENERSE y notificar al usuario

### Paso 2 — Levantar el proyecto (serve)

```bash
node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng serve
```

- Si el puerto por defecto (4200) esta ocupado, usar otro puerto libre con `--port <puerto>`
- Esperar a que el proyecto compile completamente (buscar mensaje de compilacion exitosa en stdout)
- Si la compilacion falla, DETENERSE, registrar los errores en el reporte y notificar al usuario

### Paso 3 — Detener el serve

- Una vez confirmado que compila sin errores, detener el proceso de serve

### Paso 4 — Generar build de produccion

```bash
node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build
```

- Esperar a que el build termine completamente
- Capturar si fue exitoso o si hubo errores

### Paso 5 — Registrar resultado en reporte-build.txt

Escribir en el archivo `reporte-build.txt` en la raiz del proyecto:

- **NO sobreescribir** el contenido existente
- Agregar 2 saltos de linea despues del ultimo contenido
- Formato del reporte:

```
========================================
Fecha: YYYY-MM-DD HH:mm:ss
Rama: <nombre-de-rama>
Estado: EXITOSO | FALLIDO
Detalle: Build generado satisfactoriamente | <errores encontrados>
========================================
```

## Critical Rules

1. **Orden estricto**: No saltar pasos. Si un paso falla, no continuar al siguiente
2. **Puerto ocupado**: Si el puerto 4200 esta en uso, buscar uno libre automaticamente
3. **No sobreescribir reporte**: SIEMPRE append, nunca overwrite en `reporte-build.txt`
4. **Detener serve**: SIEMPRE matar el proceso de serve antes de pasar al build
5. **Errores completos**: Si el build falla, incluir los errores relevantes en el reporte

## Commands

```bash
# Detectar rama actual
git branch --show-current

# Sync
git pull origin <rama>
git push origin <rama>

# Serve
node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng serve
node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng serve --port 4201

# Build
node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build
```
