import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  constructor(private router: Router, private loadingService: LoadingService) {
    // NavigationStart'ı yakala
    this.router.events.pipe(
      filter((e): e is NavigationStart => e instanceof NavigationStart)
    ).subscribe(() => {
      this.loadingService.show();
    });

    // NavigationEnd, Cancel ve Error'ları yakala
    this.router.events.pipe(
      filter((e): e is NavigationEnd | NavigationCancel | NavigationError => 
        e instanceof NavigationEnd || 
        e instanceof NavigationCancel || 
        e instanceof NavigationError
      )
    ).subscribe(() => {
      this.loadingService.hide();
    });
  }
} 