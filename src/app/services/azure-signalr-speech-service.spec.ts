import { TestBed } from '@angular/core/testing';

import { AzureSignalrSpeechService } from './azure-signalr-speech-service';

describe('AzureSignalrSpeechService', () => {
  let service: AzureSignalrSpeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureSignalrSpeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
