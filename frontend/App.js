import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Loading from './telas/Loading';
import Login from './telas/Login';
import Cadastro from './telas/Cadastro';
import Home from './telas/Home';
import AdminScreen from './telas/AdminScreen';
import Configuracoes from './telas/Configuracoes';
import Premium from './telas/Premium';
import React, { createContext, useState, useEffect } from 'react';
import { autoConfigureNetwork } from './scripts/autoConfigureNetwork';

const Stack = createStackNavigator();

export const UserContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);
  const [networkConfigured, setNetworkConfigured] = useState(false);

  useEffect(() => {
    // Configuração automática de rede quando o app inicia
    const initializeNetwork = async () => {
      try {
        console.log('🚀 Inicializando configuração de rede...');
        await autoConfigureNetwork();
        setNetworkConfigured(true);
        console.log('✅ Rede configurada com sucesso');      } catch (error) {
        console.error('❌ Erro na configuração de rede:', error);
        setNetworkConfigured(true); // Continua mesmo com erro
      }
    };

    initializeNetwork();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, networkConfigured }}>
      <NavigationContainer>        <Stack.Navigator initialRouteName="Loading">
          <Stack.Screen 
            name="Loading" 
            component={Loading}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Cadastro" 
            component={Cadastro}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Admin" 
            component={AdminScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Configuracoes" 
            component={Configuracoes}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Premium" 
            component={Premium}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}