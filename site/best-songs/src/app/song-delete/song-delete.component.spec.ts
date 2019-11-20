import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongDeleteComponent } from './song-delete.component';

describe('SongDeleteComponent', () => {
  let component: SongDeleteComponent;
  let fixture: ComponentFixture<SongDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
