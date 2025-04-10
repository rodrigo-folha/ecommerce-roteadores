import { Component } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {OnDestroy, inject, signal} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';

@Component({
  selector: 'app-header-admin',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterLink],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
  // protected readonly isMobile = signal(true);

  // private readonly _mobileQuery: MediaQueryList;
  // private readonly _mobileQueryListener: () => void;

  constructor(private sidebarService: SidebarService) {
    // const media = inject(MediaMatcher);

    // this._mobileQuery = media.matchMedia('(max-width: 600px)');
    // this.isMobile.set(this._mobileQuery.matches);
    // this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    // this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  // ngOnDestroy(): void {
  //   this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  // }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

}
