import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


interface AdminCard {
  title: string
  description: string
  icon: string
  count: number
  route: string
  color: string
}

@Component({
  selector: 'app-home-admin',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent {
  adminCards: AdminCard[] = [
    {
      title: "Produtos",
      description: "Gerenciar produtos, estoque e preços",
      icon: "package",
      count: 248,
      route: "/admin/products",
      color: "blue",
    },
    {
      title: "Usuários",
      description: "Gerenciar contas de usuários e permissões",
      icon: "users",
      count: 1024,
      route: "/admin/users",
      color: "green",
    },
    {
      title: "Pedidos",
      description: "Visualizar e gerenciar pedidos",
      icon: "shopping-cart",
      count: 56,
      route: "/admin/orders",
      color: "purple",
    },
    {
      title: "Categorias",
      description: "Gerenciar categorias de produtos",
      icon: "tag",
      count: 32,
      route: "/admin/categories",
      color: "orange",
    },
    {
      title: "Cupons",
      description: "Gerenciar cupons de desconto",
      icon: "ticket",
      count: 18,
      route: "/admin/coupons",
      color: "pink",
    },
    {
      title: "Relatórios",
      description: "Visualizar relatórios e estatísticas",
      icon: "bar-chart-2",
      count: 7,
      route: "/admin/reports",
      color: "indigo",
    },
    {
      title: "Marketing",
      description: "Gerenciar campanhas e promoções",
      icon: "trending-up",
      count: 12,
      route: "/admin/marketing",
      color: "red",
    },
    {
      title: "Configurações",
      description: "Configurar a loja e preferências",
      icon: "settings",
      count: 0,
      route: "/admin/settings",
      color: "gray",
    },
  ]

  // Estatísticas gerais
  statistics = {
    revenue: 25890.75,
    orders: 156,
    customers: 42,
    conversion: 3.2,
  }

  // Dados para o gráfico de vendas (simulado)
  recentOrders = [
    { id: "#ORD-5289", customer: "João Silva", date: "12/05/2024", total: 289.99, status: "Entregue" },
    { id: "#ORD-5288", customer: "Maria Oliveira", date: "11/05/2024", total: 129.50, status: "Processando" },
    { id: "#ORD-5287", customer: "Carlos Santos", date: "11/05/2024", total: 459.75, status: "Enviado" },
    { id: "#ORD-5286", customer: "Ana Pereira", date: "10/05/2024", total: 89.99, status: "Entregue" },
    { id: "#ORD-5285", customer: "Pedro Costa", date: "09/05/2024", total: 199.90, status: "Cancelado" },
  ]

  getStatusClass(status: string): string {
    switch (status) {
      case "Entregue":
        return "status-delivered"
      case "Processando":
        return "status-processing"
      case "Enviado":
        return "status-shipped"
      case "Cancelado":
        return "status-canceled"
      default:
        return ""
    }
  }

  getCardColorClass(color: string): string {
    return `card-${color}`
  }
}
