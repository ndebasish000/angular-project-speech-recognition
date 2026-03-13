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

  chatData: any[] = [];
  inputText = '';

  @ViewChild('aiInput')
  aiInput!: ElementRef<HTMLTextAreaElement>;

  constructor(public azureSpeechService: AzureSpeechService) {
    this.azureSpeechService.appendFinalText = (text: string) => {
      this.inputText += " " + text;
    };
  }

  ngAfterViewChecked() {
    // this.scrollInputToEnd();
    this.resizeTextarea();
  }

  // scrollInputToEnd() {
  //   if (!this.aiInput) return;
  //   const input = this.aiInput.nativeElement;
  //   const length = input.value.length;
  //   input.setSelectionRange(length, length);
  //   input.scrollLeft = input.scrollWidth;
  // }

  onInputChange() {
    const textarea = this.aiInput.nativeElement;
    this.inputText = textarea.value;
    this.resizeTextarea();
  }

  resizeTextarea() {
    if (!this.aiInput) return;
    const textarea = this.aiInput.nativeElement;
    textarea.style.height = 'auto';
    const maxHeight = 120;
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = maxHeight + 'px';
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = textarea.scrollHeight + 'px';
      textarea.style.overflowY = 'hidden';
    }
    textarea.scrollTop = textarea.scrollHeight;
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
