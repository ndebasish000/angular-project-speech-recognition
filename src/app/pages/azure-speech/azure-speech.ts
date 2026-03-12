import { Component, ElementRef, ViewChild } from '@angular/core';
import { AzureSpeechService } from '../../services/azure-speech-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-azure-speech',
  imports: [CommonModule, FormsModule],
  templateUrl: './azure-speech.html',
  styleUrl: './azure-speech.scss',
})
export class AzureSpeech {

  // recorder!: MediaRecorder;

  // partialText = "";
  // finalText = "";

  // isRecording = false;

  // constructor(private azureSpeechService: AzureSpeechService) {
  //   // this.azureSpeechService.connect(
  //   //   (p: string) => this.partialText = p,
  //   //   (f: string) => {

  //   //     this.finalText += " " + f;
  //   //     this.partialText = "";

  //   //   });
  // }

  // async start() {
  //   this.isRecording = true;
  //   // this.azureSpeechService.start();
  //   const stream =
  //     await navigator.mediaDevices.getUserMedia({
  //       audio: {
  //         noiseSuppression: true,
  //         echoCancellation: true
  //       }
  //     });
  //   console.log("Stream started", stream);
  //   this.recorder = new MediaRecorder(stream);
  //   console.log("recorder started", this.recorder);
  //   this.recorder.ondataavailable = (e) => {

  //     if (e.data.size > 0) {
  //       this.azureSpeechService.sendAudio(e.data);
  //       // console.log("Audio data available", e.data);
  //     }
  //   };
  //   this.recorder.start(400);
  // }

  // stop() {
  //   this.isRecording = false;
  //   this.recorder.stop();
  //   // this.azureSpeechService.stop();
  // }

  chatData: any[] = [];
  inputText = '';

  @ViewChild('aiInput')
  aiInput!: ElementRef<HTMLInputElement>;

  constructor(public azureSpeechService: AzureSpeechService) {
    this.azureSpeechService.appendFinalText = (text: string) => {
      this.inputText += " " + text;
    };
  }

  ngAfterViewChecked() {
    this.scrollInputToEnd();
  }

  scrollInputToEnd() {
    if (!this.aiInput) return;
    const input = this.aiInput.nativeElement;
    const length = input.value.length;
    input.setSelectionRange(length, length);
    input.scrollLeft = input.scrollWidth;
  }

  start() {
    this.azureSpeechService.startRecognition();
  }

  stop() {
    this.azureSpeechService.stopRecognition();
  }

  sendMessage() {
    const message = this.inputText.trim();
    if (!message.trim()) return;
    this.chatData.push({
      text: message,
      type: 'sent'
    });
    this.inputText = '';
    this.azureSpeechService.clear();
  }

}
