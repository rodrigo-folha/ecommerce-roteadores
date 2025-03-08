import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousEndpoint: string = '';
  private actualEndpoint: string = '';

  constructor(private router: Router) { }

  getPreviousEndpoint() {
    return this.previousEndpoint;
  }

  navigateTo(endpoint: string): void {
    this.previousEndpoint = this.router.url;
    this.router.navigate([endpoint]);
    this.actualEndpoint = this.router.url;
  }

  navigateBack(): void {
    if (this.previousEndpoint) {
      this.router.navigateByUrl(this.previousEndpoint);
    } else {
      this.router.navigate(['/']);
    }
  }
}
