import React from 'react';
import {
  BackHandler,
  ImageBackground,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function HomeScreen() {

  const [codigo, setCodigo] = React.useState('');
  const [videoAtual, setVideoAtual] = React.useState(null);
  const [musicaSelecionada, setMusicaSelecionada] = React.useState(null);
  const [modoPlayer, setModoPlayer] = React.useState(false);

  const musicas: any = {
    '0001': { nome: 'Pensa em Mim', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    '0002': { nome: 'Evidências', video: 'https://www.w3schools.com/html/movie.mp4' },
  };

  // 🔥 trava landscape
  React.useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }, []);

  React.useEffect(() => {
    const backAction = () => {
      if (modoPlayer) {
        setModoPlayer(false);
        setVideoAtual(null);
        setCodigo('');
        setMusicaSelecionada(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [modoPlayer]);

  const digitar = (n: string) => {
    if (codigo.length < 4) {
      const novo = codigo + n;
      setCodigo(novo);

      if (novo.length === 4) {
        setMusicaSelecionada(musicas[novo] || null);
      }
    }
  };

  const limpar = () => {
    setCodigo('');
    setMusicaSelecionada(null);
  };

  const confirmar = () => {
  if (codigo.length !== 4) return;

  // 🔥 caminho do pendrive
  const caminho = `file:///storage/usb0/${codigo}.mp4`;

  setVideoAtual(caminho);
  setModoPlayer(true);

  setCodigo('');
  setMusicaSelecionada(null);
};

  const Botao = ({ txt, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 65,
        height: 65,
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#2b0050',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ff00ff'
      }}
    >
      <Text style={{
        color: '#ffd700',
        fontSize: 20,
        fontWeight: 'bold'
      }}>
        {txt}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>

      {/* 🔥 UMA ÚNICA IMAGEM (FULLSCREEN REAL) */}
      <ImageBackground
  source={require('../assets/images/menu.png')}
  style={{
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start', // 👈 mudou
    alignItems: 'center',
    paddingTop: 300 // 👈 controla altura do visor
  }}
  resizeMode="stretch"
>

        {/* BLOCO CENTRAL */}
        <View style={{ alignItems: 'center' }}>

          {/* VISOR */}
          <View style={{
            flexDirection: 'row',
            marginBottom: 20,
            padding: 8,
            borderRadius: 15,
            borderWidth: 2,
            borderColor: '#fff700'
          }}>
            {[0,1,2,3].map(i => (
              <View key={i} style={{
                width: 70,
                height: 70,
                margin: 4,
                backgroundColor: '#3b0070',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: '#ffd700',
                  fontSize: 28,
                  fontWeight: 'bold'
                }}>
                  {codigo[i] || ''}
                </Text>
              </View>
            ))}
          </View>

          {/* TECLADO */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {['1','2','3','4','5','6','7','8','9','0'].map(n => (
              <Botao key={n} txt={n} onPress={() => digitar(n)} />
            ))}
          </View>

          {/* AÇÕES */}
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity onPress={limpar} style={{
              margin: 10,
              padding: 10,
              backgroundColor: '#400000',
              borderRadius: 10
            }}>
              <Text style={{ color: '#fff' }}>LIMPAR</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={confirmar} style={{
              margin: 10,
              padding: 10,
              backgroundColor: '#002244',
              borderRadius: 10
            }}>
              <Text style={{ color: '#00ff2a' }}>CONFIRMAR</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ImageBackground>

      {/* NOME (RESPONSIVO, NÃO FIXO) */}
      {musicaSelecionada && (
        <View style={{
          position: 'absolute',
          top: 600,
          width: '100%',
          alignItems: 'center'
        }}>
          <Text style={{
            color: '#FFD700',
            fontSize: 22
          }}>
            {musicaSelecionada.nome}
          </Text>
        </View>
      )}

      {/* PLAYER */}
      {modoPlayer && videoAtual && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black'
        }}>
          <Video
            source={{ uri: videoAtual }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
            shouldPlay
            useNativeControls
          />
        </View>
      )}

    </View>
  );
}