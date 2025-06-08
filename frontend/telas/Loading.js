import React, { useRef, useEffect } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

const Loading = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; //gera uma ref mutavel | define valor da animação (opacidade) | acessa o valor da ref

  useEffect(() => { //cria um temporizador endentando o setTimeout
    const timer = setTimeout(() => {

      Animated.timing(fadeAnim, { // animação de fade-out
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {

        navigation.replace('Home'); // substitui a tela atual por 'Home' após a animação
      });
    }, 2000); // fecha o método e coloca o tempo

    return () => clearTimeout(timer); //limpa o timer dps da execução do método
  }, [fadeAnim, navigation]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image 
        source={require('../assets/img/InfraAlertLogo.png')} 
        style={styles.logo} 
      />
    </Animated.View>
  ); // .view por conta do fade
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A599D',
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
});

export default Loading;