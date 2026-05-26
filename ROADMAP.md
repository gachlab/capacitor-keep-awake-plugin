# Roadmap — @gachlab/capacitor-keep-awake-plugin

**Contexto:** Mantiene la pantalla encendida (Android `FLAG_KEEP_SCREEN_ON`, iOS `isIdleTimerDisabled`, Web Screen Wake Lock API). Plugin pequeño y estable; el roadmap es sobre higiene y observabilidad, no sobre features grandes.

**Estado actual:** v3.0.2 — las 3 plataformas completas, con tests unitarios. Bump a AGP 9.2.1 / Gradle 9.5.1 mergeado pero **sin release npm** todavía.

---

## Fase 0 — Higiene de release

- Consolidar las ramas de mantenimiento pendientes en la rama default y dejarla como HEAD.
- Eliminar `TODO-AGP-PROGUARD.md` (ya resuelto en v3.0.2).
- Decidir si el bump AGP 9 sale como `3.0.3` ahora o se acompaña con el próximo cambio funcional.

## Fase 1 — Feedback de fallo

Hoy en Web, si el navegador niega o revoca el wake lock (batería baja, pestaña oculta), el lock se pierde **en silencio** y el consumidor no se entera.

- Nuevo evento: `wakeLockReleased { reason: 'browser' | 'visibility' | 'system', timestamp: number }`.
- Emitirlo también en Android/iOS si el sistema rompe el lock.
- Mantener `isKeepAwake()` como verdad consultable.

## Fase 2 — Observabilidad / telemetría

Para consumidores que auditan el estado del dispositivo, exponer el historial de roturas de lock como eventos con `timestamp`. El **reporte** de esos eventos lo decide el consumidor (emisión a JS); para reporte confiable en background ver el plugin `event-sink` del ecosistema.

---

## Fuera de alcance (a propósito)

- **Partial wake lock** (CPU viva con pantalla apagada): es territorio de un foreground service de geolocalización en background, no de este plugin. Mantener el alcance en "pantalla viva".

## Notas de plataforma

- Web: el wake lock es best-effort; documentar navegadores sin soporte.
- iOS/Android: el lock es firme mientras la actividad/escena viva.
