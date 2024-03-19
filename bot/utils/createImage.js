const { createCanvas, loadImage } = require('canvas');
const fetch = require('node-fetch');
const fs = require('fs');
const sharp = require('sharp');

async function createImage(urlsDasImagens, largura, altura, nomeDoArquivo) {
    try {
      // Criar um canvas
      const canvas = createCanvas(largura * urlsDasImagens.length, altura); // Ajustar a largura do canvas para acomodar todas as imagens
      const contexto = canvas.getContext('2d');
  
      // Carregar e desenhar cada imagem no canvas
      for (let i = 0; i < urlsDasImagens.length; i++) {
        const url = urlsDasImagens[i];
        const imagemBuffer = await carregarImagemEConverterParaPNG(url);
        if (!imagemBuffer) {
          console.error('Erro ao carregar e converter a imagem:', url);
          continue;
        }
        const imagem = await loadImage(imagemBuffer);
        contexto.drawImage(imagem, i * largura, 0); // Ajustar a coordenada x baseada no índice da imagem
      }
  
      // Salvar a imagem combinada localmente
      const stream = fs.createWriteStream(nomeDoArquivo);
      const streamPNG = canvas.createPNGStream();
      
      streamPNG.pipe(stream);
      
      return new Promise((resolve, reject) => {
        stream.on('finish', () => {
          console.log('Imagem combinada criada com sucesso:', nomeDoArquivo);
          resolve();
        });
        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      throw error;
    }
  }

async function carregarImagemEConverterParaPNG(url) {
  try {
    const imagemBuffer = await sharp(await fetch(url).then(res => res.buffer())).png().toBuffer();
    return imagemBuffer;
  } catch (error) {
    console.error('Erro ao carregar e converter a imagem:', error);
    return null;
  }
}

module.exports = createImage;
