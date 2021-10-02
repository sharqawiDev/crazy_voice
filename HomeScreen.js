import React, { useRef, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Audio } from 'expo-av';

export default function HomeScreen({ navigation }) {
    const [recording, setRecording] = useState(null);
    const [startBtn, setStartBtn] = useState({ disabled: false, opacity: 1 })
    const [stopBtn, setStopBtn] = useState({ disabled: true, opacity: 0.4 })
    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');
            setStopBtn(new Object({ opacity: 1, disabled: false }))
            setStartBtn(new Object({ opacity: 0.4, disabled: true }))
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,

        });
        const uri = recording.getURI()
        console.log('Recording stopped and stored at', uri);
        setStopBtn(new Object({ opacity: 0.4, disabled: true }))
        setStartBtn(new Object({ opacity: 1, disabled: false }))
        navigation.push("Play", {
            uri
        })
    }
    return (
        <View style={styles.view}>

            <TouchableOpacity onPress={() => startRecording()} disabled={startBtn.disabled}>
                <Image source={require("./assets/Record.imageset/Record.png")} style={[styles.play, { opacity: startBtn.opacity }]} />
            </TouchableOpacity>
            <Text>Tab to Record</Text>
            {
                <TouchableOpacity onPress={() => stopRecording()} disabled={stopBtn.disabled}>
                    <Image source={require("./assets/Stop.imageset/Stop.png")}
                        style={[styles.stop, { opacity: stopBtn.opacity }]}
                    />
                </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    play: {
        width: 100,
        height: 100
    },
    stop: {
        width: 70,
        height: 70,
        marginTop: 10,
    }
})
