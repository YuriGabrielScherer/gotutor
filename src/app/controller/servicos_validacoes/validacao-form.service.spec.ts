import { TestBed } from '@angular/core/testing';

import { ValidacaoFormService } from './validacao-form.service';

describe('ValidacaoFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidacaoFormService = TestBed.get(ValidacaoFormService);
    expect(service).toBeTruthy();
  });
});
