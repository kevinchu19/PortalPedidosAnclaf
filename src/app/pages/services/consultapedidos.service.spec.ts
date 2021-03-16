import { TestBed } from '@angular/core/testing';

import { ConsultapedidosService } from './consultapedidos.service';

describe('ConsultapedidosService', () => {
  let service: ConsultapedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultapedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
