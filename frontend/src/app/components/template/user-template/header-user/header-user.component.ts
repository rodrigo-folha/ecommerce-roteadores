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
import { ClienteService } from '../../../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';

@Component({
  selector: 'app-header-user',
  imports: [CommonModule, RouterLink, FormsModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent implements OnInit, OnDestroy {

  fotoPerfil: string | ArrayBuffer | null = null;
  imageDefault: string = '../login/person.svg'
  isMenuOpen = false
  isDarkMode = false
  usuarioLogado: Usuario | null = null;
  cliente: Cliente | null = null;
  private subscription = new Subscription();

  constructor(private authService: AuthService,
    public carrinhoService: CarrinhoService,
    private router: Router,
    private clienteService: ClienteService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  ngOnInit(): void {
    this.obterUsuarioLogado();
  }

  obterUsuarioLogado() {
    this.subscription.add(this.authService.getUsuarioLogado().subscribe((usuario) => {
      this.usuarioLogado = usuario
      if (usuario) {
        this.obterCliente(usuario.email);
      }
    }
    ));
  }

  obterCliente(email: string) {
    this.clienteService.findByUsuario(email).subscribe((cliente) => {
      this.cliente = cliente;
      this.clienteService.getUrlImageHeader(cliente.nomeImagem).subscribe({
        next: (blob) => {
          const objectURL = URL.createObjectURL(blob);
          this.fotoPerfil = objectURL;
        },
        error: (err) => {
          console.error('Erro ao carregar imagem:', err);
        }
      })
    })

  }

  irParaListaDesejos() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/minha-conta'], { queryParams: { aba: 4 } });
    });
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
