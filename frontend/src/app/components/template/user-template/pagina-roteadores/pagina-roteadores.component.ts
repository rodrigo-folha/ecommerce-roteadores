import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Roteador } from '../../../../models/roteador.model';
import { RoteadorService } from '../../../../services/roteador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService } from '../../../../services/carrinho.service';
import { ClienteService } from '../../../../services/cliente.service';

interface Product {
  id: string
  name: string
  category: string
  price: number
  salePrice: number | null
  image: string
  badge: string | null
  rating: number
  reviews: number
  inWishlist: boolean
  securityProtocol: string
  operatingSystem: string
  frequencyBand: string
  antennaCount: number
  wirelessSignal: string
}

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
};

@Component({
  selector: 'app-pagina-roteadores',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pagina-roteadores.component.html',
  styleUrl: './pagina-roteadores.component.css'
})
export class PaginaRoteadoresComponent implements OnInit {

  roteadores: Roteador[] = [];
  cards = signal<Card[]>([]);
  listaDesejo: number[] = [];
  constructor(
    private roteadorService: RoteadorService,
    private snackBar: MatSnackBar,
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
  ) {
    this.filteredProducts = [...this.allProducts]

    // Definir os valores mínimo e máximo com base nos produtos
    this.updatePriceRange()
  }

  ngOnInit(): void {
    this.carregarRoteadores();
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

  carregarCards() {
    const cards: Card[] = [];
    this.roteadores.forEach((roteador) => {
      cards.push({
        idRoteador: roteador.id,
        titulo: roteador.nome,
        preco: roteador.preco,
        bandaFrequencia: roteador.bandaFrequencia.nome,
        protocoloSeguranca: roteador.protocoloSeguranca.nome,
        quantidadeAntena: roteador.quantidadeAntena.quantidade,
        rating: 4.8,
        reviews: 100,
        imagemUrl: this.roteadorService.getUrlImage(roteador.listaImagem[0].toString())
      })
    })
    this.cards.set(cards);
  }

  // Filtros
  priceRange = { min: 0, max: 100000 }
  minPrice = 0
  maxPrice = 100000

  // Opções de filtro
  securityProtocols = [
    { name: "WPS", checked: false },
    { name: "WPA2-PSK", checked: false },
    { name: "WPA3", checked: false },
    { name: "WEP", checked: false },
  ]

  operatingSystems = [
    { name: "RouterOS", checked: false },
    { name: "Cisco IOS", checked: false },
    { name: "ZynOS", checked: false },
    { name: "Juno OS", checked: false },
  ]

  frequencyBands = [
    { name: "Single-Band", checked: false },
    { name: "Dual-Band", checked: false },
    { name: "Tri-Band", checked: false },
    { name: "Quad-Band", checked: false },
  ]

  antennaCounts = [
    { name: "1 Antena", value: 1, checked: false },
    { name: "2 Antenas", value: 2, checked: false },
    { name: "3 Antenas", value: 3, checked: false },
    { name: "4 Antenas", value: 4, checked: false },
    { name: "5+ Antenas", value: 5, checked: false },
  ]

  wirelessSignals = [
    { name: "Wi-Fi 6", checked: false },
    { name: "Wi-Fi 5", checked: false },
  ]

  // Estado do filtro
  isFilterOpen = true

  // Produtos
  allProducts: Product[] = [
    {
      id: "router-tp-link-ac1200",
      name: "Roteador TP-Link AC1200 Dual Band",
      category: "Roteadores",
      price: 199.99,
      salePrice: 179.99,
      image: "../login/placeholder.svg",
      badge: "Oferta",
      rating: 4.5,
      reviews: 128,
      inWishlist: false,
      securityProtocol: "WPA2",
      operatingSystem: "Linux",
      frequencyBand: "Dual Band",
      antennaCount: 4,
      wirelessSignal: "Alta Potência",
    },
    {
      id: "router-netgear-nighthawk",
      name: "Roteador Netgear Nighthawk Pro Gaming XR500",
      category: "Roteadores",
      price: 599.99,
      salePrice: null,
      image: "../login/placeholder.svg",
      badge: "Premium",
      rating: 4.8,
      reviews: 64,
      inWishlist: true,
      securityProtocol: "WPA3",
      operatingSystem: "Linux",
      frequencyBand: "Dual Band",
      antennaCount: 4,
      wirelessSignal: "Alta Potência",
    },
    {
      id: "router-asus-rt-ax88u",
      name: "Roteador ASUS RT-AX88U AX6000",
      category: "Roteadores",
      price: 799.99,
      salePrice: 749.99,
      image: "../login/placeholder.svg",
      badge: "Novo",
      rating: 4.7,
      reviews: 42,
      inWishlist: false,
      securityProtocol: "WPA3",
      operatingSystem: "Linux",
      frequencyBand: "Dual Band",
      antennaCount: 5,
      wirelessSignal: "Alta Potência",
    },
    {
      id: "router-linksys-ea7500",
      name: "Roteador Linksys EA7500 Max-Stream AC1900",
      category: "Roteadores",
      price: 349.99,
      salePrice: null,
      image: "../login/placeholder.svg",
      badge: null,
      rating: 4.3,
      reviews: 96,
      inWishlist: false,
      securityProtocol: "WPA2",
      operatingSystem: "Linux",
      frequencyBand: "Dual Band",
      antennaCount: 3,
      wirelessSignal: "Padrão",
    },
    {
      id: "router-d-link-dir-842",
      name: "Roteador D-Link DIR-842 AC1200",
      category: "Roteadores",
      price: 149.99,
      salePrice: 129.99,
      image: "../login/placeholder.svg",
      badge: "Econômico",
      rating: 4.0,
      reviews: 78,
      inWishlist: false,
      securityProtocol: "WPA2",
      operatingSystem: "Linux",
      frequencyBand: "Dual Band",
      antennaCount: 2,
      wirelessSignal: "Padrão",
    },
    {
      id: "router-tenda-ac10",
      name: "Roteador Tenda AC10 AC1200",
      category: "Roteadores",
      price: 129.99,
      salePrice: null,
      image: "../login/placeholder.svg",
      badge: null,
      rating: 3.9,
      reviews: 56,
      inWishlist: false,
      securityProtocol: "WPA2",
      operatingSystem: "Linux",
      frequencyBand: "Dual Band",
      antennaCount: 3,
      wirelessSignal: "Padrão",
    },
    {
      id: "router-xiaomi-ax3600",
      name: "Roteador Xiaomi AX3600 WiFi 6",
      category: "Roteadores",
      price: 399.99,
      salePrice: 349.99,
      image: "../login/placeholder.svg",
      badge: "WiFi 6",
      rating: 4.6,
      reviews: 37,
      inWishlist: true,
      securityProtocol: "WPA3",
      operatingSystem: "Android",
      frequencyBand: "Dual Band",
      antennaCount: 5,
      wirelessSignal: "Alta Potência",
    },
    {
      id: "router-tp-link-archer-c6",
      name: "Roteador TP-Link Archer C6 AC1200",
      category: "Roteadores",
      price: 179.99,
      salePrice: null,
      image: "../login/placeholder.svg",
      badge: null,
      rating: 4.2,
      reviews: 112,
      inWishlist: false,
      securityProtocol: "WPA2",
      operatingSystem: "Linux",
      frequencyBand: "Dual Band",
      antennaCount: 4,
      wirelessSignal: "Padrão",
    },
    {
      id: "router-mercusys-ac12",
      name: "Roteador Mercusys AC12 AC1200",
      category: "Roteadores",
      price: 99.99,
      salePrice: 89.99,
      image: "../login/placeholder.svg",
      badge: "Básico",
      rating: 3.8,
      reviews: 45,
      inWishlist: false,
      securityProtocol: "WPA2",
      operatingSystem: "Linux",
      frequencyBand: "Dual Band",
      antennaCount: 2,
      wirelessSignal: "Padrão",
    },
    {
      id: "router-huawei-ax3",
      name: "Roteador Huawei AX3 WiFi 6+",
      category: "Roteadores",
      price: 299.99,
      salePrice: null,
      image: "../login/placeholder.svg",
      badge: "WiFi 6",
      rating: 4.4,
      reviews: 28,
      inWishlist: false,
      securityProtocol: "WPA3",
      operatingSystem: "Android",
      frequencyBand: "Dual Band",
      antennaCount: 4,
      wirelessSignal: "Alta Potência",
    },
    {
      id: "router-intelbras-action-rf1200",
      name: "Roteador Intelbras Action RF1200",
      category: "Roteadores",
      price: 159.99,
      salePrice: 139.99,
      image: "../login/placeholder.svg",
      badge: null,
      rating: 4.1,
      reviews: 87,
      inWishlist: false,
      securityProtocol: "WPA2",
      operatingSystem: "Linux",
      frequencyBand: "Dual Band",
      antennaCount: 3,
      wirelessSignal: "Padrão",
    },
    {
      id: "router-multilaser-re163v",
      name: "Roteador Multilaser RE163v",
      category: "Roteadores",
      price: 89.99,
      salePrice: null,
      image: "../login/placeholder.svg",
      badge: "Econômico",
      rating: 3.5,
      reviews: 62,
      inWishlist: false,
      securityProtocol: "WEP",
      operatingSystem: "Linux",
      frequencyBand: "2.4 GHz",
      antennaCount: 1,
      wirelessSignal: "Padrão",
    },
  ]

  filteredProducts: Product[] = [];

  updatePriceRange() {
    const prices = this.allProducts.map((product) => product.salePrice || product.price)
    this.priceRange.min = Math.floor(Math.min(...prices))
    this.priceRange.max = Math.ceil(Math.max(...prices))
    this.minPrice = this.priceRange.min
    this.maxPrice = this.priceRange.max
  }

  // Atualizar o valor mínimo quando o slider mudar
  onMinPriceSliderChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value
    this.minPrice = value
    if (this.minPrice > this.maxPrice) {
      this.maxPrice = this.minPrice
    }
    this.applyFilters()
  }

  // Atualizar o valor máximo quando o slider mudar
  onMaxPriceSliderChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value
    this.maxPrice = value
    if (this.maxPrice < this.minPrice) {
      this.minPrice = this.maxPrice
    }
    this.applyFilters()
  }

  // Atualizar o valor mínimo quando o input mudar
  onMinPriceInputChange() {
    if (this.minPrice < this.priceRange.min) {
      this.minPrice = this.priceRange.min
    }
    if (this.minPrice > this.maxPrice) {
      this.maxPrice = this.minPrice
    }
    this.applyFilters()
  }

  // Atualizar o valor máximo quando o input mudar
  onMaxPriceInputChange() {
    if (this.maxPrice > this.priceRange.max) {
      this.maxPrice = this.priceRange.max
    }
    if (this.maxPrice < this.minPrice) {
      this.minPrice = this.maxPrice
    }
    this.applyFilters()
  }

  // Aplicar todos os filtros
  applyFilters() {
    this.filteredProducts = this.allProducts.filter((product) => {
      const productPrice = product.salePrice || product.price

      // Filtro de preço
      if (productPrice < this.minPrice || productPrice > this.maxPrice) {
        return false
      }

      // Filtro de protocolo de segurança
      const securityFilters = this.securityProtocols.filter((f) => f.checked).map((f) => f.name)
      if (securityFilters.length > 0 && !securityFilters.includes(product.securityProtocol)) {
        return false
      }

      // Filtro de sistema operacional
      const osFilters = this.operatingSystems.filter((f) => f.checked).map((f) => f.name)
      if (osFilters.length > 0 && !osFilters.includes(product.operatingSystem)) {
        return false
      }

      // Filtro de banda de frequência
      const bandFilters = this.frequencyBands.filter((f) => f.checked).map((f) => f.name)
      if (bandFilters.length > 0 && !bandFilters.includes(product.frequencyBand)) {
        return false
      }

      // Filtro de quantidade de antenas
      const antennaFilters = this.antennaCounts.filter((f) => f.checked).map((f) => f.value)
      if (antennaFilters.length > 0) {
        // Caso especial para 5+ antenas
        if (product.antennaCount >= 5 && antennaFilters.includes(5)) {
          return true
        }
        if (!antennaFilters.includes(product.antennaCount)) {
          return false
        }
      }

      // Filtro de sinal wireless
      const signalFilters = this.wirelessSignals.filter((f) => f.checked).map((f) => f.name)
      if (signalFilters.length > 0 && !signalFilters.includes(product.wirelessSignal)) {
        return false
      }

      return true
    })
  }

  // Limpar todos os filtros
  clearFilters() {
    this.minPrice = this.priceRange.min
    this.maxPrice = this.priceRange.max

    this.securityProtocols.forEach((item) => (item.checked = false))
    this.operatingSystems.forEach((item) => (item.checked = false))
    this.frequencyBands.forEach((item) => (item.checked = false))
    this.antennaCounts.forEach((item) => (item.checked = false))
    this.wirelessSignals.forEach((item) => (item.checked = false))

    this.filteredProducts = [...this.allProducts]
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
