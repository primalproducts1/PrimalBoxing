# PRIMAL Boxing Club · Voz idéntica al entrenar y compartir

Esta edición prioriza que la voz que oye el usuario **sea la misma** en:

- Entrenamiento sin cámara.
- Entrenamiento con cámara.
- Video descargado o compartido.

Los dos modos usan `voice-bank.js` y los mismos MP3 en `coach-audio/` (español/inglés y guardia diestra/zurda). Durante la grabación, una única señal local se envía al altavoz y a la pista de audio del archivo, que luego se usa sin modificaciones tanto al descargar como al compartir.

**Limitación esencial:** se usa la **voz pregrabada provisional**, no la voz más natural de `speechSynthesis` del iPhone. No es posible capturar digitalmente esa voz nativa en el video mediante las APIs que usa esta app. Para conseguir una voz más natural *y* exportarla idéntica, hay que sustituir los MP3 por grabaciones originales de mayor calidad, por ejemplo producidas con una voz licenciada. Los controles de tono y velocidad están ocultos para no sugerir ajustes que afectarían la consistencia.

La música local MP3 se conserva y está conectada al mezclador del grabador. La reproducción y la exportación con audio todavía necesitan comprobarse físicamente en Safari/iPhone, donde pueden existir restricciones del sistema. La app no sube grabaciones a servidores.

## Cómo publicar

1. Descomprime `PRIMAL_MISMA_VOZ_VIDEO_GitHub.zip`.
2. Entra en el repositorio GitHub `primalproducts1/PrimalBoxing` y utiliza Add file → Upload files.
3. Sube **el contenido extraído**, con `index.html` en la raíz; no subas la carpeta contenedora.
4. Incluye las carpetas `audio/` y `coach-audio/` completas; mantén `app.js`, `recorder.js`, `coach.js`, `voice-bank.js`, `index.html`, `music.js`, `i18n.js` y el resto de archivos.
5. Confirma **Commit changes** y comprueba la publicación en Settings → Pages.
6. Actualiza la app, graba una sesión de 10 segundos y compara lo que se oye mientras se graba con el video descargado y compartido.

El MP3 de música procede del archivo aportado por el usuario. Verifica que tengas los derechos necesarios para distribuir la música comercial dentro de la aplicación y los videos resultantes.
