import { TestBed } from '@angular/core/testing';

import { Unidades } from './unidades';

describe('Unidades', () => {
  let service: Unidades;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Unidades);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
