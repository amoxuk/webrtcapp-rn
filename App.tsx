/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View
} from "react-native";

import axios from "axios";
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices, RTCView } from "react-native-webrtc";

const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// const pc = new RTCPeerConnection(configuration);

type SectionProps = PropsWithChildren<{
  title: string;
}>;

// import { io } from "socket.io-client";

// const [remoteStream, setRemoteStream] = useState(null);


function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: "#000"
          }
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: "#000"
          }
        ]}>
        {children}
      </Text>

    </View>
  );
}


const onPressAxios = () => {
  console.log("axios get");
  axios.get("https://appdemo.underriver.cn/getusers?id=users").then(response => {
    console.log(response.data);
  }).catch(error => {
    console.log(error);
  });
  console.log("axios post");

  axios.post("https://appdemo.underriver.cn/myposts", {
    name: "a"
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });


};
const onPressFetch = () => {
  console.log("fetch get");
  fetch("https://appdemo.underriver.cn/getusers?id=users")
    .then(response => response.text())
    .then(data => console.log("fetch data length: ", data.length))
    .catch(err => console.log(err));
  console.log("fetch post");
  fetch("https://appdemo.underriver.cn/myposts", {
    method: "post",
    body: "name=a"
  })
    .then(response => response.text())
    .then(data => console.log("fetch data length: ", data.length))
    .catch(err => console.log(err));
};



function App() {
  const [localStream, setLocalStream] = useState(false);
  const [url, setUrl] = useState('http://192.168.5.5:38080/whip/offer_srs');
  // const [pc, setPc] = useState(new RTCPeerConnection());
  const isDarkMode = useColorScheme() === "dark";
  const backgroundStyle = {
    backgroundColor: "#fff"
  };
  var pc = new RTCPeerConnection();
  function modifySDPToPreferH265(sdp) {
    return sdp
  }
  function onPressWebRTC() {

    mediaDevices.getUserMedia({
      audio: true,
      video: { width: { exact: 1280 }, height: { exact: 720 } }
    }).then(data => {
      setLocalStream(data)
      // $$$$$$$$$$$$$$$$$$$$$$$$$
      // pc = ;
      pc.close()
      pc = new RTCPeerConnection();
      // let sender = pc.getSenders()[0];
      // let param = sender.getParameters();
      // console.log(param);
      console.log('pc', pc);

      // param.encodings[0].codec = codec;
      // sender.setParameters(param).then(() => {
      //   console.log("change encoder suc");
      // }).catch((err) => {
      //   console.log("change encoder fail");
      // })
      // 2. 将本地视频流添加到实例中
      data.getTracks().forEach((track) => {
        console.log('add track:', track);
        console.log('add track data:', data);
        // track.applyConstraints()
        if (track.kind === 'video') {
          console.log('track. set',
            track.getSettings(),
          );
          // track.contentHint = 'detail/text'
          // track.contentHint = hint
          // track.contentHint = hint
        }
        pc.addTrack(track, data);
      });
      // pc.localDescription.
      pc.createOffer({
        mandatory: {
          OfferToReceiveAudio: false,
          OfferToReceiveVideo: true,
          VoiceActivityDetection: false
        }
      }).then(offer => {
        let modifiedSDP = modifySDPToPreferH265(offer.sdp);
        pc.setLocalDescription({ type: offer.type, sdp: modifiedSDP });
        return { type: offer.type, sdp: modifiedSDP }
      }).then(offer => {
        console.log("self desc:", offer)
        fetch(`${url}`, {
          method: 'post',
          body: offer.sdp
        })
          .then(response => response.text())
          .then(res => {
            console.log("sever desc:", res)
            let answer = new RTCSessionDescription({
              "type": "answer",
              "sdp": res
            });
            console.log("sever answer dsp:", res)
            pc.setRemoteDescription(answer);
            pc.getSenders().forEach((sender) => {
              console.log('sender', sender);
              if (sender.track?.kind ==='video') {
                console.log('param',sender._rtpParameters);
                console.log('param encodings',sender._rtpParameters.encodings);
                sender._rtpParameters.degradationPreference = 'maintain-resolution'
                sender.setParameters(sender._rtpParameters)
              }
            
            });
          })
      });
      // $$$$$$$$$$$$$$$$$$$$$$$$$
    })
  }
  const closeWebRTC = () => {
    setLocalStream(null)

    if (pc.getTransceivers) {
      pc.getTransceivers().forEach((transceiver) => {
        if (transceiver.stop) {
          transceiver.stop();
        }
      });
    }

    // close local audio / video
    pc.getSenders().forEach((sender) => {
      pc.removeTrack(sender);
      sender.track?.stop();
    });
    mediaDevices.getUserMedia({
      audio: false,
      video: true
    }).then(data => {
      data.release()
    })
    // close peer connection
    // pc.restartIce()
    setTimeout(() => {
      pc.close();
    }, 500);
  }

  // initLocalVideo()
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: "#FFF"
          }}>
          {/* <Section title="Step One">
            <Button
              onPress={() => {
                onPressAxios();
              }}
              title="Axois"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
          </Section>
          <Section title="Step Two">
            <Button
              onPress={() => {
                onPressFetch();
              }}
              title="Fetch"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
          </Section> */}
          <Section title="WEBRTC">
            <View>
              <TextInput
                style={styles.input}
                onChangeText={text => setUrl(text)}
                value={url}
              />
              <View style={{ flexDirection: 'row' }}>

                <Button
                  onPress={() => {
                    onPressWebRTC();
                  }}
                  title="OPEN"
                  color="#841584"
                />
                <View style={{ flexDirection: 'column', width: 15, marginLeft: 15 }}></View>
                <Button
                  onPress={() => {
                    closeWebRTC();
                  }}
                  title="COLOSE"
                  color="#ff0000"
                />
              </View>

            </View>

          </Section>

          <View style={styles.videoContainer}>
            <View style={[styles.videos, styles.localVideos]}>
              {
                localStream && <RTCView streamURL={localStream?.toURL()}
                  style={styles.localVideo}
                />
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 6,
    borderWidth: 1,
    padding: 10,
    width: 260
  },
  root: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
  },
  inputField: {
    marginBottom: 10,
    flexDirection: 'column',
  },
  videoContainer: {
    flex: 1,
    minHeight: 400,
    marginTop: 5,
    margin: 30,
    backgroundColor: '#eee'
  },
  videos: {
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',

    borderRadius: 6,
  },
  localVideos: {
    height: 450,
    marginBottom: 10,
  },
  remoteVideos: {
    height: 400,
  },
  localVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
  remoteVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },

  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600"
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400"
  },
  highlight: {
    fontWeight: "700"
  }
});

export default App;
function useFocusEffect(arg0: any) {
  throw new Error("Function not implemented.");
}

