# Predicciones extra en el admin

Implementación del 14/10/2026 en `codex/morePredictions`, desde `master`
(commit `536ba91ffd679bb8a43a9cc5d6b09dbce5dde943`).

## Uso

1. En Carreras, crear o editar una carrera todavía no abierta.
2. Seleccionar los pilotos de la carrera. Habilitar los extras deseados:
   - Pole: puntos por acertar el ganador de clasificación.
   - Duelo: exactamente dos pilotos de la carrera.
   - Safety Car: no incluye VSC.
3. Indicar puntos enteros positivos y un cierre para cada extra, no posterior a
   la carrera. Los horarios del formulario son locales y se envían en ISO con zona.
4. Opcionalmente activar confianza: duplica los puntos de un extra elegido por
   el usuario; su selección cierra con el primer extra.
5. Abrir pronósticos desde el listado. La confirmación recuerda que se congelan
   pilotos, fecha, cierres, puntos, extras y confianza. Nombre y circuito siguen editables.
6. En Resultados extra, resolver o anular cada extra después de su cierre.
   Cada botón guarda únicamente ese resultado. Safety Car admite Sí/No booleanos.
   Se pueden corregir resultados mientras la carrera siga en lista.
7. Cerrar carrera después de su inicio, con plazos vencidos y todos los extras
   habilitados resueltos o anulados. Completar clasificación, sin pilotos ni puestos
   repetidos, y confirmar para sumar puntos. El cierre no permite recalcular.

Las carreras históricas sin extras conservan el flujo de clasificación. Las carreras
procesadas muestran resultados en modo consulta. Ante fallos de escritura en edición,
resultados o cierre, el diálogo impide repetir y vuelve al listado actualizado.

## Organización

Bajo `src/app/pages/races`:

- `components/race-form`: formulario compartido de creación y edición.
- `components/race-extras-config`: controles de extras y confianza.
- `components/race-extra-results`: diálogo independiente de resultados.
- `components/race-extras-summary`: resumen reutilizado en listado y cierre.
- `components/create-race` y `edit-race`: coordinan guardado.
- `components/list-races-component`: listado, activación y apertura de diálogos.
- `components/close-race`: clasificación y cierre.
- `race-form.utils.ts`: construcción del formulario, fechas, payloads y validaciones.

Se mantienen ReactiveForms, Material, RacesService y refresco por RxJS del proyecto.
No hay nuevas dependencias, store global ni cambios de infraestructura.

## Contrato HTTP

- POST `/api/race`: datos habituales, `extras`, `confidenceEnabled`.
- PATCH `/api/race/:id`: configuración antes de abrir; sólo nombre/circuito
  desde el formulario de edición si las reglas ya están bloqueadas.
- PUT `/api/race/:id/extras/results`: `{extraResults: {clave: {status, value?}}}`.
- PUT `/api/race/:id/close`: `{result: [{pilot, position}]}`, con extras ya guardados.

La API sigue siendo la autoridad sobre plazos, estado y puntuación. La documentación
completa del backend está en `../APi/docs/prediction-extras.md`.

## Verificación

```powershell
npm.cmd run build
npm.cmd run test:race-extras
```

Las pruebas usan datos locales y HTTP simulado. Cubren reglas, fechas, confianza,
duelos, payloads, formularios, resultados false/anulados y restricciones de cierre.

La suite focalizada usa `tsconfig.race-extras.spec.json` porque los specs previos de
EditRace y Alert tienen imports que no existen en sus componentes. Esos problemas
preexistentes no se modificaron en esta funcionalidad.

Para una prueba manual usar una API de desarrollo con la nueva funcionalidad. La
configuración actual de GlobalService apunta a producción; esta implementación
no cambia ese destino ni prueba escrituras sobre producción.
