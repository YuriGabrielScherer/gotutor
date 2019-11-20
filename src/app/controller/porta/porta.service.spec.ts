import { TestBed } from '@angular/core/testing';

import { PortaService } from './porta.service';

describe('PortaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PortaService = TestBed.get(PortaService);
    expect(service).toBeTruthy();
  });
});
