const crypto = require('crypto');
const sharp = require('sharp');

async function generateImageHash(imageBuffer) {
  try {
    // Normalize the image first
    const normalizedImage = await sharp(imageBuffer)
      .resize(800, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .grayscale()
      .normalise()
      .toBuffer();

    // Create hash from normalized image
    const hash = crypto
      .createHash('sha256')
      .update(normalizedImage)
      .digest('hex');

    return hash;
  } catch (error) {
    console.error('Error generating image hash:', error);
    throw new Error('Failed to generate image hash: ' + error.message);
  }
}

module.exports = { generateImageHash }; 