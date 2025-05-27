import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../../../models/usuario.model';
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';
import { CarrinhoService } from '../../../../services/carrinho.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header-user',
  imports: [CommonModule, RouterLink, FormsModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent implements OnInit, OnDestroy {

  isMenuOpen = false
  isDarkMode = false
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();

  constructor(private authService: AuthService,
    public carrinhoService: CarrinhoService,
    private router: Router,
  ) {}

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
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode
    if (this.isDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }

  contabilizarCarrinho() {

  }



}
