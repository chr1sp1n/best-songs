import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongTagsComponent } from './song-tags.component';

describe('SongTagsComponent', () => {
  let component: SongTagsComponent;
  let fixture: ComponentFixture<SongTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
