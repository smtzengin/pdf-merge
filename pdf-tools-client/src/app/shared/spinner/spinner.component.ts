import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../_services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-overlay" *ngIf="loadingService.isLoading$ | async">
      <div class="spinner"></div>
    </div>
  `
})
export class SpinnerComponent {
  constructor(public loadingService: LoadingService) {}
} 