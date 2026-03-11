import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { VoiceService } from './services/voice-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  chatData: any[] = [];
  inputText = '';
  lastSpeech = '';

  constructor(public voice: VoiceService) {
    // effect(() => {

    //   const speech = this.voice.finalTranscript() + this.voice.interimTranscript();
    //   if (!speech) return;
    //   const newPart = speech.replace(this.lastSpeech, "");
    //   if (newPart) {
    //     this.inputText += newPart;
    //   }
    //   this.lastSpeech = speech;
    // });

    this.voice.appendFinalText = (text: string) => {
      this.inputText += " " + text;
    };
  }

  sendMessage() {
    const message = this.inputText.trim();
    if (!message.trim()) return;
    this.chatData.push({
      text: message,
      type: 'sent'
    });
    this.voice.clear();
    this.lastSpeech = '';
    this.inputText = '';
  }
}
