import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = 'http://localhost:3001';
  private readonly MAX_FILES = 10;
  private readonly MIN_FILES = 2;

  constructor(private http: HttpClient) { }

  mergePdfs(files: File[]) {
    // Dosya sayısı kontrolü
    if (files.length < this.MIN_FILES) {
      return throwError(() => new Error(`Please select at least ${this.MIN_FILES} PDF files`));
    }
    if (files.length > this.MAX_FILES) {
      return throwError(() => new Error(`You can select maximum ${this.MAX_FILES} PDF files`));
    }

    // PDF dosya tipi kontrolü - tüm dosyaları kontrol et
    const nonPdfFile = files.find(file => file.type !== 'application/pdf');
    if (nonPdfFile) {
      return throwError(() => new Error('Only PDF files are allowed'));
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('pdfs', file);
    });

    return this.http.post(`${this.apiUrl}/merge`, formData, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      map(response => response.body),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while merging PDFs';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || errorMessage;
    }

    return throwError(() => new Error(errorMessage));
  }
}