import { TestBed } from '@angular/core/testing';

import { DocxService } from './docx.service';

describe('DocxService', () => {
  let service: DocxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
