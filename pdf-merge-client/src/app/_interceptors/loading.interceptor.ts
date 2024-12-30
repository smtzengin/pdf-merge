import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../_services/loading.service';

export function LoadingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const loadingService = inject(LoadingService);
  
  // Sadece API isteklerinde spinner göster
  if (req.url.includes('/api') || req.url.includes('localhost')) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (req.url.includes('/api') || req.url.includes('localhost')) {
        loadingService.hide();
      }
    })
  );
} 