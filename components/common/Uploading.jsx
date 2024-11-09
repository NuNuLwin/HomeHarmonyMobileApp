import {
    Image,
    Text,
    StyleSheet,
    View,
    Button,
    TouchableOpacity,
    Platform,
    Dimensions,
    Modal
  } from "react-native";
import { BlurView } from "expo-blur";
import ProgressBar from "./ProgressBar";
   
  export function Uploading({ image, progress }) {
    return (
        <Modal
            visible={true}
            transparent={true}
        >
            <View
                style={{
                    backgroundColor: '#808080aa', 
                    flex:1,
                    justifyContent:'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        backgroundColor: "white",
                        justifyContent:'center',
                        alignItems: 'center',
                        paddingVertical: 16,
                        rowGap: 24,
                        borderRadius: 14,
                        padding: 20
                    }}
                >
                    {image && (
                        <Image
                        source={{ uri: image }}
                        style={{
                            width: 100,
                            height: 100,
                            resizeMode: "contain",
                            borderRadius: 6,
                        }}
                        />
                    )}
                    <Text style={{ fontSize: 12 }}>Uploading...</Text>
                    <ProgressBar progress={progress} />
                    <View
                        style={{
                        height: 1,
                        borderWidth: StyleSheet.hairlineWidth,
                        width: "100%",
                        borderColor: "#00000020",
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
  }