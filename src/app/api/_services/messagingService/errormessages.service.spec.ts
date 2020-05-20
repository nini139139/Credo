import { TestBed } from '@angular/core/testing';

import { ErrormessagesService } from './errormessages.service';

describe('ErrormessagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrormessagesService = TestBed.get(ErrormessagesService);
    expect(service).toBeTruthy();
  });
});
