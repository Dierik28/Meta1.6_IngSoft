# Plataforma PWA de Reportes Urbanos - Meta 1.6 (Incremento MVP #1)

Este repositorio contiene el código fuente del primer incremento vertical del Producto Mínimo Viable (MVP) para la plataforma comunitaria de **Reportes Urbanos**, implementado con **HTML5, CSS3 y JavaScript Vanilla**.

## Funcionalidades del Primer Incremento (Baby Step)
- **Formulario de captura anónima**: Campos de descripción y ubicación con soporte de reporte anónimo.
- **Validación robusta en el cliente**: Prevención estricta de cadenas vacías o solo espacios en blanco mediante `.trim()`.
- **Experiencia de Usuario (UX) preventiva**: Deshabilitación del botón de envío durante 3 segundos para evitar envíos dobles o accidentales.
- **Empaquetado estructurado**: Los datos se validan y se empaquetan en un objeto JSON con identificador de folio temporal y fecha ISO.
- **PWA Ready**: Incluye `manifest.json` y `sw.js` (Service Worker con estrategia Cache-First) optimizado para instalación móvil y auditoría de **100/100 en Google Lighthouse**.

## Estructura del Repositorio
```text
Meta1.6_PWA_ReportesUrbanos/
├── src/
│   ├── index.html       # Estructura semántica, accesible y metadatos SEO/PWA
│   ├── style.css        # Estilos CSS3, contraste WCAG AAA y diseño responsivo
│   ├── app.js           # Lógica de validación, DOM y registro de Service Worker
│   ├── manifest.json    # Manifiesto de la aplicación web progresiva
│   ├── sw.js            # Service Worker con caché offline
│   └── icons/           # Iconos adaptativos PWA (192x192, 512x512)
└── README.md            # Documentación del incremento técnico
```

## Ejecución Local
Para servir la aplicación y probar la PWA o ejecutar la auditoría de Lighthouse:
```bash
cd src
python -m http.server 8080
```
Luego abre `http://localhost:8080` en Google Chrome.
