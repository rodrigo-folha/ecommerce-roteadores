import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FornecedorService } from '../../../services/fornecedor.service';
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
import { Fornecedor } from '../../../models/fornecedor.model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Telefone } from '../../../models/telefone.model';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';
import { Endereco } from '../../../models/endereco.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fornecedor-form',
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
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css',
})
export class FornecedorFormComponent {
  formGroup!: FormGroup;
  cidades: Cidade[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cidadeService: CidadeService,
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
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
    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

    this.formGroup = this.formBuilder.group({
      id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
      nome: [(fornecedor && fornecedor.nome) ? fornecedor.nome : null, Validators.required],
      cnpj: [(fornecedor && fornecedor.cnpj) ? fornecedor.cnpj : null, Validators.required],
      email: [(fornecedor && fornecedor.email) ? fornecedor.email : null, [Validators.required, Validators.email]],
      telefones: this.formBuilder.array([]),
      enderecos: this.formBuilder.array([]),
    });

    fornecedor?.telefones.forEach(telefone => {
      this.adicionarTelefone(telefone);
    })

    fornecedor?.enderecos.forEach(endereco => {
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
      const fornecedor = this.formGroup.value;
      if(fornecedor.id == null) {
        this.cadastrar(fornecedor);
      } else {
        this.atualizar(fornecedor);
      }
    }
  }

  cadastrar(fornecedor: any) {
    this.fornecedorService.insert(fornecedor).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/fornecedors');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(fornecedor: any) {
    this.fornecedorService.update(fornecedor).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/fornecedors');
      },
      error: (e) => {
        console.log('Erro ao atualizar', JSON.stringify(e));
      },
    });
  }

  excluir() {
    const fornecedor = this.formGroup.value;
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
        this.fornecedorService.delete(fornecedor).subscribe({
          next: () => {
            Swal.fire({
              title: "Deletado!",
              text: "Fornecedor deletado com sucesso!",
              icon: "success"
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin/fornecedores']);
            });
          },
          error: (e) => {
            console.log('Erro ao excluir', JSON.stringify(e));
          }
        });
      }
    });
  }

  compareCidades(c1: Cidade, c2: Cidade): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}