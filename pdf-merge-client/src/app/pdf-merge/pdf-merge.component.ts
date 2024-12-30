import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PdfService } from '../_services/pdf.service';

@Component({
  selector: 'app-pdf-merge',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DragDropModule],
  templateUrl: './pdf-merge.component.html',
  styleUrls: ['./pdf-merge.component.css']
})
export class PdfMergeComponent implements AfterViewInit {
  @ViewChild('pageContainer') pageContainer!: ElementRef;
  private pdfService = inject(PdfService);
  selectedFiles: File[] = [];
  isLoading = false;
  error: string | null = null;
  isDragging = false;
  readonly MAX_FILES = 10;
  readonly MIN_FILES = 2;
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  ngAfterViewInit() {
    // Sayfa yüklendikten sonra transition'ı başlat
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
    this.processFiles(files);
  }

  onFileSelect(event: any) {
    const files = Array.from(event.target.files || []) as File[];
    this.processFiles(files);
  }

  onDrop(event: CdkDragDrop<File[]>) {
    moveItemInArray(this.selectedFiles, event.previousIndex, event.currentIndex);
  }

  private processFiles(files: File[]) {
    const allFiles = [...this.selectedFiles, ...files];
    
    if (allFiles.length > this.MAX_FILES) {
      this.error = `Maximum ${this.MAX_FILES} files can be selected`;
      return;
    }

    const invalidFiles = files.filter(file => {
      if (file.type !== 'application/pdf') {
        return true;
      }
      if (file.size > this.MAX_FILE_SIZE) {
        return true;
      }
      return false;
    });

    if (invalidFiles.length > 0) {
      this.error = 'Only PDF files under 10MB are allowed';
      return;
    }

    this.error = null;
    this.selectedFiles = allFiles;
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  async mergePdfs() {
    if (this.selectedFiles.length < this.MIN_FILES) {
      this.error = `Please select at least ${this.MIN_FILES} PDF files`;
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const response = await firstValueFrom(this.pdfService.mergePdfs(this.selectedFiles));
      if (!response) throw new Error('No response received');
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
      this.selectedFiles = [];
    } catch (error: any) {
      this.error = error.message || 'An error occurred while merging PDFs';
    } finally {
      this.isLoading = false;
    }
  }
}