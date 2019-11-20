import { TestBed } from '@angular/core/testing';

import { YtPlayerService } from './yt-player.service';

describe('YtPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YtPlayerService = TestBed.get(YtPlayerService);
    expect(service).toBeTruthy();
  });
});
