import { TestBed } from '@angular/core/testing';

import { BestSongsService } from './best-songs.service';

describe('BestSongsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BestSongsService = TestBed.get(BestSongsService);
    expect(service).toBeTruthy();
  });
});
