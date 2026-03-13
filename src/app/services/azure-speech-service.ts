import { Injectable, signal } from '@angular/core';
// import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';


@Injectable({
  providedIn: 'root',
})
export class AzureSpeechService {

  // recognizer!: SpeechSDK.SpeechRecognizer;
  private SpeechSDK: any;
  recognizer: any;
  partialText = signal('');
  finalText = signal('');
  isListening = signal(false);

  async loadSDK() {
    if (!this.SpeechSDK) {
      // this.SpeechSDK = await import(
      //   'microsoft-cognitiveservices-speech-sdk'
      // );

      await new Promise<void>((resolve) => {

        const script = document.createElement('script');

        script.src =
          'https://aka.ms/csspeech/jsbrowserpackageraw';

        script.onload = () => {
          this.SpeechSDK = (window as any).SpeechSDK;
          resolve();
        };

        document.body.appendChild(script);
      });
    }
  }

  async startRecognition() {
    await this.loadSDK();
    const speechConfig =
      this.SpeechSDK.SpeechConfig.fromSubscription(
        "1yjMj2jmcBVkeZ9tGwN6X0Lsw7CgvCeqMjWXw4QQQNUr1s94rGwOJQQJ99BDACYeBjFXJ3w3AAAAACOGLYWD",
        "eastus"
      );

    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.enableDictation();

    speechConfig.setProperty(
      this.SpeechSDK.PropertyId.SpeechServiceResponse_PostProcessingOption,
      "TrueText"
    );

    speechConfig.setProperty(
      this.SpeechSDK.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
      "1500"
    );

    const audioConfig =
      this.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    this.recognizer =
      new this.SpeechSDK.SpeechRecognizer(
        speechConfig,
        audioConfig
      );

    this.isListening.set(true);

    this.recognizer.recognizing = (s: any, e: any) => {
      this.partialText.set(e.result.text);
    };

    this.recognizer.recognized = (s: any, e: any) => {
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
