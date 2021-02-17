import { TestBed } from '@angular/core/testing';

import { NuevopedidoService } from './nuevopedido.service';

describe('NuevopedidoService', () => {
  let service: NuevopedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuevopedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
