import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Cliente } from '../../../models/cliente.model';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Telefone } from '../../../models/telefone.model';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';
import { Endereco } from '../../../models/endereco.model';

@Component({
  selector: 'app-cliente-form',
  providers: [provideNativeDateAdapter(), {
      provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
    ],
  imports: [
    NgIf,
    NgFor,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css',
})
export class ClienteFormComponent {
  formGroup!: FormGroup;
  cidades: Cidade[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cidadeService: CidadeService,
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      telefones: [this.formBuilder.array([]), Validators.required],
      enderecos: [this.formBuilder.array([]), Validators.required],
    });
  }

  ngOnInit(): void {
    this.cidadeService.findAll().subscribe((data) => {
      this.cidades = data;
    });
    this.initializeForm();
  }

  initializeForm(): void {
    const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'];
    
    const usuario = cliente?.id ? cliente.usuario : null;
    console.log('Dados da API', usuario);

    this.formGroup = this.formBuilder.group({
      id: [(cliente && cliente.id) ? cliente.id : null],
      nome: [(usuario && usuario.nome) ? usuario.nome : null, Validators.required],
      cpf: [(usuario && usuario.cpf) ? usuario.cpf : null, Validators.required],
      dataNascimento: [(usuario && usuario.dataNascimento) ? usuario.dataNascimento : null, Validators.required],
      email: [(usuario && usuario.email) ? usuario.email : null, [Validators.required, Validators.email]],
      senha: [(usuario && usuario.senha) ? usuario.senha : null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      telefones: this.formBuilder.array([]),
      enderecos: this.formBuilder.array([]),
    });

    usuario?.telefones.forEach(telefone => {
      this.adicionarTelefone(telefone);
    })

    usuario?.enderecos.forEach(endereco => {
      this.adicionarEndereco(endereco);
    })

  }

  get telefones(): FormArray {
    return this.formGroup.get('telefones') as FormArray;
  }

  adicionarTelefone(telefone?: Telefone): void {
    const telefoneForm = this.formBuilder.group({
      codigoArea: [telefone ? telefone.codigoArea : '',[Validators.required]],
      numero: [telefone ? telefone.numero : '',[Validators.required]]
    });
    this.telefones.push(telefoneForm);
  }

  get enderecos(): FormArray {
    return this.formGroup.get('enderecos') as FormArray;
  }

  adicionarEndereco(endereco?: Endereco): void {
    console.log('Endereco', endereco);
    const enderecoForm = this.formBuilder.group({
      logradouro: [endereco ? endereco.logradouro : '',[Validators.required]],
      bairro: [endereco ? endereco.bairro : '',[Validators.required]],
      numero: [endereco ? endereco.numero : '',[Validators.required]],
      complemento: [endereco ? endereco.complemento : ''],
      cep: [endereco ? endereco.cep : '',[Validators.required]],
      cidade: [endereco ? endereco.cidade : '',[Validators.required]],
    })
    this.enderecos.push(enderecoForm);
  }

  removeEndereco(index: number) {
    this.enderecos.removeAt(index);
  }

  removeTelefone(index: number) {
    this.telefones.removeAt(index);
  }

  salvar() {
    if (this.formGroup.valid) {
      const cliente = this.formGroup.value;
      if(cliente.id == null) {
        this.cadastrar(cliente);
      } else {
        this.atualizar(cliente);
      }
    }
  }

  cadastrar(cliente: any) {
    this.clienteService.insert(cliente).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/clientes');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(cliente: any) {
    this.clienteService.update(cliente).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/clientes');
      },
      error: (e) => {
        console.log('Erro ao atualizar', JSON.stringify(e));
      },
    });
  }

  excluir() {
    const cliente = this.formGroup.value;
    this.clienteService.delete(cliente).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/clientes');
      },
      error: (e) => {
        console.log('Erro ao excluir', JSON.stringify(e));
      },
    });
  }

  compareCidades(c1: Cidade, c2: Cidade): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}