import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarService } from '../../../services/sidebar.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, MatToolbarModule, RouterLink, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @ViewChild('drawer') public drawer!: MatDrawer;

  constructor(private sidebarService: SidebarService) {}

  ngAfterViewInit(): void {
    this.sidebarService.sideNavToggleSubject.subscribe(() => {
      this.drawer.toggle();
    });
  }
  
}
