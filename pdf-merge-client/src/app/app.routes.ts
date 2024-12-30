import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/merge', pathMatch: 'full' },
  { 
    path: 'merge', 
    loadComponent: () => import('./pdf-merge/pdf-merge.component')
      .then(m => m.PdfMergeComponent)
  },
  { 
    path: 'convert', 
    loadComponent: () => import('./docx-to-pdf/docx-to-pdf.component')
      .then(m => m.DocxToPdfComponent)
  }
];
