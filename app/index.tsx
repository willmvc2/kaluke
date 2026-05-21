import React from 'react';
import {
  BackHandler,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();

  const [codigo, setCodigo] = React.useState('');
  const [videoAtual, setVideoAtual] = React.useState<string | null>(null);
  const [modoPlayer, setModoPlayer] = React.useState(false);

  React.useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  React.useEffect(() => {
    const backAction = () => {
      if (modoPlayer) {
        setModoPlayer(false);
        setVideoAtual(null);
        setCodigo('');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [modoPlayer]);

  const digitar = (n: string) => {
    if (codigo.length < 4) {
      setCodigo(codigo + n);
    }
  };

  const limpar = () => {
    setCodigo('');
  };

  const caminhosBase = [
    '/storage/usb0',
    '/storage/usb1',
    '/storage/usb2',
    '/storage/usb3',
    '/storage/udisk',
    '/mnt/usb_storage',
    '/storage/sda1',
    '/storage/sdb1',
  ];

  const tentarProximoCaminho = (index: number) => {
    if (index >= caminhosBase.length) {
      alert('Vídeo não encontrado no pendrive');
      setModoPlayer(false);
      setVideoAtual(null);
      return;
    }

    const caminho = `file://${caminhosBase[index]}/${codigo}.mp4`;
    setVideoAtual(caminho);
  };

  const confirmar = () => {
    if (codigo.length !== 4) return;

    setModoPlayer(true);
    tentarProximoCaminho(0);
  };

  const buttonSize = Math.min(width * 0.03, 40);
  const visorSize = Math.min(width * 0.10, 35);

  const Botao = ({ txt, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: buttonSize,
        height: buttonSize,
        margin: 4,
        borderRadius: 6,
        backgroundColor: '#2b0050',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ff00ff',
      }}
    >
      <Text style={{ color: '#ffd700', fontSize: buttonSize * 0.50, fontWeight: 'bold' }}>
        {txt}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/menu.png')}
        style={{ flex: 1 }}
        resizeMode="stretch"
      >

        <View style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: height * 0.40,
          paddingHorizontal: width * 0.05,
        }}>

          {/* VISOR */}
          <View style={{
            flexDirection: 'row',
            marginBottom: height * 0.02,
            padding: 5,
            borderRadius: 20,
            borderWidth: 4,
            borderColor: '#fff700',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
            {[0,1,2,3].map(i => (
              <View key={i} style={{
                width: visorSize,
                height: visorSize,
                margin: 6,
                backgroundColor: '#3b0070',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#ffd700',
              }}>
                <Text style={{ color: '#ffd700', fontSize: visorSize * 0.55, fontWeight: 'bold' }}>
                  {codigo[i] || ''}
                </Text>
              </View>
            ))}
          </View>

          {/* TECLADO */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['1','2','3','4','5','6','7','8','9','0'].map(n => (
              <Botao key={n} txt={n} onPress={() => digitar(n)} />
            ))}
          </View>

          {/* BOTÕES */}
          <View style={{ flexDirection: 'row', marginTop: height * 0.02, gap: 20 }}>
            <TouchableOpacity onPress={limpar} style={{
              paddingHorizontal: 10,
              paddingVertical: 2,
              backgroundColor: '#400000',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ff5555'
            }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 10 }}>
                LIMPAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={confirmar} style={{
              paddingHorizontal: 10,
              paddingVertical: 2,
              backgroundColor: '#003300',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#00ff44'
            }}>
              <Text style={{ color: '#00ff2a', fontWeight: 'bold', fontSize: 10 }}>
                CONFIRMAR
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>

      {/* PLAYER */}
      {modoPlayer && videoAtual && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'black',
          zIndex: 100
        }}>
          <Video
            source={{ uri: videoAtual }}
            style={{ flex: 1 }}
            resizeMode="contain"
            shouldPlay
            useNativeControls={false}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setModoPlayer(false);
                setVideoAtual(null);
                setCodigo('');
              }
            }}
            onError={() => {
              // tenta próximo USB automaticamente
              const indexAtual = caminhosBase.findIndex(c =>
                videoAtual.includes(c)
              );
              tentarProximoCaminho(indexAtual + 1);
            }}
          />
        </View>
      )}
    </View>
  );
}