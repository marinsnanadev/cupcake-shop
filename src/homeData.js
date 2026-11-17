import { imageMap } from './imageMap';

export const collections = [
  { index: '01', title: 'Clássicos', blurb: 'Sabores queridos para qualquer ocasião.', image: imageMap['classicos-banner.jpg'] },
  { index: '02', title: 'Especiais', blurb: 'Combinações especiais feitas para surpreender.', image: imageMap['especiais-banner.jpg'] },
];

export const featuredProducts = [
  { id: 'chocolate', index: '01', name: 'Cupcake de Chocolate', price: 10, category: 'Clássicos', image: imageMap['chocolate.jpg'] },
  { id: 'red-velvet', index: '02', name: 'Red Velvet', price: 14, category: 'Especiais', image: imageMap['red-velvet.jpg'] },
  { id: 'doce-de-leite', index: '03', name: 'Cupcake de Doce de Leite', price: 15, category: 'Especiais', image: imageMap['doce-de-leite.jpg'] },
];

export const heroImages = [imageMap['red-velvet.jpg'], imageMap['morango.jpg']];
export const storyImage = imageMap['chocolate.jpg'];

export const chunkCollections = (items, size) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};