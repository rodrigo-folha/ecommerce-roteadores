import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CupomService } from '../../../services/cupom.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { Cupom } from '../../../models/cupom.model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cupom-form',
  providers: [provideNativeDateAdapter(), {
      provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
    ],
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule, 
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './cupom-form.component.html',
  styleUrl: './cupom-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CupomFormComponent {
  formGroup: FormGroup;

  cupons: Cupom[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cupomService: CupomService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      codigo: ['', Validators.required],
      percentualDesconto: ['', Validators.required],
      validade: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const cupom: Cupom = this.activatedRoute.snapshot.data['cupom'];

    this.formGroup = this.formBuilder.group({
      id: [(cupom && cupom.id) ? cupom.id : null],
      codigo: [(cupom && cupom.codigo) ? cupom.codigo : null, Validators.required],
      percentualDesconto: [(cupom && cupom.percentualDesconto) ? cupom.percentualDesconto : null, Validators.required],
      validade: [(cupom && cupom.validade) ? cupom.validade : null, Validators.required],
    })
  }

  salvar() {
    if (this.formGroup.valid) {
      const cupom = this.formGroup.value;
      if(cupom.id == null) {
        this.cadastrar(cupom);
      } else {
        this.atualizar(cupom);
      }
    }
  }

  cadastrar(cupom: any) {
    this.cupomService.insert(cupom).subscribe({
      next: (cupomCadastrado) => {
        this.router.navigateByUrl('/admin/cupons');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(cupom: any) {
    this.cupomService.update(cupom).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/cupons');
      }
    });
  }

  excluir() {
    const cupom = this.formGroup.value;
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
            this.cupomService.delete(cupom).subscribe({
              next: () => {
                Swal.fire({
                  title: "Deletado!",
                  text: "Cupom deletado com sucesso!",
                  icon: "success"
                });
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/admin/cupons']);
                });
              },
              error: (e) => {
                console.log('Erro ao excluir', JSON.stringify(e));
              }
            });
          }
        });
  }
}
