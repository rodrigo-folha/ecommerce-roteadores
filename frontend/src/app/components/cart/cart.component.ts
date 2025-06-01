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
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  carrinhoItens: ItemCarrinho[] = [];
  enderecos: Endereco[] = [];
  cliente: Cliente = new Cliente();
  enderecoSelecionadoId: number | null = null;

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
    { id: "credit_card", name: "Cartão de Crédito", icon: "credit_card" },
    { id: "pix", name: "PIX", icon: "qr_code" },
    { id: "boleto", name: "Boleto Bancário", icon: "receipt" },
  ]
  selectedPaymentMethod = this.paymentMethods[0].id

  // Forms
  addressForm: FormGroup
  paymentForm: FormGroup

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
  ) {
    // Initialize forms
    this.addressForm = this.fb.group({
      fullName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      address: ["", [Validators.required]],
      number: ["", [Validators.required]],
      complement: [""],
      neighborhood: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      zipCode: ["", [Validators.required]],
      saveAddress: [true],
    })

    this.paymentForm = this.fb.group({
      cardNumber: ["", [Validators.required]],
      cardName: ["", [Validators.required]],
      expiryDate: ["", [Validators.required]],
      cvv: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      installments: ["1", [Validators.required]],
    })
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
      this.clienteService.findById(clienteConvertido.id).subscribe((item) => {
        this.cliente = item;
        this.carregarEnderecos();
      })
    }
  }

  abrirModalEndereco() {
    // abre seu modal
  }

  carregarEnderecos() {
    this.enderecos = this.cliente.usuario.enderecos;
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
      },
      {
        id: 2,
        name: "Fone de Ouvido Bluetooth",
        image: "/assets/images/products/headphones.jpg",
        price: 299.9,
        quantity: 2,
      },
      {
        id: 3,
        name: "Smartwatch Pro",
        image: "/assets/images/products/smartwatch.jpg",
        price: 899.9,
        originalPrice: 1099.9,
        quantity: 1,
      },
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
    if (this.currentStep === 1) {
      // Validate cart has items
      if (this.carrinhoItens.length === 0) {
        alert("Seu carrinho está vazio")
        return
      }
      this.currentStep = 2
    } else if (this.currentStep === 2) {
      // Validate address form
      if (this.enderecoSelecionadoId == null) {
        return
      }
      this.currentStep = 3
    } else if (this.currentStep === 3) {
      // Validate payment form if credit card is selected
      if (this.selectedPaymentMethod === "credit_card" && this.paymentForm.invalid) {
        this.paymentForm.markAllAsTouched()
        return
      }
      this.placeOrder()
    }
  }

  // Go to previous step
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  // Place order
  placeOrder(): void {
    // Here you would normally send the order to your backend
    alert("Pedido realizado com sucesso!")
    // Redirect to order confirmation page
    // this.router.navigate(['/order-confirmation']);
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

}