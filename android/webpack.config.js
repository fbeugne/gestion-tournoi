const path = require('path');

module.exports = {
  entry: './www/js/android/index.js', // Chemin de ton fichier d'entrée
  output: {
    filename: 'bundle.js', // Nom du fichier de sortie
    path: path.resolve(__dirname, 'www/js/webpack'),
  },
  mode: 'development',
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'), // Remplace path par path-browserify
      process: require.resolve('process/browser'), // Remplace process par une version navigateur
      os: require.resolve('os-browserify/browser'), // Remplacement pour os
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, // Fichiers JS/MJS à traiter
        exclude: /node_modules/, // Exclut node_modules
        use: {
          loader: 'babel-loader', // Transpile avec Babel
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

