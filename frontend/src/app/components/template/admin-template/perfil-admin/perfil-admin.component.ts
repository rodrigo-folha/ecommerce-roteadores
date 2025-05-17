import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface AdminProfile {
  name: string
  email: string
  phone: string
  role: string
  bio: string
  avatar: string
  joinDate: string
  lastLogin: string
}

@Component({
  selector: 'app-perfil-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil-admin.component.html',
  styleUrl: './perfil-admin.component.css'
})
export class PerfilAdminComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  
  profileForm!: FormGroup
  passwordForm!: FormGroup
  notificationForm!: FormGroup
  
  activeTab = 'profile'
  isEditingAvatar = false
  avatarPreview: string | null = null
  
  // Dados simulados do perfil do administrador
  adminProfile: AdminProfile = {
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    phone: "(11) 98765-4321",
    role: "Administrador",
    bio: "Gerente de e-commerce com mais de 5 anos de experiência em gestão de lojas online e otimização de vendas.",
    avatar: "../login/placeholder.svg",
    joinDate: "15/01/2022",
    lastLogin: "12/05/2024 às 09:45"
  }
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    // Inicializa o formulário de perfil
    this.profileForm = this.fb.group({
      name: [this.adminProfile.name, [Validators.required]],
      email: [this.adminProfile.email, [Validators.required, Validators.email]],
      phone: [this.adminProfile.phone, [Validators.pattern(/^$$\d{2}$$\s\d{5}-\d{4}$/)]],
      role: [{value: this.adminProfile.role, disabled: true}],
      bio: [this.adminProfile.bio]
    })
    
    // Inicializa o formulário de senha
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator })
    
    // Inicializa o formulário de notificações
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      orderUpdates: [true],
      newProducts: [false],
      marketingEmails: [false],
      securityAlerts: [true]
    })
  }
  
  // Validador para verificar se as senhas coincidem
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value
    const confirmPassword = form.get('confirmPassword')?.value
    
    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }
    
    return null
  }
  
  // Alterna entre as abas
  setActiveTab(tab: string): void {
    this.activeTab = tab
  }
  
  // Abre o seletor de arquivo quando o botão de upload é clicado
  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }
  
  // Manipula o upload de imagem
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      
      // Verifica se o arquivo é uma imagem
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        alert('Por favor, selecione um arquivo de imagem válido.')
        return
      }
      
      // Verifica o tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo é muito grande. O tamanho máximo é 5MB.')
        return
      }
      
      // Cria uma prévia da imagem
      const reader = new FileReader()
      reader.onload = () => {
        this.avatarPreview = reader.result as string
        this.isEditingAvatar = true
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Salva a nova imagem de avatar
  saveAvatar(): void {
    if (this.avatarPreview) {
      this.adminProfile.avatar = this.avatarPreview
      this.cancelAvatarEdit()
    }
  }
  
  // Cancela a edição do avatar
  cancelAvatarEdit(): void {
    this.isEditingAvatar = false
    this.avatarPreview = null
    this.fileInput.nativeElement.value = ''
  }
  
  // Salva as alterações do perfil
  saveProfile(): void {
    if (this.profileForm.valid) {
      // Em um aplicativo real, você enviaria os dados para o servidor
      this.adminProfile = {
        ...this.adminProfile,
        name: this.profileForm.value.name,
        email: this.profileForm.value.email,
        phone: this.profileForm.value.phone,
        bio: this.profileForm.value.bio
      }
      
      alert('Perfil atualizado com sucesso!')
    } else {
      this.profileForm.markAllAsTouched()
    }
  }
  
  // Altera a senha
  changePassword(): void {
    if (this.passwordForm.valid) {
      // Em um aplicativo real, você enviaria os dados para o servidor
      alert('Senha alterada com sucesso!')
      this.passwordForm.reset()
    } else {
      this.passwordForm.markAllAsTouched()
    }
  }
  
  // Salva as configurações de notificação
  saveNotificationSettings(): void {
    // Em um aplicativo real, você enviaria os dados para o servidor
    alert('Configurações de notificação salvas com sucesso!')
  }
  
  // Getters para facilitar o acesso aos controles do formulário
  get name() { return this.profileForm.get('name') }
  get email() { return this.profileForm.get('email') }
  get phone() { return this.profileForm.get('phone') }
  get bio() { return this.profileForm.get('bio') }
  
  get currentPassword() { return this.passwordForm.get('currentPassword') }
  get newPassword() { return this.passwordForm.get('newPassword') }
  get confirmPassword() { return this.passwordForm.get('confirmPassword') }
}