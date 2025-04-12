import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RoteadorService } from '../../../services/roteador.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { Roteador } from '../../../models/roteador.model';
import { forkJoin } from 'rxjs';
import { SistemaOperacionalService } from '../../../services/sistema-operacional.service';
import { BandaFrequenciaService } from '../../../services/banda-frequencia.service';
import { ProtocoloSegurancaService } from '../../../services/protocolo-seguranca.service';
import { QuantidadeAntenaService } from '../../../services/quantidade-antena.service';
import { SinalWirelessService } from '../../../services/sinal-wireless.service';
import { SistemaOperacional } from '../../../models/sistema-operacional.model';
import { SinalWireless } from '../../../models/sinal-wireless.model';
import { QuantidadeAntena } from '../../../models/quantidade-antena.model';
import { ProtocoloSeguranca } from '../../../models/protocolo-seguranca.model';
import { BandaFrequencia } from '../../../models/banda-frequencia.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-roteador-form',
  imports: [
    NgIf,
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

  roteadores: Roteador[] = [];
  sistemasOperacionais: SistemaOperacional[] = [];
  bandaFrequencias: BandaFrequencia[] = [];
  protocolosSeguranca: ProtocoloSeguranca[] = [];
  quantidadeAntenas: QuantidadeAntena[] = [];
  sinalWireless: SinalWireless[] = [];
  fornecedores: Fornecedor[] = [];

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
    private snackBar: MatSnackBar
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
  }

  salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const roteador = this.formGroup.value;

      const operacao = roteador.id == null
      ? this.roteadorService.insert(roteador)
      : this.roteadorService.update(roteador)

      operacao.subscribe({
        next: () => {
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
  
}
