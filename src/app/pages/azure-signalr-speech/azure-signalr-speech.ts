import { Component } from '@angular/core';
import { AzureSignalrSpeechService } from '../../services/azure-signalr-speech-service';

@Component({
  selector: 'app-azure-signalr-speech',
  imports: [],
  templateUrl: './azure-signalr-speech.html',
  styleUrl: './azure-signalr-speech.scss',
})
export class AzureSignalrSpeech {

  recorder!: MediaRecorder;

  partialText = "";
  finalText = "";

  isRecording = false;

  constructor(private azureSpeechService: AzureSignalrSpeechService) {
    // this.azureSpeechService.connect(
    //   (p: string) => this.partialText = p,
    //   (f: string) => {

    //     this.finalText += " " + f;
    //     this.partialText = "";

    //   });
  }

  async start() {
    this.isRecording = true;
    this.azureSpeechService.start();
    // const stream =
    //   await navigator.mediaDevices.getUserMedia({
    //     audio: {
    //       noiseSuppression: true,
    //       echoCancellation: true
    //     }
    //   });
    // console.log("Stream started", stream);
    // this.recorder = new MediaRecorder(stream);
    // console.log("recorder started", this.recorder);
    // this.recorder.ondataavailable = (e) => {

    //   if (e.data.size > 0) {
    //     this.azureSpeechService.sendAudio(e.data);
    //     // console.log("Audio data available", e.data);
    //   }
    // };
    // this.recorder.start(400);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        noiseSuppression: true,
        echoCancellation: true
      }
    });

    const audioContext = new AudioContext({
      sampleRate: 16000
    });

    const source =
      audioContext.createMediaStreamSource(stream);

    const processor =
      audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (event) => {

      const input =
        event.inputBuffer.getChannelData(0);

      const pcmData =
        this.convertFloat32ToInt16(input);

      this.azureSpeechService.sendAudio(pcmData);

    };

  }

  convertFloat32ToInt16(buffer: Float32Array) {

    const l = buffer.length;
    const result = new Int16Array(l);

    for (let i = 0; i < l; i++) {
      result[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7fff;
    }

    return result;

  }

  stop() {
    this.isRecording = false;
    // this.recorder.stop();
    this.azureSpeechService.stop();
  }

}
