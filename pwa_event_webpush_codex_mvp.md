# MVP PWA de evento con Web Push — Brief para Codex

## Objetivo

Crear un MVP mobile-first de una **PWA para eventos/conferencias** usando **HTML, CSS y JavaScript vanilla**, sin frameworks.

El objetivo principal NO es desarrollar todavía una plataforma completa de eventos, sino validar técnicamente y desde UX que una PWA puede reemplazar razonablemente a una app nativa para este caso de uso, especialmente en iOS.

El MVP debe permitir validar este recorrido end-to-end:

1. El usuario abre una URL o escanea un QR.
2. Ve una pantalla de bienvenida.
3. Instala la PWA.
4. Abre la PWA instalada.
5. Activa las notificaciones.
6. Recibe una notificación de alerta de conferencia.
7. Toca la notificación y se abre la conferencia correspondiente.
8. Recibe una notificación al finalizar una conferencia.
9. Toca la notificación y se abre una encuesta asociada.
10. Todo debe poder probarse en un iPhone real y un Android real.

---

# Prioridad del proyecto

Priorizar, en este orden:

1. Instalación correcta como PWA.
2. Experiencia coherente entre Android e iOS.
3. Registro correcto para Web Push.
4. Recepción de notificaciones con la PWA cerrada.
5. Deep links desde notificaciones.
6. Flujo hacia una encuesta.
7. Diseño básico pero usable.
8. Debug claro para detectar problemas de dispositivo, navegador o permisos.

No agregar funcionalidades que no sean necesarias para validar estos puntos.

---

# Stack

Usar:

- HTML5
- CSS
- JavaScript vanilla
- PWA / Web App Manifest
- Service Worker
- OneSignal Web Push
- HTTPS

No usar frameworks.

Evitar dependencias externas salvo OneSignal.

Mantener CSS y JavaScript de interfaz dentro de `index.html` siempre que sea razonable.

---

# Estructura inicial

Crear como mínimo:

```text
/
├── index.html
├── manifest.json
├── OneSignalSDKWorker.js
├── agenda.html
├── survey.html
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    └── apple-touch-icon.png
```

Si OneSignal requiere actualmente otra estructura de Service Worker según su SDK oficial, seguir la documentación vigente y dejarlo documentado en el README/comentarios del proyecto.

No agregar backend propio para esta primera versión.

---

# Requisito principal de UX

La aplicación debe verse lo más parecida posible en iOS y Android.

NO intentar imitar específicamente la UI nativa de Android ni la de iOS.

Crear una interfaz propia, simple y consistente.

La diferencia entre plataformas debe aparecer solamente cuando sea estrictamente necesaria, especialmente durante la instalación.

---

# Flujo general

```text
ABRIR URL
    ↓
¿PWA instalada?
    ↓
 ┌───────────────┐
 │               │
NO              SÍ
 │               │
 ↓               ↓
INSTALAR     ¿PUSH ACTIVO?
                 ↓
              NO / SÍ
                 ↓
        ACTIVAR NOTIFICACIONES
                 ↓
               LISTO
```

---

# Pantalla inicial

Diseñar una pantalla mobile-first similar a:

```text
┌────────────────────────────┐
│                            │
│        EVENTO 2026         │
│                            │
│        Bienvenido          │
│                            │
│ Recibí alertas antes de    │
│ cada conferencia y         │
│ participá de encuestas.    │
│                            │
│     [ INSTALAR APP ]       │
│                            │
│  ✓ Alertas de agenda       │
│  ✓ Encuestas               │
│  ✓ Acceso rápido           │
│                            │
└────────────────────────────┘
```

Usar contenido ficticio editable mediante constantes o un objeto de configuración JS.

---

# Estado: PWA no instalada

Cuando la app NO esté funcionando en modo standalone:

Mostrar:

- nombre del evento;
- una explicación corta;
- botón principal `Instalar app`.

No pedir permiso de notificaciones en este momento.

---

# Instalación en Android

Detectar Android y navegadores Chromium compatibles.

Escuchar:

```js
beforeinstallprompt
```

Guardar el evento.

Cuando el usuario pulse `Instalar app`, ejecutar el prompt de instalación si está disponible.

NO disparar el prompt automáticamente al cargar la página.

Si `beforeinstallprompt` no está disponible:

mostrar instrucciones manuales genéricas, por ejemplo:

```text
Instalar aplicación

Abrí el menú del navegador y elegí:
"Instalar app" o "Agregar a pantalla principal".
```

No asumir que todos los navegadores muestran exactamente el mismo texto.

---

# Instalación en iPhone / iPad

En iOS/iPadOS, la instalación debe resolverse mediante instrucciones propias.

Si la aplicación NO está ejecutándose en modo standalone, al tocar `Instalar app` abrir un modal o bottom sheet.

Contenido aproximado:

```text
Instalar en iPhone

1. Tocá el botón Compartir.
2. Elegí "Agregar a pantalla de inicio".
3. Confirmá con "Agregar".
4. Abrí la aplicación desde el nuevo icono.
```

Agregar iconos visuales simples si ayudan a entender el recorrido.

No intentar automatizar una acción que Safari no permita automatizar.

Una vez instalada y abierta desde Home Screen, no volver a mostrar estas instrucciones.

---

# Detección de modo instalado

Detectar PWA instalada / modo standalone utilizando los mecanismos apropiados para Android e iOS.

Contemplar como mínimo:

```js
window.matchMedia('(display-mode: standalone)').matches
```

y cualquier comprobación adicional necesaria para compatibilidad con iOS.

Centralizar esta lógica en una función clara, por ejemplo:

```js
function isRunningStandalone() {
  // ...
}
```

---

# Estado: PWA instalada

Cuando la PWA esté instalada:

Mostrar una home parecida a:

```text
┌────────────────────────────┐
│        EVENTO 2026         │
│                            │
│ Próxima conferencia       │
│                            │
│ 18:30                      │
│ IA aplicada               │
│ Sala Principal            │
│                            │
│ 🔔 Notificaciones         │
│    [ ACTIVAR ]             │
│                            │
│       Ver agenda →         │
└────────────────────────────┘
```

Si las notificaciones ya están activas:

```text
🔔 Notificaciones activadas ✓
```

No pedir permisos nuevamente.

---

# Notificaciones Web Push

Usar OneSignal Web SDK siguiendo la documentación oficial vigente.

Configurar:

- aplicación OneSignal;
- Web Push;
- Service Worker;
- suscripción del navegador/dispositivo;
- permiso de notificaciones.

Para este MVP:

**NO implementar todavía un backend propio para enviar notificaciones.**

Los pushes deben poder enviarse manualmente desde el dashboard de OneSignal.

---

# Permiso de notificaciones

Nunca solicitar el permiso automáticamente al cargar la página.

El permiso debe solicitarse exclusivamente después de una interacción explícita:

```text
[ Activar notificaciones ]
```

Manejar como mínimo estos estados:

```text
unknown
default
requesting
granted
denied
unsupported
error
```

La UI debe representar claramente cada estado.

Ejemplo:

```text
Notificaciones activadas ✓
```

o:

```text
Las notificaciones están bloqueadas.

Podés habilitarlas desde la configuración del dispositivo/navegador.
```

---

# Casos de notificación a validar

## Caso A — Alerta de conferencia

Ejemplo:

**Título**

```text
🎤 Próxima conferencia
```

**Mensaje**

```text
IA aplicada empieza en 10 minutos
Sala Principal · 18:30
```

Al tocar la notificación debe abrir algo equivalente a:

```text
/agenda.html#talk-3
```

La página debe hacer scroll o destacar la conferencia correspondiente.

---

## Caso B — Encuesta al finalizar

Ejemplo:

**Título**

```text
¿Qué te pareció la conferencia?
```

**Mensaje**

```text
Son solo 3 preguntas.
```

Al tocar debe abrir:

```text
/survey.html?talk=3
```

La encuesta debe identificar correctamente la conferencia mediante el parámetro `talk`.

---

# Agenda

Crear una agenda estática mínima.

Ejemplo:

```js
const talks = [
  {
    id: "talk-1",
    time: "17:00",
    title: "Diseño y tecnología",
    room: "Sala Principal"
  },
  {
    id: "talk-2",
    time: "17:45",
    title: "Experiencias interactivas",
    room: "Sala B"
  },
  {
    id: "talk-3",
    time: "18:30",
    title: "IA aplicada",
    room: "Sala Principal"
  }
];
```

Mostrar las conferencias como tarjetas.

Si la URL contiene:

```text
#talk-3
```

la aplicación debe:

1. localizar esa charla;
2. desplazar la pantalla hasta ella;
3. resaltarla temporalmente.

---

# Encuesta

Crear una encuesta mínima de 3 preguntas.

Ejemplo:

```text
¿Qué te pareció la conferencia?

1. ¿Cómo la calificarías?
   ★ ★ ★ ★ ★

2. ¿El contenido te resultó útil?
   ○ Sí
   ○ Más o menos
   ○ No

3. Comentario opcional
   [....................]

   [ ENVIAR ]
```

Para el MVP NO es obligatorio persistir realmente las respuestas.

Puede:

- mostrar el payload generado en consola;
- almacenarlo temporalmente en localStorage;
- o enviarlo posteriormente a un servicio externo.

Separar la capa de UI de la futura función de envío.

Crear por ejemplo:

```js
async function submitSurvey(data) {
  // MVP: console.log(data)
  // Futuro: enviar a backend / API / formulario
}
```

El objeto enviado debe incluir al menos:

```js
{
  talkId,
  rating,
  useful,
  comment,
  timestamp
}
```

---

# Configuración central

Evitar valores dispersos por el código.

Crear un objeto de configuración similar a:

```js
const APP_CONFIG = {
  eventName: "Evento 2026",
  oneSignalAppId: "REEMPLAZAR",
  debug: false
};
```

Los IDs, textos importantes y configuración deben poder modificarse fácilmente.

---

# Debug

Agregar modo debug mediante:

```text
?debug=1
```

Cuando esté activo mostrar un panel pequeño, plegable, dentro de la UI.

Debe mostrar como mínimo:

```text
Platform:
- userAgent
- iOS detectado
- Android detectado

PWA:
- display-mode standalone
- navigator.standalone
- beforeinstallprompt disponible

Browser:
- Service Worker support
- Notification API support
- Push API support

Notifications:
- Notification.permission
- OneSignal initialized
- OneSignal subscription state

Service Worker:
- registered
- active
- scope

URL:
- current URL
- query parameters
- hash
```

Agregar también mensajes de consola claros con prefijo:

```text
[PWA]
[PUSH]
[ONESIGNAL]
[INSTALL]
[DEBUG]
```

---

# Manejo de errores

No fallar silenciosamente.

Si ocurre un problema con:

- registro del Service Worker;
- inicialización de OneSignal;
- solicitud de permisos;
- instalación;
- deep link;
- parámetros de encuesta;

mostrar información útil en consola y, cuando corresponda, un mensaje entendible para el usuario.

Nunca mostrar stack traces técnicos en la UI normal.

---

# Diseño

Diseño:

- mobile-first;
- limpio;
- moderno;
- neutro;
- fácil de tematizar;
- sin dependencias CSS;
- sin copiar específicamente Material Design ni iOS UIKit.

Usar:

- tarjetas;
- botones grandes;
- espaciado generoso;
- tipografía del sistema;
- buen contraste;
- `max-width` para pantallas grandes;
- soporte de safe areas de iPhone.

Considerar:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
```

Usar CSS responsive.

---

# Accesibilidad

Implementar como mínimo:

- botones reales `<button>`;
- labels asociados a inputs;
- estados de foco visibles;
- contraste suficiente;
- textos entendibles sin depender únicamente de iconos;
- modales accesibles;
- tamaños táctiles cómodos.

---

# Manifest

Configurar `manifest.json` correctamente.

Incluir como mínimo:

```json
{
  "name": "Evento 2026",
  "short_name": "Evento",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Adaptar rutas según el hosting real.

Agregar en HTML:

```html
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
```

---

# Service Worker y OneSignal

No inventar una implementación incompatible con la versión actual de OneSignal.

Antes de programar esta parte:

1. consultar la documentación oficial vigente de OneSignal Web Push;
2. confirmar la forma recomendada de cargar su SDK;
3. confirmar el contenido y ubicación requerida de su Service Worker;
4. confirmar los requisitos específicos actuales para iOS Web Push;
5. implementar según esa documentación.

Dejar comentarios breves indicando cualquier decisión relacionada con compatibilidad.

---

# HTTPS

La aplicación debe asumir producción bajo HTTPS.

Durante desarrollo usar:

- localhost cuando sea válido;
- o un hosting HTTPS accesible desde teléfonos reales.

Para pruebas reales en iPhone y Android, preparar un deployment HTTPS.

Opciones posibles:

- GitHub Pages;
- Cloudflare Pages;
- Netlify;
- Vercel;
- otro hosting estático HTTPS.

No acoplar el código a un proveedor específico.

---

# Pruebas manuales obligatorias

Crear al final del proyecto una checklist de QA.

## Android

Probar:

- abrir URL desde Chrome;
- instalar PWA;
- abrir desde Home Screen;
- activar notificaciones;
- aceptar permiso;
- cerrar PWA;
- bloquear teléfono;
- enviar push desde OneSignal;
- recibir push;
- tocar push;
- abrir charla correcta;
- enviar push de encuesta;
- tocar push;
- abrir encuesta correcta.

## iPhone

Probar:

- abrir URL desde Safari;
- mostrar instrucciones propias de instalación;
- usar Compartir;
- Agregar a pantalla de inicio;
- abrir desde Home Screen;
- activar notificaciones desde la PWA instalada;
- aceptar permiso;
- cerrar PWA;
- bloquear teléfono;
- enviar push desde OneSignal;
- recibir push;
- tocar push;
- abrir charla correcta;
- enviar push de encuesta;
- tocar push;
- abrir encuesta correcta.

---

# Criterios de aceptación del MVP

Considerar el MVP exitoso solamente si se cumplen TODOS estos puntos:

- [ ] Funciona por HTTPS.
- [ ] Se puede instalar en Android.
- [ ] Se puede agregar correctamente a Home Screen en iPhone.
- [ ] Abre en modo standalone.
- [ ] La UI de Android e iOS es visualmente consistente.
- [ ] No solicita permisos al cargar la web.
- [ ] El usuario puede activar notificaciones mediante un botón.
- [ ] OneSignal registra correctamente el dispositivo.
- [ ] Android recibe un push con la PWA cerrada.
- [ ] iPhone recibe un push con la PWA cerrada.
- [ ] El push de conferencia abre la charla correcta.
- [ ] El push de encuesta abre la encuesta correcta.
- [ ] La encuesta identifica correctamente el `talkId`.
- [ ] Existe `?debug=1`.
- [ ] Los errores relevantes quedan registrados en consola.
- [ ] El flujo completo puede demostrarse físicamente en ambos dispositivos.

---

# Fuera de alcance para este MVP

NO implementar todavía:

- login;
- usuarios;
- autenticación;
- perfiles;
- base de datos;
- backend propio;
- CMS;
- panel administrativo;
- generación dinámica de agenda;
- automatización temporal de notificaciones;
- segmentación avanzada;
- analítica avanzada;
- sincronización de encuestas;
- notificaciones personalizadas por usuario;
- App Store;
- Google Play;
- aplicación nativa;
- funcionamiento offline completo.

Estas funciones pueden agregarse después de validar el MVP.

---

# Arquitectura futura prevista

El MVP debe dejar preparado el código para que después pueda evolucionar hacia:

```text
BACKEND / CMS
     ↓
Agenda / horarios
     ↓
Scheduler
     ↓
OneSignal API
     ↓
Push a asistentes
     ↓
PWA
     ↓
Encuesta / interacción
     ↓
Backend / analytics
```

Pero NO implementar esta arquitectura todavía.

---

# Segunda fase posible

Una vez validado el MVP se podrá agregar:

1. agenda proveniente de JSON/API;
2. IDs persistentes de usuario/dispositivo;
3. suscripción a conferencias específicas;
4. alertas automáticas X minutos antes;
5. push automático al finalizar;
6. almacenamiento de encuestas;
7. métricas de apertura;
8. métricas de conversión:
   - push enviado;
   - push abierto;
   - encuesta iniciada;
   - encuesta completada;
9. dashboard administrativo;
10. personalización visual por evento.

---

# Instrucción de implementación para Codex

Trabajar incrementalmente.

Primero conseguir:

```text
URL
→ instalación
→ standalone
→ activar push
→ recibir push de prueba
```

No desarrollar agenda ni encuesta hasta que eso funcione.

Después implementar:

```text
push
→ deep link
→ agenda
```

Y finalmente:

```text
push
→ survey.html?talk=...
→ encuesta
```

Mantener el código simple y legible.

Antes de agregar complejidad, comprobar si realmente es necesaria para cumplir los criterios de aceptación.

En cada etapa:

1. implementar;
2. probar;
3. registrar errores claramente;
4. corregir;
5. recién entonces continuar.

---

# Resultado esperado

Al finalizar debe existir un MVP que pueda demostrarse así:

> Se escanea un QR con un iPhone o Android, se instala la experiencia como PWA, el usuario habilita las notificaciones, recibe una alerta antes de una conferencia, toca esa notificación y accede a la charla correspondiente. Al finalizar recibe otra notificación, la toca y responde una encuesta breve.

Ese recorrido es la prueba principal que debe resolver este proyecto.
