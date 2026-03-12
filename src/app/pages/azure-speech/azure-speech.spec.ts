import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzureSpeech } from './azure-speech';

describe('AzureSpeech', () => {
  let component: AzureSpeech;
  let fixture: ComponentFixture<AzureSpeech>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AzureSpeech]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AzureSpeech);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
