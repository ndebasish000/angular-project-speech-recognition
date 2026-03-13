import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzureSignalrSpeech } from './azure-signalr-speech';

describe('AzureSignalrSpeech', () => {
  let component: AzureSignalrSpeech;
  let fixture: ComponentFixture<AzureSignalrSpeech>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AzureSignalrSpeech]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AzureSignalrSpeech);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
