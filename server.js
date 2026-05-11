const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Inicializar Express
const app = express();

// Habilitar CORS para permitir solicitudes desde otros orígenes
app.use(cors());

// Servir archivos estáticos desde las carpetas 'optimized' y 'uploads'
app.use('/optimized', express.static('optimized'));
app.use('/uploads', express.static('uploads'));

// Configurar Multer para guardar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage()
});

/**
 * Función para crear un watermark (marca de agua) en formato SVG
 * @param {string} text - Texto a mostrar en el watermark
 * @param {number} width - Ancho del watermark
 * @param {number} height - Alto del watermark
 * @returns {Buffer} - Buffer con la imagen SVG del watermark
 */
function createWatermark(text, width, height) {
  return Buffer.from(`
    <svg width="${width}" height="${height}">
      <style>
        .text { fill: white; font-size: ${height * 0.6}px; font-family: Arial; font-weight: bold; opacity: 0.5; }
      </style>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="text">${text}</text>
    </svg>
  `);
}

// Ruta para subir UNA imagen
app.post('/upload', upload.single('image'), async (req, res) => {

  try {

    // Generar nombre de archivo único usando timestamp
    const fileName = Date.now();
    // Mantener extensión original de la imagen
    const originalName = fileName + path.extname(req.file.originalname);
    // Guardar como WebP para mejor compresión
    const optimizedName = fileName + '.webp';

    // Rutas completas para guardar los archivos
    const outputPath = path.join(__dirname, 'optimized', optimizedName);
    const originalPath = path.join(__dirname, 'uploads', originalName);

    // Guardar imagen original en la carpeta 'uploads'
    fs.writeFileSync(originalPath, req.file.buffer);

    // Obtener metadatos de la imagen original (dimensiones, formato, etc.)
    const metadata = await sharp(req.file.buffer).metadata();
    const width = metadata.width;
    const height = metadata.height;

    // Calcular tamaño del watermark proporcional al tamaño de la imagen
    // fontSize = 1/15 de la dimensión más pequeña, mínimo 24px
    const fontSize = Math.max(24, Math.min(width, height) / 15);
    const wmWidth = Math.round(fontSize * 5);
    const wmHeight = Math.round(fontSize * 1.5);

    // Procesar imagen con Sharp
    await sharp(req.file.buffer)
      // Redimensionar manteniendo proporción
      // max 1200x1200, si es más pequeña no se enlarge
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      })
      // Añadir watermark en la esquina inferior derecha
      .composite([{
        input: createWatermark('Mi Marca', wmWidth, wmHeight),
        gravity: 'southeast'
      }])
      // Convertir a WebP con calidad 80 (buen equilibrio calidad/tamaño)
      .webp({ quality: 80, effort: 4 })
      .toFile(outputPath);

    // Responder con las URLs de ambas imágenes
    res.json({
      message: 'Imagen optimizada',
      originalUrl: `http://localhost:3000/uploads/${originalName}`,
      optimizedUrl: `http://localhost:3000/optimized/${optimizedName}`
    });

  } catch (error) {

    // Manejar errores
    console.log(error);

    res.status(500).json({
      error: 'Error procesando imagen'
    });

  }

});

// Iniciar servidor en puerto 3000
app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});