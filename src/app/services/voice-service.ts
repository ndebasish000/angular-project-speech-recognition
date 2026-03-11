import { Injectable, signal } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  recognition: any;

  finalTranscript = signal('');
  interimTranscript = signal('');
  isListening = signal(false);
  shouldRestart = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    this.recognition = new SpeechRecognition();

    this.recognition.lang = 'en-US';
    this.recognition.interimResults = true;
    this.recognition.continuous = false;

    this.initEvents();
  }

  initEvents() {
    this.recognition.onstart = () => {
      this.isListening.set(true);
    };

    this.recognition.onresult = (event: any) => {

      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
          this.appendFinalText(transcript);
        } else {
          interim += transcript;
        }
      }
      // this.finalTranscript.update(v => v + final);
      this.interimTranscript.set(interim);
    };

    this.recognition.onend = () => {
      this.isListening.set(false);

      if (this.shouldRestart) {
        setTimeout(() => {
          this.recognition.start();
        }, 50);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error("Speech error", event);
    };

  }

  appendFinalText: (text: string) => void = () => { };

  start() {
    if (this.isListening()) return;
    this.shouldRestart = true;
    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Already started");
    }
  }

  stop() {
    this.shouldRestart = false;
    if (!this.isListening()) return;
    this.recognition.stop();

  }

  clear() {
    this.finalTranscript.set('');
    this.interimTranscript.set('');
  }
}
