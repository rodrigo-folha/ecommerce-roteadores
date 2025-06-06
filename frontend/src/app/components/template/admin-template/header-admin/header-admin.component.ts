import { Component } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {OnDestroy, inject, signal} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Usuario } from '../../../../models/usuario.model';

@Component({
  selector: 'app-header-admin',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterLink],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();

  constructor(
    private sidebarService: SidebarService, 
    private authService: AuthService,
    private router: Router,
  ) {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.obterUsuarioLogado();
  }

  obterUsuarioLogado() {
    this.subscription.add(this.authService.getUsuarioLogado().subscribe(
      usuario => this.usuarioLogado = usuario
    ));
  }

  deslogar() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    this.router.navigate(['/admin/login']);
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

}
