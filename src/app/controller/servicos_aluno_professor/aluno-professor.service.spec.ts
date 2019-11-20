import { TestBed } from '@angular/core/testing';

import { AlunoProfessorService } from './aluno-professor.service';

describe('AlunoProfessorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlunoProfessorService = TestBed.get(AlunoProfessorService);
    expect(service).toBeTruthy();
  });
});
