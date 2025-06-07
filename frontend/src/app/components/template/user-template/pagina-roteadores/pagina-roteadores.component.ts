import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component, effect, LOCALE_ID, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Roteador } from '../../../../models/roteador.model';
import { RoteadorService } from '../../../../services/roteador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService } from '../../../../services/carrinho.service';
import { ClienteService } from '../../../../services/cliente.service';
import { RoteadorFilterRequest } from '../../../../models/roteador-filter-request';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { BuscaRoteadoresService } from '../../../../services/busca-roteadores.service';
import { forkJoin, map } from 'rxjs';
registerLocaleData(localePt);

type Card = {
  idRoteador: number;
  titulo: string;
  preco: number;
  protocoloSeguranca: string;
  bandaFrequencia: string;
  quantidadeAntena: number;
  rating: number;
  reviews: number;
  imagemUrl: string;
  estoque: number;
};

@Component({
  selector: 'app-pagina-roteadores',
  providers: [provideNativeDateAdapter(), {
          provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
          { provide: LOCALE_ID, useValue: 'pt-BR'}
        ],
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pagina-roteadores.component.html',
  styleUrl: './pagina-roteadores.component.css'
})
export class PaginaRoteadoresComponent implements OnInit {

  roteadores: Roteador[] = [];
  cards = signal<Card[]>([]);
  listaDesejo: number[] = [];
  sortBy: 'preco-asc' | 'preco-desc' = 'preco-asc';

  constructor(
    private roteadorService: RoteadorService,
    private snackBar: MatSnackBar,
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private buscaService: BuscaRoteadoresService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      const termo = params['busca'] || '';
      this.buscaService.atualizarTermoBusca(termo);
    });

    effect(() => {
      const termo = this.buscaService.termoBusca();
      this.nomeFiltro = termo;
      this.applyFilters();
    });
    
  }

  ngOnInit(): void {
    // this.carregarRoteadores();
    window.scroll(0,0);
    const usuarioLogado = localStorage.getItem('usuario_logado');
    if (usuarioLogado) {
      this.carregarListaDesejos();
    }
  }

  carregarRoteadores() {
    this.roteadorService.findAll().subscribe((data) => {
      this.roteadores = data.resultado;
      this.carregarCards();
    })
  }

  // carregarCards() {
  //   const cards: Card[] = [];
  //   this.roteadores.forEach((roteador) => {
  //     this.roteadorService.countQuantidadeTotalById(roteador.id).subscribe((estoque) => {
  //       cards.push({
  //         idRoteador: roteador.id,
  //         titulo: roteador.nome,
  //         preco: roteador.preco,
  //         bandaFrequencia: roteador.bandaFrequencia.nome,
  //         protocoloSeguranca: roteador.protocoloSeguranca.nome,
  //         quantidadeAntena: roteador.quantidadeAntena.quantidade,
  //         rating: 4.8,
  //         reviews: 100,
  //         imagemUrl: this.roteadorService.getUrlImage(roteador.listaImagem[0].toString()),
  //         estoque: estoque
  //       });

  //       if (cards.length === this.roteadores.length) {
  //         this.cards.set(cards);
  //       }
  //     });
  //   });
  // }

  carregarCards() {
    const observables = this.roteadores.map((roteador) =>
      this.roteadorService.countQuantidadeTotalById(roteador.id).pipe(
        map((estoque) => ({
          idRoteador: roteador.id,
          titulo: roteador.nome,
          preco: roteador.preco,
          bandaFrequencia: roteador.bandaFrequencia.nome,
          protocoloSeguranca: roteador.protocoloSeguranca.nome,
          quantidadeAntena: roteador.quantidadeAntena.quantidade,
          rating: 4.8,
          reviews: 100,
          imagemUrl: this.roteadorService.getUrlImage(roteador.listaImagem[0].toString()),
          estoque
        }))
      )
    );

    forkJoin(observables).subscribe((cardsFinal) => {
      this.cards.set(cardsFinal);
    });
  }

  // Filtros
  priceRange = { 
    min: 0,
    max: 100000
  };
  minPrice = 0
  maxPrice = 100000

  // Opções de filtro
  securityProtocols = [
    { id: 7, name: "WPS", checked: false },
    { id: 1, name: "WPA2-PSK", checked: false },
    { id: 2, name: "WPA3", checked: false },
    { id: 3, name: "WEP", checked: false },
  ]

  operatingSystems = [
    { id: 3, name: "RouterOS", checked: false },
    { id: 1, name: "Cisco IOS", checked: false },
    { id: 4, name: "ZynOS", checked: false },
    { id: 2, name: "Juno OS", checked: false },
  ]

  frequencyBands = [
    { id: 1, name: "Single-Band", checked: false },
    { id: 2, name: "Dual-Band", checked: false },
    { id: 3, name: "Tri-Band", checked: false },
    { id: 4, name: "Quad-Band", checked: false },
  ]

  antennaCounts = [
    { name: "1 Antena", value: 1, checked: false },
    { name: "2 Antenas", value: 2, checked: false },
    { name: "3 Antenas", value: 3, checked: false },
    { name: "4 Antenas", value: 4, checked: false },
    { name: "5+ Antenas", value: 5, checked: false },
  ]

  wirelessSignals = [
    { id: 2, name: "Wi-Fi 6", checked: false },
    { id: 1, name: "Wi-Fi 5", checked: false },
  ]

  // Estado do filtro
  isFilterOpen = true


  onMinPriceSliderChange(event: any) {
    const value = +event.target.value;
    this.minPrice = Math.min(value, this.maxPrice);
  }

  onMaxPriceSliderChange(event: any) {
    const value = +event.target.value;
    this.maxPrice = Math.max(value, this.minPrice);
  }

  onMinPriceInputChange() {
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice;
    }
    if (this.minPrice < this.priceRange.min) {
      this.minPrice = this.priceRange.min;
    }
  }

  onMaxPriceInputChange() {
    if (this.maxPrice < this.minPrice) {
      this.maxPrice = this.minPrice;
    }
    if (this.maxPrice > this.priceRange.max) {
      this.maxPrice = this.priceRange.max;
    }
  }

  nomeFiltro: string = '';

  applyFilters(): void {
    const filtros: RoteadorFilterRequest = {
      precoMin: this.minPrice,
      precoMax: this.maxPrice,
      protocolosSeguranca: this.securityProtocols.filter(p => p.checked).map(p => p.id.toString()),
      sistemasOperacionais: this.operatingSystems.filter(os => os.checked).map(os => os.id.toString()),
      bandasFrequencia: this.frequencyBands.filter(band => band.checked).map(band => band.id.toString()),
      qtdAntenas: this.antennaCounts.filter(a => a.checked).map(a => a.value),
      sinaisWireless: this.wirelessSignals.filter(signal => signal.checked).map(signal => signal.id.toString()),
      nome: this.nomeFiltro,
      sortBy: this.sortBy
    };

    this.roteadorService.buscarComFiltros(filtros).subscribe({
      next: (result) => {
        this.roteadores = result;

        const maiorPreco = Math.max(...this.roteadores.map(r => r.preco));
        this.priceRange.max = maiorPreco;
        this.maxPrice = maiorPreco;
        
        this.carregarCards();
        window.scroll(0,0);
      },
      error: (error) => {
        console.error('Erro ao buscar roteadores com filtros', error);
      }
      
    });
  }


  clearFilters(): void {
    this.minPrice = this.priceRange.min;
    this.maxPrice = this.priceRange.max;

    this.securityProtocols.forEach(p => p.checked = false);
    this.operatingSystems.forEach(os => os.checked = false);
    this.frequencyBands.forEach(b => b.checked = false);
    this.antennaCounts.forEach(a => a.checked = false);
    this.wirelessSignals.forEach(w => w.checked = false);

    this.nomeFiltro = '';

    this.router.navigate(['/roteadores']);

  }

  // Alternar visibilidade do filtro em dispositivos móveis
  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen
  }

  // Verificar se algum filtro está ativo
  hasActiveFilters(): boolean {
    return (
      this.minPrice > this.priceRange.min ||
      this.maxPrice < this.priceRange.max ||
      this.securityProtocols.some((item) => item.checked) ||
      this.operatingSystems.some((item) => item.checked) ||
      this.frequencyBands.some((item) => item.checked) ||
      this.antennaCounts.some((item) => item.checked) ||
      this.wirelessSignals.some((item) => item.checked)
    )
  }

  // Funções para gerenciar produtos
  toggleWishlist(product: any) {
    product.inWishlist = !product.inWishlist
    console.log(product.inWishlist ? "Adicionado à lista de desejos:" : "Removido da lista de desejos:", product)
  }

  adicionarAoCarrinho(card: Card) {
    this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi adicionado ao carrinho.')
    this.carrinhoService.adicionar({
      id: card.idRoteador,
      nome: card.titulo,
      preco: card.preco,
      quantidade: 1,
      imageUrl: card.imagemUrl
    })
  }

  carregarListaDesejos() {
    this.clienteService.buscarListaDesejo().subscribe((lista) => {
      this.listaDesejo = lista.map(item => item.idProduto);
    })
  }

  isInWishlist(card: Card): boolean {
    return this.listaDesejo.includes(card.idRoteador);
  }

  adicionarItemListaDesejo(card: Card) {
    if (this.isInWishlist(card)) {
      this.clienteService.removerItemListaDesejo(card.idRoteador).subscribe(() => {
        this.listaDesejo = this.listaDesejo.filter(item => item !== card.idRoteador);
        this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi removido da lista de desejos.')
      });
    } else {
      this.clienteService.adicionarItemListaDesejo(card.idRoteador).subscribe(() => {
        this.listaDesejo.push(card.idRoteador);
        this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi adicionado a lista de desejos.')
      })
    }
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
}
