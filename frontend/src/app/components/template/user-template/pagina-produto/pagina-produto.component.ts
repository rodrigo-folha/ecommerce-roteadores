import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface ProductImage {
  url: string
  alt: string
}

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
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pagina-produto.component.html',
  styleUrl: './pagina-produto.component.css'
})
export class PaginaProdutoComponent {
  productId = ""
  quantity = 1
  selectedSize = "M"
  selectedColor = "Branco"
  inWishlist = false
  activeTab = "description"
  activeImageIndex = 0

  // Dados do produto (em um app real, estes dados viriam de um serviço)
  product = {
    id: "classic-white-tshirt",
    name: "Camiseta Clássica Branca",
    price: 29.99,
    salePrice: null,
    discount: null,
    rating: 4.5,
    reviews: 128,
    availability: "Em estoque",
    sku: "TSH-CW-001",
    description:
      "Uma camiseta branca clássica feita de algodão 100% orgânico. Perfeita para o uso diário, esta peça versátil combina com qualquer estilo e é essencial em qualquer guarda-roupa. O corte regular oferece conforto sem comprometer o estilo.",
    features: [
      "Algodão 100% orgânico",
      "Corte regular",
      "Gola redonda reforçada",
      "Tecido de 180g/m²",
      "Lavável à máquina",
      "Produzido eticamente",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Branco", "Preto", "Cinza", "Azul Marinho"],
    images: [
      { url: "/assets/placeholder.svg", alt: "Camiseta Branca - Frente" },
      { url: "/assets/placeholder.svg", alt: "Camiseta Branca - Costas" },
      { url: "/assets/placeholder.svg", alt: "Camiseta Branca - Detalhe" },
      { url: "/assets/placeholder.svg", alt: "Camiseta Branca - Modelo" },
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
      image: "/assets/placeholder.svg",
      rating: 4.3,
      reviews: 98,
    },
    {
      id: "striped-tshirt",
      name: "Camiseta Listrada",
      price: 34.99,
      image: "/assets/placeholder.svg",
      rating: 4.1,
      reviews: 45,
    },
    {
      id: "graphic-tshirt",
      name: "Camiseta com Estampa",
      price: 39.99,
      salePrice: 29.99,
      image: "/assets/placeholder.svg",
      rating: 4.7,
      reviews: 72,
    },
    {
      id: "v-neck-tshirt",
      name: "Camiseta Gola V",
      price: 32.99,
      image: "/assets/placeholder.svg",
      rating: 4.4,
      reviews: 63,
    },
  ]

  // Avaliações
  reviews: ProductReview[] = [
    {
      id: 1,
      user: "Carlos Silva",
      avatar: "/assets/placeholder.svg",
      rating: 5,
      date: "12/03/2024",
      comment:
        "Excelente camiseta! O material é muito confortável e a qualidade é superior. Já comprei várias cores e recomendo.",
      helpful: 24,
    },
    {
      id: 2,
      user: "Ana Oliveira",
      avatar: "/assets/placeholder.svg",
      rating: 4,
      date: "28/02/2024",
      comment:
        "Boa camiseta, o tamanho ficou perfeito e o material é de qualidade. Só não dou 5 estrelas porque demorou um pouco para chegar.",
      helpful: 12,
    },
    {
      id: 3,
      user: "Marcos Pereira",
      avatar: "/assets/placeholder.svg",
      rating: 5,
      date: "15/02/2024",
      comment: "Melhor camiseta básica que já comprei. Veste muito bem e não deforma após lavagens.",
      helpful: 18,
    },
  ]

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Em um app real, usaríamos o ID da rota para buscar os dados do produto
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.productId = id
        // Aqui você buscaria os dados do produto com base no ID
      }
    })
  }

  // Métodos para interação do usuário
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--
    }
  }

  increaseQuantity(): void {
    this.quantity++
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

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index
  }

  markHelpful(review: ProductReview): void {
    review.helpful++
  }
}
