import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, signal } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Roteador } from '../../../../models/roteador.model';
import { RoteadorService } from '../../../../services/roteador.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { RoteadoresCardsComponent } from "../roteadores-cards/roteadores-cards.component";
import { CarrinhoService } from '../../../../services/carrinho.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../../../services/cliente.service';
registerLocaleData(localePt);

interface ProductImage {
  id: string
  file?: File
  url: string
}

type Card = {
  idRoteador: number;
  titulo: string;
  preco: number;
  rating: number;
  reviews: number;
  imageUrl: string;
};

interface ProductReview {
  id: number
  user: string
  avatar: string
  rating: number
  date: string
  comment: string
  helpful: number
}

@Component({
  selector: 'app-pagina-produto',
  providers: [provideNativeDateAdapter(), {
        provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
        { provide: LOCALE_ID, useValue: 'pt-BR'}
      ],
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pagina-produto.component.html',
  styleUrl: './pagina-produto.component.css'
})
export class PaginaProdutoComponent {

  roteador: Roteador = new Roteador();
  imagensProduto: ProductImage[] = [];
  produtosRelacionados = signal<Card[]>([]);
  roteadoresSimilares: Roteador[] = [];
  listaDesejo: number[] = [];
  quantidadeAdicionar: number = 1;

  productId = ""
  quantity = 1
  selectedSize = "M"
  selectedColor = "Branco"
  inWishlist = false
  activeTab = "description"
  activeImageIndex = 0
  estoque: number | null = null;

  // Dados do produto (em um app real, estes dados viriam de um serviço)
  product = {
    id: "classic-white-tshirt",
    name: "Camiseta Clássica Branca",
    price: 29.99,
    salePrice: null,
    discount: null,
    rating: 4.8,
    reviews: 100,
    availability: "Em estoque",
    sku: "TSH-CW-001",
    description:
      "Uma camiseta branca clássica feita de algodão 100% orgânico. Perfeita para o uso diário, esta peça versátil combina com qualquer estilo e é essencial em qualquer guarda-roupa. O corte regular oferece conforto sem comprometer o estilo.",
    features: [
      "Conexão sem fio de alta performance",
      "Cobertura de sinal aprimorada com antenas externas",
      "Portas de rede para conexão cabeada",
      "Design compacto e funcional",
      "Compatível com diversos dispositivos",
      "Fabricado com responsabilidade ambiental",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Branco", "Preto", "Cinza", "Azul Marinho"],
    images: [
      { url: "../login/placeholder.svg", alt: "Camiseta Branca - Frente" },
      { url: "../login/placeholder.svg", alt: "Camiseta Branca - Detalhe" },
      { url: "../login/placeholder.svg", alt: "Camiseta Branca - Modelo" },
      { url: "../login/placeholder.svg", alt: "Camiseta Branca - Costas" },
    ],
    specifications: {
      material: "100% Algodão Orgânico",
      peso: "180g/m²",
      cuidados: "Lavar à máquina em água fria, não usar alvejante, secar na sombra",
      origem: "Brasil",
      sustentabilidade: "Certificado GOTS, produção com baixo impacto ambiental",
    },
    shipping: {
      methods: ["Padrão (3-5 dias úteis)", "Expresso (1-2 dias úteis)"],
      free: true,
      threshold: 50,
    },
  }

  // Produtos relacionados
  relatedProducts = [
    {
      id: "classic-black-tshirt",
      name: "Camiseta Clássica Preta",
      price: 29.99,
      image: "../login/placeholder.svg",
      rating: 4.3,
      reviews: 98,
    },
    {
      id: "striped-tshirt",
      name: "Camiseta Listrada",
      price: 34.99,
      image: "../login/placeholder.svg",
      rating: 4.1,
      reviews: 45,
    },
    {
      id: "graphic-tshirt",
      name: "Camiseta com Estampa",
      price: 39.99,
      salePrice: 29.99,
      image: "../login/placeholder.svg",
      rating: 4.7,
      reviews: 72,
    },
    {
      id: "v-neck-tshirt",
      name: "Camiseta Gola V",
      price: 32.99,
      image: "../login/placeholder.svg",
      rating: 4.4,
      reviews: 63,
    },
  ]

  // Avaliações
  reviews: ProductReview[] = [
    {
      id: 1,
      user: "Carlos Silva",
      avatar: "../login/placeholder.svg",
      rating: 5,
      date: "12/03/2024",
      comment:
        "Excelente roteador! O sinal é forte, estável e o desempenho superou minhas expectativas. Já comprei para outros ambientes e recomendo.",
      helpful: 24,
    },
    {
      id: 2,
      user: "Ana Oliveira",
      avatar: "../login/placeholder.svg",
      rating: 4,
      date: "28/02/2024",
      comment:
        "Bom roteador, o alcance atendeu perfeitamente às minhas necessidades e a qualidade do produto é ótima. Só não dou 5 estrelas porque demorou um pouco para chegar.",
      helpful: 12,
    },
    {
      id: 3,
      user: "Marcos Pereira",
      avatar: "../login/placeholder.svg",
      rating: 5,
      date: "15/02/2024",
      comment: "Melhor roteador que já tive. A conexão é rápida, estável e continua excelente mesmo após semanas de uso intenso.",
      helpful: 18,
    },
  ]

  constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private roteadorService: RoteadorService,
        private carrinhoService: CarrinhoService,
        private snackBar: MatSnackBar,
        private clienteService: ClienteService,
  ) {
  }

  ngOnInit(): void {
    this.roteador = this.activatedRoute.snapshot.data['roteador'];
    this.carregarImagensDoRoteador();
    this.carregarProdutosRelacionados();
    this.carregarListaDesejos();
    this.carregarQuantidadeEstoque();
  }

  // Métodos para interação do usuário
  decreaseQuantity(): void {
    if (this.quantidadeAdicionar > 1) {
      this.quantidadeAdicionar--
    }
  }

  increaseQuantity(): void {
    this.quantidadeAdicionar++
  }

  selectSize(size: string): void {
    this.selectedSize = size
  }

  selectColor(color: string): void {
    this.selectedColor = color
  }

  toggleWishlist(): void {
    this.inWishlist = !this.inWishlist
  }

  addToCart(): void {
    console.log("Adicionado ao carrinho:", {
      product: this.product,
      quantity: this.quantity,
      size: this.selectedSize,
      color: this.selectedColor,
    })
    // Aqui você implementaria a lógica para adicionar ao carrinho
  }

  adicionarAoCarrinho(card: Card) {
    this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi adicionado ao carrinho.')
    this.carrinhoService.adicionar({
      id: card.idRoteador,
      nome: card.titulo,
      preco: card.preco,
      quantidade: 1,
      imageUrl: card.imageUrl
    })
  }

  adicionarAoCarrinhoApartirRoteador(roteador: Roteador, quantidade: number) {
    const card: Card = {
      idRoteador: roteador.id,
      titulo: roteador.nome,
      preco: roteador.preco,
      rating: 4.5,
      reviews: 128,
      imageUrl: this.roteadorService.getUrlImage(roteador.listaImagem[0].toString())
    }

    this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi adicionado ao carrinho.')
    this.carrinhoService.adicionarTelaRoteador({
      id: card.idRoteador,
      nome: card.titulo,
      preco: card.preco,
      quantidade: quantidade,
      imageUrl: card.imageUrl
    })
  }

  adicionarAoListaDesejoApartirRoteador(roteador: Roteador) {
    const card: Card = {
      idRoteador: roteador.id,
      titulo: roteador.nome,
      preco: roteador.preco,
      rating: 4.5,
      reviews: 128,
      imageUrl: this.roteadorService.getUrlImage(roteador.listaImagem[0].toString())
    }
    this.adicionarItemListaDesejo(card);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index
  }

  markHelpful(review: ProductReview): void {
    review.helpful++
  }

  carregarImagensDoRoteador() {
    this.imagensProduto = this.roteador.listaImagem.map((nomeImagem, indice) => ({
      id: indice.toString(),
      url: this.roteadorService.getUrlImage(nomeImagem)
    }));
  }

  startIndex = 0;
  imagesToShow = 6;

  get displayedImages(): any[] {
    return this.imagensProduto.slice(this.startIndex, this.startIndex + this.imagesToShow);
  }


  scrollLeft() {
    if (this.startIndex > 0) {
      this.startIndex--;
    }
  }

  scrollRight() {
    if (this.startIndex + this.imagesToShow < this.imagensProduto.length) {
      this.startIndex++;
    }
  }

  carregarProdutosRelacionados() {
    this.roteadorService.findBySinalWireless(this.roteador.sinalWireless.id).subscribe((item) => {
      this.roteadoresSimilares = item;
      this.preencherCardsProdutosRelacionados();
    });
  }

  preencherCardsProdutosRelacionados() {
    const cards: Card[] = [];
    const similaresLimitados = this.roteadoresSimilares.slice(0, 4);
    similaresLimitados.forEach((roteador) => {
      cards.push({
        idRoteador: roteador.id,
        titulo: roteador.nome,
        preco: roteador.preco,
        rating: 4.8,
        reviews: 40,
        imageUrl: this.roteadorService.getUrlImage(roteador.listaImagem[0].toString())
      })
    })
    this.produtosRelacionados.set(cards);
  }

  carregarListaDesejos() {
    this.clienteService.buscarListaDesejo().subscribe((lista) => {
      this.listaDesejo = lista.map(item => item.idProduto);
    })
  }

  isInWishlist(card: Card): boolean {
    return this.listaDesejo.includes(card.idRoteador);
  }

  isInWishlistRoteador(roteador: Roteador): boolean {
    return this.listaDesejo.includes(roteador.id);
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

  carregarQuantidadeEstoque() {
    this.roteadorService.countQuantidadeTotalById(this.roteador.id).subscribe((resultado) => {
      this.estoque = resultado;
    });
    console.log("Essa é a quantidade em estoque: ", this.estoque)
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
  
}
