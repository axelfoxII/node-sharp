# Sharp Ejemplo

Servidor Express para procesar imágenes con Sharp.

## ¿Qué es Sharp?

**Sharp** es una librería Node.js para procesamiento de imágenes de alto rendimiento. Usa libvips (una de las bibliotecas de procesamiento de imágenes más rápidas del mundo) para:

- Redimensionar imágenes
- Convertir formatos (JPEG, PNG, WebP, AVIF, etc.)
- Aplicar filtros y efectos
- Añadir watermarks
- Optimizar calidad/tamaño

Es hasta 4x más rápida que ImageMagick y usa menos memoria.

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
npm run dev
```

El servidor arrancará en http://localhost:3000

## Uso

Enviar imagen a `http://localhost:3000/upload` mediante POST.

## Rutas

- `POST /upload` - Subir imagen
- `GET /uploads/:archivo` - Ver imagen original
- `GET /optimized/:archivo` - Ver imagen optimizada