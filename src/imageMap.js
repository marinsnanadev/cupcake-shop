import fallbackImage from './assets/images/splash.jpg';

const cupcakeAssets = process.env.NODE_ENV === 'test'
  ? { keys: () => [] }
  : require.context('./assets/cupcakes', false, /\.jpg$/);
const cupcakeImages = Object.fromEntries(
  cupcakeAssets.keys().map((path) => [path.slice(2), cupcakeAssets(path)]),
);

export const imageMap = {
  'chocolate.jpg': cupcakeImages['chocolate.jpg'] || fallbackImage,
  'baunilha.jpg': cupcakeImages['baunilha.jpg'] || fallbackImage,
  'morango.jpg': cupcakeImages['morango.jpg'] || fallbackImage,
  'red-velvet.jpg': cupcakeImages['red-velvet.jpg'] || fallbackImage,
  'limao.jpg': cupcakeImages['limao.jpg'] || fallbackImage,
  'doce-de-leite.jpg': cupcakeImages['doce-de-leite.jpg'] || fallbackImage,
  'classicos-banner.jpg': cupcakeImages['classicos-banner.jpg'] || fallbackImage,
  'especiais-banner.jpg': cupcakeImages['especiais-banner.jpg'] || fallbackImage,
};