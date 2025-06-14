import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ItemCarrinho } from '../../models/item-carrinho';
import { CarrinhoService } from '../../services/carrinho.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Endereco } from '../../models/endereco.model';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { EnderecoDialogComponent } from '../../dialogs/endereco-dialog/endereco-dialog.component';
import { Cartao } from '../../models/cartao.model';
import { CartaoDialogComponent } from '../../dialogs/cartao-dialog/cartao-dialog.component';
import { CartaoService } from '../../services/cartao.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';
import { ItemPedido } from '../../models/item-pedido.model';
import { FormatarCartaoPipe } from '../../pipe/formatar-cartao.pipe';
registerLocaleData(localePt);

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
}

interface ShippingMethod {
  id: number
  name: string
  price: number
  estimatedDays: string
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
}

@Component({
  selector: 'app-cart',
  providers: [provideNativeDateAdapter(), {
            provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
            { provide: LOCALE_ID, useValue: 'pt-BR'}
          ],
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, FormatarCartaoPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  carrinhoItens: ItemCarrinho[] = [];
  enderecos: Endereco[] = [];
  cliente: Cliente = new Cliente();
  enderecoSelecionadoId: number | null = null;
  enderecoSelecionado: Endereco | null = null;

  cartoes: Cartao[] = [];
  cartaoSelecionadoId: number | null = null;
  cartaoSelecionado: Cartao | null = null;

  // Current step (1: Cart, 2: Address, 3: Payment)
  currentStep = 1

  // Cart items
  cartItems: CartItem[] = []

  // Coupon code
  couponCode = ""
  appliedCoupon = ""
  discountPercent = 0

  // Shipping methods
  shippingMethods: ShippingMethod[] = [
    { id: 1, name: "Padrão", price: 0, estimatedDays: "3-5 dias úteis" },
    { id: 2, name: "Expresso", price: 0, estimatedDays: "1-2 dias úteis" },
    { id: 3, name: "Retirada na loja", price: 0, estimatedDays: "Disponível em 24h" },
  ]
  selectedShippingMethod: ShippingMethod = this.shippingMethods[0]

  // Payment methods
  paymentMethods: PaymentMethod[] = [
    { id: "cartao", name: "Cartão de Crédito", icon: "credit_card" },
    { id: "pix", name: "PIX", icon: "qr_code" },
    { id: "boleto", name: "Boleto Bancário", icon: "receipt" },
  ]
  selectedPaymentMethod = this.paymentMethods[0].id

  // Order summary
  subtotal = 0
  discount = 0
  shipping = 0
  tax = 0
  total = 0

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private cartaoService: CartaoService,
    private pedidoService: PedidoService,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    // Load cart items (mock data for demonstration)
    this.loadCartItems()
    this.calculateOrderSummary()
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.carrinhoItens = itens;
    })
    this.inicializar();
  }

  inicializar(): void {
    const usuarioLocalStorage = localStorage.getItem('usuario_logado');
    if (usuarioLocalStorage) {
      const clienteConvertido = JSON.parse(usuarioLocalStorage);
      this.clienteService.findByUsuario(clienteConvertido.email).subscribe((item) => {
        this.cliente = item;
        this.carregarEnderecos();
        this.carregarCartoes();
      });
    }
  }

  adicionarEnderecoDialog(endereco?: Endereco): void {
    const dialogRef = this.dialog.open(EnderecoDialogComponent, {
      width: '600px',
      data: endereco || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salvarEndereco(result);
      }
    });
  }

  salvarEndereco(endereco: Endereco) {
    const clienteAtualizado = { ... this.cliente };
    const index = clienteAtualizado.usuario.enderecos.findIndex(e => e.id === endereco.id);

    if (index > -1) {
      clienteAtualizado.usuario.enderecos[index] = endereco;
    } else {
      clienteAtualizado.usuario.enderecos.push(endereco);
    }

    this.clienteService.updateBasico(clienteAtualizado.usuario).subscribe(response => {
      this.cliente = response;
      this.inicializar();
      this.showNotification('Endereço salvo com sucesso!', 'success');
    })
  }

  carregarEnderecos() {
    if (this.cliente.usuario) {
      this.enderecos = this.cliente.usuario.enderecos;
    }
  }

  carregarCartoes() {
    this.cartoes = this.cliente.cartao;
  }

  adicionarCartaoDialog(cartao?: Cartao): void {
      const dialogRef = this.dialog.open(CartaoDialogComponent, {
        width: '600px',
        data: cartao || {},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.salvarCartao(result);
        }
      });
    }
  
    salvarCartao(cartao: Cartao) {
      const operacao = cartao.id == null
        ? this.cartaoService.insert(cartao)
        : this.cartaoService.update(cartao)
  
      operacao.subscribe({
        next: () => {
          this.inicializar();
          this.showNotification('Cartão salvo com sucesso!', 'success');
  
        },
        error: (errorResponse) => {
          console.log('Erro ao gravar' + JSON.stringify(errorResponse));
        }
      })
    }

  aumentarQuantidade(item: any) {
    this.carrinhoService.adicionar(item);
  }

  diminuirQuantidade(item: any) {
    if (item.quantidade == 1) {
      this.showSnackbarTopPosition('Roteador removido do carrinho com sucesso!')
    }
    this.carrinhoService.diminuirQuantidade(item);
  }

  removerItem(item: any) {
    this.carrinhoService.remover(item);
    this.showSnackbarTopPosition('Roteador removido do carrinho com sucesso!')
  }

  calcularTotal() {
    return this.carrinhoItens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  // Load cart items (mock data)
  loadCartItems(): void {
    this.cartItems = [
      {
        id: 1,
        name: "Smartphone Galaxy S23",
        image: "/assets/images/products/smartphone.jpg",
        price: 3999.9,
        originalPrice: 4499.9,
        quantity: 1,
      }
    ]
  }

  // Calculate order summary
  calculateOrderSummary(): void {
    // Calculate subtotal
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Calculate discount
    this.discount = this.discountPercent > 0 ? (this.subtotal * this.discountPercent) / 100 : 0

    // Set shipping cost
    this.shipping = this.selectedShippingMethod.price

    // Calculate tax (example: 10% of subtotal after discount)
    this.tax = (this.subtotal - this.discount) * 0.1

    // Calculate total
    this.total = this.subtotal - this.discount + this.shipping + this.tax
  }

  // Update item quantity
  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return

    item.quantity = newQuantity
    this.calculateOrderSummary()
  }

  // Remove item from cart
  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId)
    this.calculateOrderSummary()
  }

  // Apply coupon code
  applyCoupon(): void {
    // Mock coupon validation
    if (this.couponCode.toUpperCase() === "DESCONTO20") {
      this.appliedCoupon = this.couponCode
      this.discountPercent = 20
      this.calculateOrderSummary()
      this.couponCode = ""
    } else {
      alert("Cupom inválido")
    }
  }

  // Remove applied coupon
  removeCoupon(): void {
    this.appliedCoupon = ""
    this.discountPercent = 0
    this.calculateOrderSummary()
  }

  // Change shipping method
  changeShippingMethod(methodId: number): void {
    const method = this.shippingMethods.find((m) => m.id === methodId)
    if (method) {
      this.selectedShippingMethod = method
      this.calculateOrderSummary()
    }
  }

  // Go to next step
  nextStep(): void {
    if (!this.cliente || this.cliente.id == null) {
      this.router.navigateByUrl('/login');
      return;
    }
    if (this.currentStep === 1) {
      // Validate cart has items
      if (this.carrinhoItens.length === 0) {
        alert("Seu carrinho está vazio")
        return
      }
      this.currentStep = 2
    } else if (this.currentStep === 2) {
      // Validate address form
      if (this.enderecoSelecionado == null) {
        alert("Selecione um endereço")
        return
      }
      this.currentStep = 3
    } else if (this.currentStep === 3) {
      if (this.selectedPaymentMethod === "cartao" && this.cartaoSelecionado == null) {
        alert("Selecione um cartão")
        return
      }
      this.fazerPedido();
    }
  }

  // Go to previous step
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  fazerPedido() {
    const listaItemCarrinho = this.carrinhoItens;

    const listaItemPedido: ItemPedido[] = listaItemCarrinho.map(item => ({
      nome: item.nome,
      idProduto: item.id,
      quantidade: item.quantidade,
      valor: item.preco
    }));

    const valorTotal = listaItemCarrinho.reduce(
      (total, item) => total + item.preco * item.quantidade, 0
    );

    const valorTotalArredondado = Number(valorTotal.toFixed(2));

    const pedido: Pedido = {
      id: 0, // ou undefined se o backend gerar
      data: new Date(),
      valorTotal: valorTotalArredondado,
      listaItemPedido: listaItemPedido,
      statusPedidos: [], // ou status inicial
      enderecoEntrega: this.enderecoSelecionado!, // precisa garantir que está preenchido
      cupomDesconto: null as any, // ou um objeto válido
      idCartao: this.cartaoSelecionado?.id!,
      pagamento: null as any, // ou um objeto do tipo Pagamento
      modalidadePagamento: this.selectedPaymentMethod,
      idCliente: this.cliente.id
    };

    this.pedidoService.insert(pedido).subscribe({
      next: res => {
        this.showNotification('Pedido realizado com sucesso!', 'success');
        this.carrinhoService.removerTudo();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/minha-conta'], { queryParams: { aba: 5 } });
      });
      },
      error: err => {
        console.error('Erro ao fazer o pedido:', err);
      }
    });
  }

  // Get installment options
  get installmentOptions(): { value: string; label: string }[] {
    const options = []
    const maxInstallments = 12

    for (let i = 1; i <= maxInstallments; i++) {
      const installmentValue = this.total / i
      options.push({
        value: i.toString(),
        label: `${i}x de R$ ${installmentValue.toFixed(2)}${i > 1 ? " sem juros" : ""}`,
      })
    }

    return options
  }

  // Check if cart is empty
  get isCartEmpty(): boolean {
    return this.cartItems.length === 0
  }

  // Get form control error status
  hasError(formGroup: FormGroup, controlName: string): boolean {
    const control = formGroup.get(controlName)
    return control ? control.invalid && (control.dirty || control.touched) : false
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

}