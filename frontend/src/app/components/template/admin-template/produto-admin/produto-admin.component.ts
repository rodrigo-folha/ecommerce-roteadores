import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Category {
  id: string
  name: string
}

interface ProductImage {
  id: string
  file: File | null
  url: string
  isPrimary: boolean
}

@Component({
  selector: 'app-produto-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './produto-admin.component.html',
  styleUrl: './produto-admin.component.css'
})
export class ProdutoAdminComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>
  @ViewChild("dropZone") dropZone!: ElementRef<HTMLDivElement>

  productForm!: FormGroup
  isSubmitting = false
  isDragging = false
  
  // Contador para gerar IDs únicos para as imagens
  private imageIdCounter = 0

  // Array para armazenar as imagens carregadas
  productImages: ProductImage[] = []

  // Dados simulados para as categorias
  categories: Category[] = [
    { id: "cat1", name: "Eletrônicos" },
    { id: "cat2", name: "Roupas" },
    { id: "cat3", name: "Acessórios" },
    { id: "cat4", name: "Casa e Decoração" },
    { id: "cat5", name: "Esportes" },
    { id: "cat6", name: "Livros" },
  ]

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicializa o formulário de produto
    this.productForm = this.fb.group({
      name: ["", [Validators.required]],
      sku: ["", [Validators.required]],
      categoryId: ["", [Validators.required]],
      price: ["", [Validators.required, Validators.min(0)]],
      salePrice: [""],
      stock: ["", [Validators.required, Validators.min(0)]],
      description: ["", [Validators.required]],
      shortDescription: [""],
      status: ["active", [Validators.required]],
      featured: [false],
      weight: [""],
      dimensions: this.fb.group({
        length: [""],
        width: [""],
        height: [""],
      }),
      tags: [""],
    })
  }

  ngAfterViewInit() {
    // Configurar eventos de drag and drop
    const dropZone = this.dropZone.nativeElement
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.isDragging = true
    })
    
    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.isDragging = false
    })
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.isDragging = false
      
      if (e.dataTransfer?.files) {
        this.handleFiles(e.dataTransfer.files)
      }
    })
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

  // Define uma imagem como principal
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

  // Verifica se há pelo menos uma imagem carregada
  hasImages(): boolean {
    return this.productImages.length > 0
  }

  // Verifica se há uma imagem principal definida
  hasPrimaryImage(): boolean {
    return this.productImages.some(img => img.isPrimary)
  }

  // Salva o produto
  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched()
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }
    
    if (!this.hasImages()) {
      alert("Por favor, adicione pelo menos uma imagem do produto.")
      return
    }
    
    if (!this.hasPrimaryImage()) {
      alert("Por favor, selecione uma imagem principal.")
      return
    }
    
    this.isSubmitting = true
    
    // Simulação de envio do formulário
    setTimeout(() => {
      // Em um aplicativo real, você enviaria os dados do formulário e as imagens para o servidor
      console.log('Dados do produto:', this.productForm.value)
      console.log('Imagens:', this.productImages)
      
      // Exibe mensagem de sucesso
      alert("Produto cadastrado com sucesso!")
      
      // Reseta o formulário e as imagens
      this.productForm.reset({
        status: 'active',
        featured: false
      })
      
      // Limpa as imagens
      this.productImages.forEach(image => {
        if (image.url.startsWith('blob:')) {
          URL.revokeObjectURL(image.url)
        }
      })
      this.productImages = []
      
      this.isSubmitting = false
    }, 1500)
  }

  // Formata o valor do preço para exibição
  formatPrice(event: Event): void {
    const input = event.target as HTMLInputElement
    let value = input.value.replace(/\D/g, '')
    
    if (value) {
      value = (parseInt(value) / 100).toFixed(2)
      input.value = value
    }
  }

  // Getters para facilitar o acesso aos controles do formulário
  get name() { return this.productForm.get('name') }
  get sku() { return this.productForm.get('sku') }
  get categoryId() { return this.productForm.get('categoryId') }
  get price() { return this.productForm.get('price') }
  get stock() { return this.productForm.get('stock') }
  get description() { return this.productForm.get('description') }
}

