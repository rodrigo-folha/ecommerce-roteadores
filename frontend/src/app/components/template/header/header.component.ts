import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  filterValue = '';

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {}

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
