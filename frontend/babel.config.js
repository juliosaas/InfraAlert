//importação do babel e seus modulos para o funcionamento do react native/.js e expo

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: false }], //loose = faz que o babel não faça a verificação de tipos
    ['@babel/plugin-transform-private-methods', { loose: false }],
    ['@babel/plugin-transform-private-property-in-object', { loose: false }],
    'react-native-reanimated/plugin',
  ],
};
