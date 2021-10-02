import React, { useEffect, useState } from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Audio } from 'expo-av';

export default function PlayVoice({ route }) {

    const [sound, setSound] = useState();
    const [stopEnabled, setStopEnabled] = useState(false)
    const uri = route.params.uri
    const playSound = async (rate = 1, should = true) => {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync({ uri });
        setSound(sound);
        console.log('Playing Sound');
        sound.setRateAsync(rate, should)
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate)
        setStopEnabled(true)
    }

    const _onPlaybackStatusUpdate = (playbackStatus) => {
        if (playbackStatus.didJustFinish) {
            setStopEnabled(false)
        }
    };

    React.useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const stopSound = async () => {
        await sound.unloadAsync();
        setStopEnabled(false)
    }
    return (
        <View style={styles.view}>
            <View style={styles.rows}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => playSound(0.7, false)}>
                        <Image source={require("./assets/Slow.imageset/Slow.png")} style={styles.voices} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => playSound(1.5, false)}>
                        <Image source={require("./assets/Fast.imageset/Fast.png")} style={styles.voices} />
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => playSound(0.7, true)}>
                        <Image source={require("./assets/HighPitch.imageset/HighPitch.png")} style={styles.voices} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require("./assets/LowPitch.imageset/LowPitch.png")} style={styles.voices} />
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity>
                        <Image source={require("./assets/Echo.imageset/Echo.png")} style={styles.voices} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require("./assets/Reverb.imageset/Reverb.png")} style={styles.voices} />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <TouchableOpacity onPress={() => stopSound()} disabled={!stopEnabled}>
                    <Image source={require("./assets/Stop.imageset/Stop.png")} style={[styles.stop, { opacity: stopEnabled ? 1 : 0.4 }]} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "white"
    },
    rows: {
        height: "70%",
        width: "90%",
        alignItems: "center",
        justifyContent: "space-around",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },
    voices: {
        width: 80,
        height: 80
    },
    stop: {
        width: 100,
        height: 100
    }
})