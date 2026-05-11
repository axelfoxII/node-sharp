# Sharp Ejemplo

Servidor Express para procesar imágenes con Sharp.

## Características

- Upload de imágenes
- Redimensionado automático (máx 1200x1200)
- Marca de agua (watermark)
- Conversión a WebP
- Guarda original y optimizada

## Instalación

```bash
npm install
```

## Ejecución

```bash
node server.js
```

## Uso

Enviar imagen a `http://localhost:3000/upload` mediante POST.

## Rutas

- `POST /upload` - Subir imagen
- `GET /uploads/:archivo` - Ver imagen original
- `GET /optimized/:archivo` - Ver imagen optimizada