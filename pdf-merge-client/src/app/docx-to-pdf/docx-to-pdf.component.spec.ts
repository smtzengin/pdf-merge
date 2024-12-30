import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { DocxService } from '../_services/docx.service';
import { DocxToPdfComponent } from './docx-to-pdf.component';

describe('DocxToPdfComponent', () => {
  let component: DocxToPdfComponent;
  let fixture: ComponentFixture<DocxToPdfComponent>;
  let docxService: jasmine.SpyObj<DocxService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DocxService', ['convertToPdf']);
    spy.convertToPdf.and.returnValue(of(new Blob()));

    await TestBed.configureTestingModule({
      imports: [DocxToPdfComponent, HttpClientTestingModule],
      providers: [
        { provide: DocxService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocxToPdfComponent);
    component = fixture.componentInstance;
    docxService = TestBed.inject(DocxService) as jasmine.SpyObj<DocxService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', () => {
    const mockFile = new File([''], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const event = { target: { files: [mockFile] } };
    
    component.onFileSelect(event);
    
    expect(component.selectedFile).toBeTruthy();
    expect(component.error).toBeNull();
  });

  it('should validate file size', () => {
    const largeFile = new File([''], 'large.docx', { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });
    
    const event = { target: { files: [largeFile] } };
    component.onFileSelect(event);
    
    expect(component.error).toContain('File size too large');
  });

  it('should validate file type', () => {
    const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [mockFile] } };
    
    component.onFileSelect(event);
    
    expect(component.error).toContain('Only Word documents');
  });

  it('should convert DOCX to PDF successfully', fakeAsync(() => {
    const mockFile = new File([''], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    component.selectedFile = mockFile;
    
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(window.URL, 'revokeObjectURL');
    const mockLink = { click: jasmine.createSpy('click') };
    spyOn(document, 'createElement').and.returnValue(mockLink as any);
    
    component.convertToPdf();
    tick();
    
    expect(docxService.convertToPdf).toHaveBeenCalled();
    expect(component.selectedFile).toBeNull();
    expect(component.error).toBeNull();
  }));
});
