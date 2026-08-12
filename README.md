# Evento 2026 — PWA + OneSignal

MVP en evolución: instalación como PWA, Web Push mediante OneSignal, diagnóstico con `?debug=1` y un prototipo navegable de las secciones principales del evento.

La instalación y Web Push ya fueron validados en Android y iPhone. El contenido actual de Programa, Speakers, Sponsors, Sede y Contacto es ficticio y sirve para probar navegación e interacción general.

## Archivos principales

```text
/
├── index.html
├── programa.html
├── speakers.html
├── mas.html
├── info.html
├── sponsors.html
├── contacto.html
├── app.css
├── app.js
├── manifest.json
├── pwa-sw.js
├── push/
│   └── onesignal/
│       └── OneSignalSDKWorker.js
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png
    └── apple-touch-icon.png
```

Se usan dos service workers con alcances separados:

- `pwa-sw.js` controla la aplicación y su instalación.
- `push/onesignal/OneSignalSDKWorker.js` recibe Web Push mediante OneSignal.

No mover ni renombrar el worker de OneSignal después de comenzar las pruebas con usuarios. Los navegadores conservan esa URL como parte de la suscripción.

## 1. Probar localmente

No abrir `index.html` directamente como archivo. Servir la carpeta desde `localhost`:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Abrir:

```text
http://127.0.0.1:4173/?debug=1
```

Para previsualizar la pantalla que verá la PWA instalada sin instalarla todavía:

```text
http://127.0.0.1:4173/?debug=1&standalone=1
```

La simulación sólo está habilitada cuando también se usa `debug=1`. No reemplaza una prueba de instalación real.

## 2. Publicar en GitHub Pages

La aplicación usa rutas relativas y detecta automáticamente su ruta base. Funciona en ambos formatos:

```text
https://krucho.github.io/
https://krucho.github.io/nombre-del-repositorio/
```

Pasos generales:

1. Subir estos archivos al repositorio.
2. En GitHub, abrir **Settings → Pages**.
3. En **Build and deployment**, elegir la rama y la carpeta raíz.
4. Esperar la publicación y abrir la URL HTTPS.
5. Si aparece la opción, activar **Enforce HTTPS**.

Si el repositorio se llama `krucho.github.io`, la aplicación se publica directamente en la raíz del dominio. Si tiene otro nombre, se publica en una subcarpeta. No hace falta modificar las rutas del proyecto.

## 3. Crear la aplicación en OneSignal

1. Crear una cuenta en [OneSignal](https://onesignal.com/).
2. Crear una aplicación nueva.
3. Agregar la plataforma **Web**.
4. Elegir la integración **Custom Code**.
5. En **Site URL**, escribir únicamente el origen de GitHub Pages:

   ```text
   https://krucho.github.io
   ```

   OneSignal no admite rutas en este campo. No agregar el nombre del repositorio.

6. No activar prompts automáticos: el proyecto solicita permiso sólo después de tocar **Activar notificaciones**.
7. El proyecto ya está configurado con el OneSignal App ID
   `f72f0f39-bdfb-4252-a101-9b6f40acf7a4`.

La ubicación y el alcance del worker se informan desde `OneSignal.init()` de forma dinámica. No es necesario acoplarlos manualmente a `/` o al nombre del repositorio.

La aplicación también establece su propia URL base como destino predeterminado
de las notificaciones. Para agenda y encuestas, cada mensaje deberá incluir una
Launch URL explícita con el deep link correspondiente.

## Prototipo de navegación

Las páginas internas comparten una navegación inferior y utilizan transiciones
entre documentos cuando el navegador las soporta. En navegadores sin soporte,
la navegación conserva el funcionamiento normal sin depender de la animación.

Deep link de prueba del programa:

```text
https://krucho.github.io/rhinoscopy/programa.html#talk-3
```

La URL desplaza la vista hasta la actividad y la resalta temporalmente. El
contenido es ficticio y puede reemplazarse luego sin cambiar la interacción.

La interfaz táctil evita selección accidental, menús contextuales y arrastre de
elementos. Para permitir copiar un contenido específico, agregá el atributo
`data-selectable`; los enlaces `tel:` y `mailto:` y los campos editables ya están
exceptuados automáticamente.

## 4. Primera prueba end-to-end

### Android

1. Abrir la URL HTTPS en Chrome.
2. Tocar **Instalar app**.
3. Abrir la aplicación desde el nuevo icono.
4. Tocar **Activar notificaciones** y aceptar.
5. En OneSignal, comprobar que aparece una suscripción en **Audience → Subscriptions**.
6. Enviar una notificación de prueba desde el dashboard.
7. Repetir con la PWA cerrada y el teléfono bloqueado.

### iPhone

Requiere iOS 16.4 o posterior.

1. Abrir la URL HTTPS en Safari, Chrome o Edge.
2. Tocar **Instalar app** y seguir las instrucciones.
3. Usar **Compartir → Agregar a pantalla de inicio**.
4. Abrir la PWA desde el icono; no continuar desde la pestaña del navegador.
5. Tocar **Activar notificaciones** y aceptar.
6. En OneSignal, comprobar la nueva suscripción.
7. Enviar una notificación de prueba con la PWA cerrada y el teléfono bloqueado.

No probar en navegación privada o incógnito.

## Debug

Agregar `?debug=1` a cualquier URL muestra:

- plataforma y navegador detectados;
- modo standalone real;
- compatibilidad con Service Worker, Notification y Push API;
- permiso de notificaciones;
- inicialización y suscripción de OneSignal;
- workers registrados, alcance y estado;
- URL, parámetros y hash actuales.

La consola utiliza los prefijos `[PWA]`, `[PUSH]`, `[ONESIGNAL]`, `[INSTALL]` y `[DEBUG]`.

## Migración posterior

Las suscripciones Web Push pertenecen al origen. Al cambiar de `https://krucho.github.io` a otro dominio, los dispositivos deberán volver a aceptar la suscripción en el nuevo origen. Para la validación técnica esto es razonable; antes de convocar usuarios reales conviene elegir el dominio definitivo.

## Documentación técnica consultada

- [OneSignal Web SDK setup](https://documentation.onesignal.com/docs/en/web-sdk-setup)
- [OneSignal Web SDK v16 reference](https://documentation.onesignal.com/docs/en/web-sdk-reference)
- [OneSignal service worker](https://documentation.onesignal.com/docs/en/onesignal-service-worker)
- [OneSignal Web Push para iOS](https://documentation.onesignal.com/docs/en/web-push-for-ios)
