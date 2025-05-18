import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { BandaFrequencia } from '../../../models/banda-frequencia.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { ProtocoloSeguranca } from '../../../models/protocolo-seguranca.model';
import { QuantidadeAntena } from '../../../models/quantidade-antena.model';
import { Roteador } from '../../../models/roteador.model';
import { SinalWireless } from '../../../models/sinal-wireless.model';
import { SistemaOperacional } from '../../../models/sistema-operacional.model';
import { BandaFrequenciaService } from '../../../services/banda-frequencia.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ProtocoloSegurancaService } from '../../../services/protocolo-seguranca.service';
import { QuantidadeAntenaService } from '../../../services/quantidade-antena.service';
import { RoteadorService } from '../../../services/roteador.service';
import { SinalWirelessService } from '../../../services/sinal-wireless.service';
import { SistemaOperacionalService } from '../../../services/sistema-operacional.service';
import { SistemaoperacionalFormComponent } from '../../sistemaoperacional/sistemaoperacional-form/sistemaoperacional-form.component';
import { QuantidadeantenaFormComponent } from '../../quantidadeantena/quantidadeantena-form/quantidadeantena-form.component';
import { BandafrequenciaFormComponent } from '../../bandafrequencia/bandafrequencia-form/bandafrequencia-form.component';
import { ProtocolosegurancaFormComponent } from '../../protocoloseguranca/protocoloseguranca-form/protocoloseguranca-form.component';
import { SinalwirelessFormComponent } from '../../sinalwireless/sinalwireless-form/sinalwireless-form.component';

interface ProductImage {
  id: string
  file?: File
  url: string
  isPrimary: boolean
}

@Component({
  selector: 'app-roteador-form',
  imports: [
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './roteador-form.component.html',
  styleUrl: './roteador-form.component.css',
})
export class RoteadorFormComponent {
  formGroup: FormGroup;

  // criando menu de imagens
  isDragging = false;
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>
  productImages: ProductImage[] = []
  private imageIdCounter = 0

  roteadores: Roteador[] = [];
  sistemasOperacionais: SistemaOperacional[] = [];
  bandaFrequencias: BandaFrequencia[] = [];
  protocolosSeguranca: ProtocoloSeguranca[] = [];
  quantidadeAntenas: QuantidadeAntena[] = [];
  sinalWireless: SinalWireless[] = [];
  fornecedores: Fornecedor[] = [];

  fileName: string = '';
  selectedFile: File | null = null; 
  imagePreview: string | ArrayBuffer | null = null;

  fileNames: string[] = [];
  selectedFiles: File[] = []; 
  imagePreviews: string[] = [];
  precoFormatado: string = 'R$ 0,00';

  constructor(
    private formBuilder: FormBuilder,
    private roteadorService: RoteadorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sistemaOperacionalService: SistemaOperacionalService,
    private bandaFrequenciaService: BandaFrequenciaService,
    private protocoloSegurancaService: ProtocoloSegurancaService,
    private quantidadeAntenaService: QuantidadeAntenaService,
    private sinalWirelessService: SinalWirelessService,
    private fornecedorService: FornecedorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', Validators.required],
      sistemaOperacional: ['', Validators.required],
      bandaFrequencia: ['', Validators.required],
      protocoloSeguranca: ['', Validators.required],
      quantidadeAntena: ['', Validators.required],
      sinalWireless: ['', Validators.required],
      fornecedor: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    forkJoin({
      sistemasOperacionais: this.sistemaOperacionalService.findAll(),
      bandasFrequencia: this.bandaFrequenciaService.findAll(),
      protocolosSeguranca: this.protocoloSegurancaService.findAll(),
      quantidadeAntenas: this.quantidadeAntenaService.findAll(),
      sinaisWireless: this.sinalWirelessService.findAll(),
      fornecedores: this.fornecedorService.findAll(),
    }).subscribe((response) => {
      this.sistemasOperacionais = response.sistemasOperacionais.resultado;
      this.bandaFrequencias = response.bandasFrequencia.resultado;
      this.protocolosSeguranca = response.protocolosSeguranca.resultado;
      this.quantidadeAntenas = response.quantidadeAntenas.resultado;
      this.sinalWireless = response.sinaisWireless.resultado;
      this.fornecedores = response.fornecedores.resultado;
      this.initializeForm();
    });

  }

  initializeForm(): void {
    const roteador: Roteador = this.activatedRoute.snapshot.data['roteador'];

    const sistemaOperacional = this.sistemasOperacionais.find((item) => item.id === (roteador?.sistemaOperacional?.id || null));
    const bandaFrequencia = this.bandaFrequencias.find((item) => item.id === (roteador?.bandaFrequencia?.id || null));
    const protocoloSeguranca = this.protocolosSeguranca.find((item) => item.id === (roteador?.protocoloSeguranca?.id || null));
    const quantidadeAntena = this.quantidadeAntenas.find((item) => item.id === (roteador?.quantidadeAntena?.id || null));
    const sinalWireless = this.sinalWireless.find((item) => item.id === (roteador?.sinalWireless?.id || null));
    const fornecedor = this.fornecedores.find((item) => item.id === (roteador?.fornecedor?.id || null));

    // carregando a imagem do preview
    if (roteador && roteador.listaImagem.length > 0) {
      this.imagePreviews = this.roteadorService.getUrlImages(roteador.listaImagem)
      this.fileNames = roteador.listaImagem;
      this.loadImagesFromRoteador(roteador);
    }

    let precoInicialFormatado = 'R$ 0,00';
    if (roteador && roteador.preco !== null && roteador.preco !== undefined) {
      precoInicialFormatado = `R$ ${roteador.preco.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    this.formGroup = this.formBuilder.group({
      id: [ 
        (roteador && roteador.id) ? roteador.id : null],
      descricao: [
        (roteador && roteador.descricao) ? roteador.descricao : null, 
        Validators.required],
      nome: [
        (roteador && roteador.nome) ? roteador.nome : null, 
        Validators.required],
      preco: [
        (roteador && roteador.preco) ? roteador.preco : null,
        Validators.required],
      sistemaOperacional: [sistemaOperacional, Validators.required],
      bandaFrequencia: [bandaFrequencia, Validators.required],
      protocoloSeguranca: [protocoloSeguranca, Validators.required],
      quantidadeAntena: [quantidadeAntena, Validators.required],
      sinalWireless: [sinalWireless, Validators.required],
      fornecedor: [fornecedor, Validators.required],
    })

    this.precoFormatado = precoInicialFormatado;
  }

  salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const roteador = this.formGroup.value;

      const operacao = roteador.id == null
      ? this.roteadorService.insert(roteador)
      : this.roteadorService.update(roteador)
      
      operacao.subscribe({
        next: (roteadorSalvo) => {
          this.uploadImages(roteadorSalvo.id);
          this.router.navigateByUrl('admin/roteadores');
          this.showNotification('Roteador salvo com sucesso!', 'success');

        },
        error: (errorResponse) => {
          console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse)
        }
      })
    }
  }

  excluir() {
    const roteador = this.formGroup.value;
    Swal.fire({
      title: "Você tem certeza?",
      text: "Vou não vai poder reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.roteadorService.delete(roteador).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Roteador deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/roteadores']);
            });
          },
          error: (e) => {
            console.log('Erro ao excluir', JSON.stringify(e));
          }
        });
      }
    });
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if(httpError.error?.errors){
        httpError.error.errors.forEach((validationError: any)  => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({apiError: validationError.message})
          }
        });
      }
    } else {
      alert(httpError.error?.message || "Erro não mapeado do servidor.");
    }

  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined) : string {
    if (!errors || !this.errorMessages[controlName]) {
      return 'invalid field';
    }

    for(const errorName in errors) {
      // console.log(errorName);
      if (this.errorMessages[controlName][errorName]){
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'invalid field';
  }

  // é proximno ao Map do java
  errorMessages: {[controlName: string] : {[errorName: string] : string}} = {
    nome: {
      required: 'O nome deve ser informado.',
      apiError: ' '
    },

    descricao: {
      required: 'A descrição deve ser informada.',
      apiError: ' '
    },

    preco: {
      required: 'O preco deve ser informado.',
      apiError: ' '
    },

    sistemaOperacional: {
      required: 'O sistema operacional deve ser informado.',
      apiError: ' '
    },

    bandaFrequencia: {
      required: 'A banda de frequência deve ser informada.',
      apiError: ' '
    },

    protocoloSeguranca: {
      required: 'O protocolo de segurança deve ser informado.',
      apiError: ' '
    },

    quantidadeAntena: {
      required: 'A quantidade de antenas deve ser informada.',
      apiError: ' '
    },

    sinalWireless: {
      required: 'O sinal wireless deve ser informado.',
      apiError: ' '
    },

    fornecedor: {
      required: 'O fornecedor deve ser informado.',
      apiError: ' '
    },
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

  formatarPreco(event: any): void {
    let valor = event.target.value;
  
    valor = valor.replace(/[^0-9,\.]/g, '') 
                 .replace(',', '.') 
                 .replace(/\.(?=.*\.)/g, ''); 
                 
    event.target.value = valor;
  }

  abrirDialogSistemaOperacional() {
    const dialogRef = this.dialog.open(SistemaoperacionalFormComponent, {
      width: '600px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sistemaOperacionalService.findAll().subscribe((sistemasOperacionais) => {
          this.sistemasOperacionais = sistemasOperacionais.resultado;
  
          const novoSO = this.sistemasOperacionais.find(so => so.id === result.id);
          this.formGroup.get('sistemaOperacional')?.setValue(novoSO);
        });
      }
    });
  }

  abrirDialogQuantidadeAntena() {
    const dialogRef = this.dialog.open(QuantidadeantenaFormComponent, {
      width: '600px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quantidadeAntenaService.findAll().subscribe((data) => {
          this.quantidadeAntenas = data.resultado;
  
          const novoAtributo = this.quantidadeAntenas.find(atributo => atributo.id === result.id);
          this.formGroup.get('quantidadeAntena')?.setValue(novoAtributo);
        });
      }
    });
  }

  abrirDialogBandaFrequencia() {
    const dialogRef = this.dialog.open(BandafrequenciaFormComponent, {
      width: '600px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bandaFrequenciaService.findAll().subscribe((data) => {
          this.bandaFrequencias = data.resultado;
  
          const novoAtributo = this.bandaFrequencias.find(atributo => atributo.id === result.id);
          this.formGroup.get('bandaFrequencia')?.setValue(novoAtributo);
        });
      }
    });
  }

  abrirDialogProtocoloSeguranca() {
    const dialogRef = this.dialog.open(ProtocolosegurancaFormComponent, {
      width: '600px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.protocoloSegurancaService.findAll().subscribe((data) => {
          this.protocolosSeguranca = data.resultado;
  
          const novoAtributo = this.protocolosSeguranca.find(atributo => atributo.id === result.id);
          this.formGroup.get('protocoloSeguranca')?.setValue(novoAtributo);
        });
      }
    });
  }

  abrirDialogSinalWireless() {
    const dialogRef = this.dialog.open(SinalwirelessFormComponent, {
      width: '600px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sinalWirelessService.findAll().subscribe((data) => {
          this.sinalWireless = data.resultado;
  
          const novoAtributo = this.sinalWireless.find(atributo => atributo.id === result.id);
          this.formGroup.get('sinalWireless')?.setValue(novoAtributo);
        });
      }
    });
  }

  compareById(o1: any, o2: any): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  // carregarImagemSelecionada(event: any) {
  //   this.selectedFile = event.target.files[0];

  //   if (this.selectedFile) {
  //     this.fileName = this.selectedFile.name;
  //     // carregando image preview
  //     const reader = new FileReader();
  //     reader.onload = e => this.imagePreview = reader.result;
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

  carregarImagensSelecionadas(event: any) {
    const arquivos: FileList = event.target.files;

    if (arquivos && arquivos.length > 0) {
      this.selectedFiles = [];
      this.imagePreviews = [];

      for (let i = 0; i < arquivos.length; i++) {
        const file = arquivos[i];
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  private uploadImage(roteadorId: number) {
    if (this.selectedFile) {
      this.roteadorService.uploadImage(roteadorId, this.selectedFile.name, this.selectedFile)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('admin/roteadores');
        },
        error: err => {
          console.log('Erro ao fazer o upload da imagem');
          // tratar o erro
        }
      })
    } else {
      this.router.navigateByUrl('admin/roteadores');
    }
  }
  
  private uploadImages(roteadorId: number) {
    console.log("Esse é o meu selectFiles: " + this.selectedFiles);
    console.log("Esse é o meu selectFiles.length: " + this.selectedFiles.length);
  if (this.selectedFiles && this.selectedFiles.length > 0) {
    // Array de observables para os uploads
    const uploads = this.selectedFiles.map(file =>
      this.roteadorService.uploadImage(roteadorId, file.name, file)
    );

    // Usamos forkJoin para aguardar todos os uploads
    forkJoin(uploads).subscribe({
      next: () => {
        this.router.navigateByUrl('admin/roteadores');
      },
      error: err => {
        console.log('Erro ao fazer upload das imagens', err);
        // aqui você pode tratar erro para vários arquivos
      }
    });
  } else {
    this.router.navigateByUrl('admin/roteadores');
  }
}


  // Abre o seletor de arquivo quando o botão de upload é clicado
  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }

  // Manipula o upload de imagens via input de arquivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files)

      for (let i = 0; i < input.files.length; i++) {
        this.selectedFiles.push(input.files[i]);
      }

      // Limpa o input para permitir selecionar os mesmos arquivos novamente
      input.value = ''
    }
  }

  // Processa os arquivos selecionados
  handleFiles(files: FileList): void {
    Array.from(files).forEach(file => {
      // Verifica se o arquivo é uma imagem
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        alert(`O arquivo "${file.name}" não é uma imagem válida.`)
        return
      }
      
      // Verifica o tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`O arquivo "${file.name}" é muito grande. O tamanho máximo é 5MB.`)
        return
      }
      
      // Cria uma URL para prévia da imagem
      const imageUrl = URL.createObjectURL(file)
      
      // Adiciona a imagem ao array de imagens
      this.productImages.push({
        id: `img_${this.imageIdCounter++}`,
        file: file,
        url: imageUrl,
        isPrimary: this.productImages.length === 0 // A primeira imagem é definida como principal
      })
    })
  }

  setAsPrimary(imageId: string): void {
    this.productImages.forEach(image => {
      image.isPrimary = image.id === imageId
    })
  }

  // Remove uma imagem da lista
  removeImage(imageId: string): void {
    const imageIndex = this.productImages.findIndex(img => img.id === imageId)
    
    if (imageIndex !== -1) {
      const image = this.productImages[imageIndex]
      
      // Revoga a URL para liberar memória
      if (image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url)
      }
      
      // Remove a imagem do array
      this.productImages.splice(imageIndex, 1)
      
      // Se a imagem removida era a principal e ainda existem outras imagens,
      // define a primeira imagem restante como principal
      if (image.isPrimary && this.productImages.length > 0) {
        this.productImages[0].isPrimary = true
      }
    }
  }

  // Move uma imagem para cima na ordem
  moveImageUp(imageId: string): void {
    const imageIndex = this.productImages.findIndex(img => img.id === imageId)
    
    if (imageIndex > 0) {
      const temp = this.productImages[imageIndex]
      this.productImages[imageIndex] = this.productImages[imageIndex - 1]
      this.productImages[imageIndex - 1] = temp
    }
  }

  // Move uma imagem para baixo na ordem
  moveImageDown(imageId: string): void {
    const imageIndex = this.productImages.findIndex(img => img.id === imageId)
    
    if (imageIndex < this.productImages.length - 1) {
      const temp = this.productImages[imageIndex]
      this.productImages[imageIndex] = this.productImages[imageIndex + 1]
      this.productImages[imageIndex + 1] = temp
    }
  }

  loadImagesFromRoteador(roteador: Roteador) {
    this.productImages = roteador.listaImagem.map((nomeImagem, index) => ({
      id: index.toString(),
      url: this.roteadorService.getUrlImage(nomeImagem), // gera a url completa
      isPrimary: index === 0,  // a primeira imagem é a principal
    }));
  }

  formatarValorMonetario(event: any): void {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    const floatValue = parseFloat(valor) / 100; // Converte para float (centavos para reais)

    this.formGroup.get('preco')?.setValue(floatValue.toFixed(2)); // Atualiza o formControl com o valor numérico

    // Formata para exibição com "R$" e vírgula
    this.precoFormatado = `R$ ${floatValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    // Atualiza visualmente o input (isso é importante para o cursor não pular)
    event.target.value = this.precoFormatado;
  }
  
}
