import { CommonModule, NgIf, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, signal } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { Form, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cliente } from '../../../../models/cliente.model';
import { Telefone } from '../../../../models/telefone.model';
import { Endereco } from '../../../../models/endereco.model';
import { forkJoin, Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { ClienteService } from '../../../../services/cliente.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cidade } from '../../../../models/cidade.model';
import { CidadeService } from '../../../../services/cidade.service';
import { MatSelectModule } from '@angular/material/select';
import { EnderecoDialogComponent } from '../../../../dialogs/endereco-dialog/endereco-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Cartao } from '../../../../models/cartao.model';
import { CartaoDialogComponent } from '../../../../dialogs/cartao-dialog/cartao-dialog.component';
import { CartaoService } from '../../../../services/cartao.service';
import { RoteadorService } from '../../../../services/roteador.service';
import { Roteador } from '../../../../models/roteador.model';
import { CarrinhoService } from '../../../../services/carrinho.service';
import { TelefoneDialogComponent } from '../../../../dialogs/telefone-dialog/telefone-dialog.component';
import { FormatarCartaoPipe } from '../../../../pipe/formatar-cartao.pipe';
registerLocaleData(localePt);

interface UserProfile {
  id: number
  name: string
  cpf: string
  email: string
  birthDate: string
  profileImage: string
}

interface Address {
  id: number
  name: string
  address: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isPrimary: boolean
}

interface CreditCard {
  id: number
  name: string
  number: string
  expiryDate: string
  brand: string
  isPrimary: boolean
}

interface WishlistItem {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number
  inStock: boolean
  onSale: boolean
}

type Card = {
  id: number;
  titulo: string;
  preco: number;
  rating: number;
  reviews: number;
  imageUrl: string;
};

@Component({
  selector: 'app-perfil-usuario',
  providers: [provideNativeDateAdapter(), {
    provide: MAT_DATE_LOCALE, useValue: 'pt-BR'
  },
  { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  imports: [
    NgIf, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatSelectModule, 
    RouterLink, 
    FormatarCartaoPipe
  ],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent {
  // Active tab (1: Personal Info, 2: Addresses, 3: Cards, 4: Wishlist)
  activeTab = 1

  // User profile data
  userProfile: UserProfile = {
    id: 1,
    name: "João Silva",
    cpf: "123.456.789-00",
    email: "joao.silva@email.com",
    birthDate: "1990-05-15",
    profileImage: "../login/placeholder.svg?height=120&width=120",
  }

  // Forms
  personalInfoForm: FormGroup
  addressForm: FormGroup
  cardForm: FormGroup
  passwordForm: FormGroup

  formGroup: FormGroup;
  maxDate: Date;
  cidades: Cidade[] = [];
  cliente: Cliente = new Cliente();
  cards = signal<Card[]>([]);
  roteadoresListaDesejo: Roteador[] = [];

  // Data arrays
  addresses: Address[] = []
  creditCards: CreditCard[] = []
  wishlistItems: WishlistItem[] = []

  // Form states
  showPasswordForm = false
  showAddressForm = false
  showCardForm = false
  editingAddressId: number | null = null
  editingCardId: number | null = null

  // File upload
  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private cidadeService: CidadeService,
    private cartaoService: CartaoService,
    private roteadorService: RoteadorService,
    private carrinhoService: CarrinhoService,
    private dialog: MatDialog,
  ) {

    this.formGroup = this.fb.group({
      id: [null],
      nome: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      dataNascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      telefones: [this.fb.array([]), Validators.required],
      enderecos: [this.fb.array([]), Validators.required],
    });


    // Initialize forms
    this.personalInfoForm = this.fb.group({
      name: [this.userProfile.name, [Validators.required]],
      cpf: [this.userProfile.cpf, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      birthDate: [this.userProfile.birthDate, [Validators.required]],
    })

    this.addressForm = this.fb.group({
      name: ["", [Validators.required]],
      address: ["", [Validators.required]],
      number: ["", [Validators.required]],
      complement: [""],
      neighborhood: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      zipCode: ["", [Validators.required]],
      isPrimary: [false],
    })

    this.cardForm = this.fb.group({
      name: ["", [Validators.required]],
      number: ["", [Validators.required]],
      expiryDate: ["", [Validators.required]],
      cvv: ["", [Validators.required, Validators.minLength(3)]],
      isPrimary: [false],
    })

    this.passwordForm = this.fb.group({
      currentPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
    })

    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.loadWishlistItems()
    this.initializeForm();
    this.cidadeService.findAll().subscribe((data) => {
      this.cidades = data.resultado;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      const aba = +params['aba'];
      if (aba >= 1 && aba <= 4) {
        this.setActiveTab(aba);
      }
    });
  }


  initializeForm(): void {
    let cliente: Cliente = new Cliente();

    const usuarioLocalStorage = localStorage.getItem('usuario_logado');
    if (usuarioLocalStorage) {
      const clienteConvertido = JSON.parse(usuarioLocalStorage);
      this.clienteService.findById(clienteConvertido.id).subscribe((item) => {
        cliente = item;
        this.cliente = item;
        const usuario = cliente?.id ? cliente.usuario : null;

        this.formGroup = this.fb.group({
          id: [(cliente && cliente.id) ? cliente.id : null],
          nome: [(usuario && usuario.nome) ? usuario.nome : null, Validators.required],
          cpf: [(usuario && usuario.cpf) ? usuario.cpf : null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
          dataNascimento: [(usuario && usuario.dataNascimento) ? usuario.dataNascimento : null, Validators.required],
          email: [(usuario && usuario.email) ? usuario.email : null, [Validators.required, Validators.email]],
          senha: [(usuario && usuario.senha) ? usuario.senha : null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
          telefones: this.fb.array([]),
          enderecos: this.fb.array([]),
        });

        usuario?.telefones.forEach(telefone => {
          this.adicionarTelefone(telefone);
        })

        usuario?.enderecos.forEach(endereco => {
          this.adicionarEndereco(endereco);
        })

        if (cliente.nomeImagem) {
          this.clienteService.getUrlImageHeader(this.cliente.nomeImagem).subscribe({
            next: (blob) => {
              const objectURL = URL.createObjectURL(blob);
              this.imagePreview = objectURL;
            },
            error: (err) => {
              console.error('Erro ao carregar imagem:', err);
            }
          });
        }

      })

      this.clienteService.buscarListaDesejo().subscribe({
        next: (listaDesejo) => {
          const observables = listaDesejo.map(item =>
            this.roteadorService.findById(item.idProduto)
          );

          forkJoin(observables).subscribe({
            next: (roteadores) => {
              this.roteadoresListaDesejo = roteadores;
              this.carregarCards();
            },
            error: (err) => {
              console.error('Erro ao buscar detalhes dos roteadores:', err);
            }
          });
        },
        error: (err) => {
          console.error('Erro ao buscar lista de desejos:', err);
        }
      });

    }
  }

  get telefones(): FormArray {
    return this.formGroup.get('telefones') as FormArray;
  }

  adicionarTelefone(telefone?: Telefone): void {
    const telefoneForm = this.fb.group({
      codigoArea: [telefone ? telefone.codigoArea : '', [Validators.required]],
      numero: [telefone ? telefone.numero : '', [Validators.required]]
    });
    this.telefones.push(telefoneForm);
  }

  get enderecos(): FormArray {
    return this.formGroup.get('enderecos') as FormArray;
  }

  adicionarEndereco(endereco?: Endereco): void {
    const enderecoForm = this.fb.group({
      logradouro: [endereco ? endereco.logradouro : '', [Validators.required]],
      bairro: [endereco ? endereco.bairro : '', [Validators.required]],
      numero: [endereco ? endereco.numero : '', [Validators.required]],
      complemento: [endereco ? endereco.complemento : ''],
      cep: [endereco ? endereco.cep : '', [Validators.required]],
      cidade: [endereco ? endereco.cidade : '', [Validators.required]],
    })
    this.enderecos.push(enderecoForm);
  }

  removeEndereco(index: number) {
    this.enderecos.removeAt(index);
  }

  removeTelefone(index: number) {
    this.telefones.removeAt(index);
  }

  carregarCards() {
    const cards: Card[] = [];
    this.roteadoresListaDesejo.forEach((roteador) => {
      cards.push({
        id: roteador.id,
        titulo: roteador.nome,
        preco: roteador.preco,
        rating: 4.8,
        reviews: 100,
        imageUrl: this.roteadorService.getUrlImage(roteador.listaImagem[0].toString())
      })
    })
    this.cards.set(cards);
  }

  // Tab navigation
  setActiveTab(tab: number): void {
    this.activeTab = tab
    this.resetForms()
  }

  // Reset all forms
  resetForms(): void {
    this.showPasswordForm = false
    this.showAddressForm = false
    this.showCardForm = false
    this.editingAddressId = null
    this.editingCardId = null
    this.addressForm.reset()
    this.cardForm.reset()
    this.passwordForm.reset()
  }

  // Personal Info methods
  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.selectedFile = file
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value
      if (newPassword !== confirmPassword) {
        alert("As senhas não coincidem!")
        return
      }

      // Here you would normally send the password change request to your backend
      alert("Senha alterada com sucesso!")
      this.showPasswordForm = false
      this.passwordForm.reset()
    }
  }

  deleteCard(id: number): void {
    if (confirm("Tem certeza que deseja excluir este cartão?")) {
      this.creditCards = this.creditCards.filter((card) => card.id !== id)
      alert("Cartão excluído com sucesso!")
    }
  }

  setPrimaryCard(id: number): void {
    this.creditCards.forEach((card) => {
      card.isPrimary = card.id === id
    })
    alert("Cartão principal atualizado!")
  }

  maskCardNumber(number: string): string {
    const cleaned = number.replace(/\s/g, "")
    return "**** **** **** " + cleaned.slice(-4)
  }

  getCardBrand(number: string): string {
    const cleaned = number.replace(/\s/g, "")
    if (cleaned.startsWith("4")) return "Visa"
    if (cleaned.startsWith("5")) return "Mastercard"
    if (cleaned.startsWith("3")) return "American Express"
    return "Outros"
  }

  // Wishlist methods
  loadWishlistItems(): void {
    this.wishlistItems = [
      {
        id: 1,
        name: "Smartphone Galaxy S24",
        image: "../login/placeholder.svg?height=200&width=200",
        price: 3499.9,
        originalPrice: 3999.9,
        inStock: true,
        onSale: true,
      },
      {
        id: 2,
        name: "Notebook Dell Inspiron",
        image: "../login/placeholder.svg?height=200&width=200",
        price: 2899.9,
        inStock: true,
        onSale: false,
      },
      {
        id: 3,
        name: "Fone de Ouvido Sony",
        image: "../login/placeholder.svg?height=200&width=200",
        price: 599.9,
        originalPrice: 799.9,
        inStock: false,
        onSale: true,
      },
    ]
  }

  removeFromWishlist(id: number): void {
    if (confirm("Tem certeza que deseja remover este item da lista de desejos?")) {
      this.wishlistItems = this.wishlistItems.filter((item) => item.id !== id)
      alert("Item removido da lista de desejos!")
    }
  }

  addToCart(item: WishlistItem): void {
    if (!item.inStock) {
      alert("Este produto está fora de estoque!")
      return
    }

    // Here you would normally add the item to the cart
    alert(`${item.name} adicionado ao carrinho!`)
  }

  // Utility methods
  hasError(formGroup: FormGroup, controlName: string): boolean {
    const control = formGroup.get(controlName)
    return control ? control.invalid && (control.dirty || control.touched) : false
  }

  // formatCPF(cpf: string): string {
  //   return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  // }

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

  adicionarTelefoneDialog(telefone?: Telefone): void {
    const dialogRef = this.dialog.open(TelefoneDialogComponent, {
      width: '600px',
      data: telefone || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salvarTelefone(result);
      }
    });
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
        this.router.navigateByUrl('minha-conta');
        this.showNotification('Cartão salvo com sucesso!', 'success');
        this.initializeForm();

      },
      error: (errorResponse) => {
        console.log('Erro ao gravar' + JSON.stringify(errorResponse));
        this.tratarErros(errorResponse)
      }
    })
  }

  excluirCartao(cartao: Cartao) {
    const confirmacao = confirm('Tem certeza que deseja excluir este cartão?');
    if (!confirmacao) return;

    this.cartaoService.delete(cartao).subscribe(() => {
      this.showNotification('Cartão excluído com sucesso!', 'success');
      this.initializeForm();
    })
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
      this.initializeForm();
    })
  }

  excluirEndereco(idEndereco: number) {
    const confirmacao = confirm('Tem certeza que deseja excluir este endereço?');
    if (!confirmacao) return;

    const clienteAtualizado = { ...this.cliente };
    clienteAtualizado.usuario.enderecos = clienteAtualizado.usuario.enderecos.filter(e => e.id !== idEndereco);

    this.clienteService.updateBasico(clienteAtualizado.usuario).subscribe(response => {
      this.cliente = response;
      this.initializeForm();
    })
  }

  salvarTelefone(telefone: Telefone) {
    const clienteAtualizado = { ... this.cliente };
    const index = clienteAtualizado.usuario.telefones.findIndex(e => e.id === telefone.id);

    if (index > -1) {
      clienteAtualizado.usuario.telefones[index] = telefone;
    } else {
      clienteAtualizado.usuario.telefones.push(telefone);
    }

    this.clienteService.updateBasico(clienteAtualizado.usuario).subscribe(response => {
      this.cliente = response;
      this.showNotification('Telefone atualizado com sucesso!', 'success');
      this.initializeForm();
    })
  }

  excluirTelefone(idTelefone: number) {
    const confirmacao = confirm('Tem certeza que deseja excluir este telefone?');
    if (!confirmacao) return;

    const clienteAtualizado = { ...this.cliente };
    clienteAtualizado.usuario.telefones = clienteAtualizado.usuario.telefones.filter(e => e.id !== idTelefone);

    this.clienteService.updateBasico(clienteAtualizado.usuario).subscribe(response => {
      this.cliente = response;
      this.showNotification('Telefone excluído com sucesso!', 'success');
      this.initializeForm();
    })
  }

  private uploadImage(clienteId: number) {
    if (this.selectedFile) {
      this.clienteService.uploadImage(clienteId, this.selectedFile.name, this.selectedFile)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('minha-conta');
          },
          error: err => {
            console.log('Erro ao fazer o upload da imagem');
            // tratar o erro
          }
        })
    } else {
      this.router.navigateByUrl('minha-conta');
    }
  }

  salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const cliente = this.formGroup.value;

      const operacao = this.clienteService.updateBasico(cliente)

      operacao.subscribe({
        next: () => {
          this.uploadImage(cliente.id);
          this.router.navigateByUrl('/minha-conta').then(() => {
            window.location.reload();
          });
          this.showNotification('Perfil atualizado com sucesso!', 'success');

        },
        error: (errorResponse) => {
          console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse)
        }
      })
    }
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if (httpError.error?.errors) {
        httpError.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message })
          }
        });
      }
    } else {
      alert(httpError.error?.message || "Erro não mapeado do servidor.");
    }

  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors || !this.errorMessages[controlName]) {
      return 'invalid field';
    }

    for (const errorName in errors) {
      // console.log(errorName);
      if (this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'invalid field';
  }

  // é proximno ao Map do java
  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado.',
      apiError: ' '
    },

    cpf: {
      required: 'O cpf deve ser informado.',
      minlength: 'O cpf deve ter 11 caracteres.',
      maxlength: 'O cpf deve ter 11 caracteres.',
      apiError: ' '
    },

    dataNascimento: {
      required: 'A data de nascimento deve ser informada.',
      apiError: ' '
    },

    email: {
      required: 'O email deve ser informado.',
      email: 'O email deve ser válido.',
      apiError: ' '
    },

    senha: {
      required: 'A senha deve ser informada.',
      minlength: 'A senha deve ter no mínimo 6 caracteres.',
      maxlength: 'A senha deve ter no máximo 20 caracteres.',
      apiError: ' '
    }
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

  adicionarAoCarrinho(card: Card) {
    this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi adicionado ao carrinho.')
    this.carrinhoService.adicionar({
      id: card.id,
      nome: card.titulo,
      preco: card.preco,
      quantidade: 1,
      imageUrl: card.imageUrl
    })
  }

  removerDaListaDesejo(card: Card) {
    this.clienteService.removerItemListaDesejo(card.id).subscribe(() => {
      this.showSnackbarTopPosition('O Produto (' + card.titulo + ') foi removido da lista de desejo.')
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/minha-conta'], { queryParams: { aba: 4 } });
      });
    })
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }



}
