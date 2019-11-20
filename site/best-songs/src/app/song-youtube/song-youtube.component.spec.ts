import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongYoutubeComponent } from './song-youtube.component';

describe('SongYoutubeComponent', () => {
  let component: SongYoutubeComponent;
  let fixture: ComponentFixture<SongYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
