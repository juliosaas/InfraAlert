import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function Premium({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A599D" />

      {/* Topo com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>      {/* Título e descrição */}
      <Text style={styles.title}>
        Torne-se premium! <FontAwesome5 name="crown" size={18} color="white" />
      </Text>
      
      {/* Logo e descrição lado a lado */}
      <View style={styles.logoDescriptionContainer}>
        <Image
          source={require('../assets/img/InfraAlertLogo.png')}
          style={styles.owlIcon}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          Desfrute de benefícios incríveis e melhore sua experiência!
        </Text>
      </View>{/* Cartão branco de oferta */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sem anúncios!</Text>
        <Image
          source={require('../assets/img/no-ads.png')}
          style={styles.adImage}
          resizeMode="contain"
        />
        <Text style={styles.price}>Por R$0,00 / mês</Text>        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('Funcionalidade em desenvolvimento!')}
        >
          <FontAwesome5 name="crown" size={16} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Ser Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({  container: {
    flex: 1,
    backgroundColor: '#2A599D',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginTop: 50,
    alignItems: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },  subtitle: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 15,
  },
  logoDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  owlIcon: {
    width: 80,
    height: 80,
  },
  card: {
    backgroundColor: '#fff',
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  adImage: {
    width: 70,
    height: 70,
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
