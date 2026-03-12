import { TestBed } from '@angular/core/testing';

import { AzureSpeechService } from './azure-speech-service';

describe('AzureSpeechService', () => {
  let service: AzureSpeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureSpeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
