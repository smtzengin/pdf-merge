import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { PdfService } from '../_services/pdf.service';
import { PdfMergeComponent } from './pdf-merge.component';

describe('PdfMergeComponent', () => {
  let component: PdfMergeComponent;
  let fixture: ComponentFixture<PdfMergeComponent>;
  let pdfService: jasmine.SpyObj<PdfService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PdfService', ['mergePdfs']);
    spy.mergePdfs.and.returnValue(of(new Blob()));

    await TestBed.configureTestingModule({
      imports: [PdfMergeComponent, HttpClientTestingModule],
      providers: [
        { provide: PdfService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfMergeComponent);
    component = fixture.componentInstance;
    pdfService = TestBed.inject(PdfService) as jasmine.SpyObj<PdfService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', () => {
    const mockFiles = [
      new File([''], 'test1.pdf', { type: 'application/pdf' }),
      new File([''], 'test2.pdf', { type: 'application/pdf' })
    ];
    
    const event = { target: { files: mockFiles } };
    component.onFileSelect(event);
    
    expect(component.selectedFiles.length).toBe(2);
    expect(component.error).toBeNull();
  });

  it('should validate file count', () => {
    const mockFiles = Array(11).fill(new File([''], 'test.pdf', { type: 'application/pdf' }));
    const event = { target: { files: mockFiles } };
    
    component.onFileSelect(event);
    
    expect(component.error).toContain('Maximum');
    expect(component.selectedFiles.length).toBe(0);
  });

  it('should validate file type', () => {
    const mockFiles = [
      new File([''], 'test.txt', { type: 'text/plain' })
    ];
    
    const event = { target: { files: mockFiles } };
    component.onFileSelect(event);
    
    expect(component.error).toContain('Only PDF files');
  });

  it('should merge PDFs successfully', fakeAsync(() => {
    const mockFiles = [
      new File([''], 'test1.pdf', { type: 'application/pdf' }),
      new File([''], 'test2.pdf', { type: 'application/pdf' })
    ];
    component.selectedFiles = mockFiles;
    
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(window.URL, 'revokeObjectURL');
    const mockLink = { click: jasmine.createSpy('click') };
    spyOn(document, 'createElement').and.returnValue(mockLink as any);
    
    component.mergePdfs();
    tick();
    
    expect(pdfService.mergePdfs).toHaveBeenCalled();
    expect(component.selectedFiles.length).toBe(0);
    expect(component.error).toBeNull();
  }));
});
