import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class AzureSignalrSpeechService {

  private connection!: signalR.HubConnection;

  async connect(partialCb: any, finalCb: any) {

    this.connection =
      new signalR.HubConnectionBuilder()
        .withUrl("http://192.168.41.179:5076/speechHub")
        .withAutomaticReconnect()
        .build();

    await this.connection.start();

    this.connection.on("partialText", (text: string) => {
      console.log("Partial text received", text);
      partialCb(text);
    });

    this.connection.on("finalText", (text: string) => {
      console.log("Final text received", text);
      finalCb(text);
    });

  }

  async start() {
    await this.connection.invoke("StartRecognition");
  }

  async stop() {
    await this.connection.invoke("StopRecognition");
  }

  // async sendAudio(blob: Blob) {
  //   const buffer = await blob.arrayBuffer();
  //   // console.log("Audio data available", Array.from(new Uint8Array(buffer)));

  //   const bytes = Array.from(new Uint8Array(buffer));

  //   this.connection.invoke("SendAudio", bytes);

  // }

  async sendAudio(pcm: Int16Array) {

    const bytes = new Uint8Array(pcm.buffer);

    await this.connection.invoke("SendAudio", Array.from(bytes));

  }

}
