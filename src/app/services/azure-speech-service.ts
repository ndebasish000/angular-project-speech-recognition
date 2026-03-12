import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

@Injectable({
  providedIn: 'root',
})
export class AzureSpeechService {

  // private connection!: signalR.HubConnection;

  // connect(partialCb: any, finalCb: any) {

  //   this.connection =
  //     new signalR.HubConnectionBuilder()
  //       .withUrl("https://localhost:5001/speechHub")
  //       .withAutomaticReconnect()
  //       .build();

  //   this.connection.start();

  //   this.connection.on("partialText", (text: string) => {
  //     partialCb(text);
  //   });

  //   this.connection.on("finalText", (text: string) => {
  //     finalCb(text);
  //   });

  // }

  // start() {
  //   this.connection.invoke("StartRecognition");
  // }

  // stop() {
  //   this.connection.invoke("StopRecognition");
  // }

  // async sendAudio(blob: Blob) {
  //   const buffer = await blob.arrayBuffer();
  //   console.log("Audio data available",  Array.from(new Uint8Array(buffer)));

  //   // this.connection.invoke(
  //   //   "SendAudio",
  //   //   Array.from(new Uint8Array(buffer))
  //   // );

  // }

  recognizer!: SpeechSDK.SpeechRecognizer;
  partialText = signal('');
  finalText = signal('');
  isListening = signal(false);

  startRecognition() {
    const speechConfig =
      SpeechSDK.SpeechConfig.fromSubscription(
        "1yjMj2jmcBVkeZ9tGwN6X0Lsw7CgvCeqMjWXw4QQQNUr1s94rGwOJQQJ99BDACYeBjFXJ3w3AAAAACOGLYWD",
        "eastus"
      );

    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.enableDictation();

    speechConfig.setProperty(
      SpeechSDK.PropertyId.SpeechServiceResponse_PostProcessingOption,
      "TrueText"
    );

    speechConfig.setProperty(
      SpeechSDK.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
      "1500"
    );

    const audioConfig =
      SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    this.recognizer =
      new SpeechSDK.SpeechRecognizer(
        speechConfig,
        audioConfig
      );

    this.isListening.set(true);

    this.recognizer.recognizing = (s, e) => {
      this.partialText.set(e.result.text);
    };

    this.recognizer.recognized = (s, e) => {
      if (e.result.text) {
        const current = this.finalText();
        const finaleText = current + " " + e.result.text
        this.finalText.set(finaleText);
        this.appendFinalText(e.result.text);
        this.partialText.set('');
      }
    };

    this.recognizer.canceled = () => {
      if (this.isListening()) {
        this.restart();
      }
    };

    this.recognizer.startContinuousRecognitionAsync();
  }

  appendFinalText: (text: string) => void = () => { };

  stopRecognition() {
    if (!this.recognizer) return;
    this.recognizer.stopContinuousRecognitionAsync();
    this.isListening.set(false);
  }

  restart() {
    this.recognizer.startContinuousRecognitionAsync();
  }

  clear() {
    this.finalText.set('');
    this.partialText.set('');
  }

}
