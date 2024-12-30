import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DocxService } from '../_services/docx.service';

@Component({
  selector: 'app-docx-to-pdf',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './docx-to-pdf.component.html',
  styleUrls: ['./docx-to-pdf.component.css']
})
export class DocxToPdfComponent implements AfterViewInit {
  @ViewChild('pageContainer') pageContainer!: ElementRef;

  private docxService = inject(DocxService);
  selectedFile: File | null = null;
  isLoading = false;
  error: string | null = null;
  isDragging = false;
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  ngAfterViewInit() {
    setTimeout(() => {
      this.pageContainer.nativeElement.classList.add('loaded');
    }, 50);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = Array.from(event.dataTransfer?.files || []) as File[];
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelect(event: any) {
    const files = Array.from(event.target.files || []) as File[];
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }

  private processFile(file: File) {
    if (file.size > this.MAX_FILE_SIZE) {
      this.error = 'File size too large. Maximum size is 10MB';
      return;
    }

    if (!file.type.includes('word')) {
      this.error = 'Only Word documents (.doc, .docx) are allowed';
      return;
    }

    this.error = null;
    this.selectedFile = file;
  }

  removeFile() {
    this.selectedFile = null;
    this.error = null;
  }

  async convertToPdf() {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.error = null;

    try {
      const response = await firstValueFrom(this.docxService.convertToPdf(this.selectedFile));
      if (!response) throw new Error('No response received');
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.selectedFile.name.replace(/\.[^/.]+$/, '')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      this.selectedFile = null;
    } catch (error: any) {
      this.error = error.message || 'An error occurred while converting the file';
    } finally {
      this.isLoading = false;
    }
  }
}