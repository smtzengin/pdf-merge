import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocxService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  convertToPdf(file: File) {
    const formData = new FormData();
    formData.append('docx', file);

    return this.http.post(`${this.apiUrl}/convert`, formData, {
      responseType: 'blob'
    });
  }
}