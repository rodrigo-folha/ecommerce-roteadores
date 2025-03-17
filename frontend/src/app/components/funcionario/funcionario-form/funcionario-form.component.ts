import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FuncionarioService } from '../../../services/funcionario.service';
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
import { Funcionario } from '../../../models/funcionario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Telefone } from '../../../models/telefone.model';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';

@Component({
  selector: 'app-funcionario-form',
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
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css',
})
export class FuncionarioFormComponent {
  formGroup!: FormGroup;
  cidades: Cidade[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private funcionarioService: FuncionarioService,
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
    const funcionario: Funcionario = this.activatedRoute.snapshot.data['funcionario'];
    
    const usuario = funcionario?.id ? funcionario.usuario : null;
    console.log('Dados da API', usuario);

    this.formGroup = this.formBuilder.group({
      id: [(funcionario && funcionario.id) ? funcionario.id : null],
      nome: [(usuario && usuario.nome) ? usuario.nome : null, Validators.required],
      cpf: [(usuario && usuario.cpf) ? usuario.cpf : null, Validators.required],
      dataNascimento: [(usuario && usuario.dataNascimento) ? usuario.dataNascimento : null, Validators.required],
      email: [(usuario && usuario.email) ? usuario.email : null, [Validators.required, Validators.email]],
      senha: [(usuario && usuario.senha) ? usuario.senha : null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      telefones: this.formBuilder.array([]),
      enderecos: this.formBuilder.array([]),
    });

  }

  get telefones(): FormArray {
    return this.formGroup.get('telefones') as FormArray;
  }

  adicionarTelefone(telefone?: Telefone): void {
    const telefoneForm = this.formBuilder.group({
      codigoArea: [telefone ? telefone.codigoArea : ''],
      numero: [telefone ? telefone.numero : '']
    });
    this.telefones.push(telefoneForm);
  }

  criarTelefoneFormGroup(): FormGroup {
    return this.formBuilder.group({
      codigoArea: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      numero: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]],
    });
  }

  get enderecos(): FormArray {
    return this.formGroup.get('enderecos') as FormArray;
  }

  adicionarEndereco(endereco?: any): void {
    this.enderecos.push(this.criarEnderecoFormGroup());
  }

  criarEnderecoFormGroup(): FormGroup {
    return this.formBuilder.group({
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
    });
  }

  removeEndereco(index: number) {
    this.enderecos.removeAt(index);
  }

  removeTelefone(index: number) {
    this.telefones.removeAt(index);
  }

  salvar() {
    if (this.formGroup.valid) {
      const funcionario = this.formGroup.value;
      if(funcionario.id == null) {
        this.cadastrar(funcionario);
      } else {
        this.atualizar(funcionario);
      }
    }
  }

  cadastrar(funcionario: any) {
    this.funcionarioService.insert(funcionario).subscribe({
      next: () => {
        this.router.navigateByUrl('/funcionarios');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(funcionario: any) {
    this.funcionarioService.update(funcionario).subscribe({
      next: () => {
        this.router.navigateByUrl('/funcionarios');
      },
      error: (e) => {
        console.log('Erro ao atualizar', JSON.stringify(e));
      },
    });
  }

  excluir() {
    const funcionario = this.formGroup.value;
    this.funcionarioService.delete(funcionario).subscribe({
      next: () => {
        this.router.navigateByUrl('/funcionarios');
      },
      error: (e) => {
        console.log('Erro ao excluir', JSON.stringify(e));
      },
    });
  }
}