import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private formBuilder: FormBuilder,
    private roteadorService: RoteadorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sistemaOperacionalService: SistemaOperacionalService,
    private bandaFrequenciaService: BandaFrequenciaService,
    private protocoloSegurancaService: ProtocoloSegurancaService,
    private quantidadeAntenaService: QuantidadeAntenaService,
    private sinalWirelessService: SinalWirelessService
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
    });
  }

  ngOnInit(): void {
    forkJoin({
      sistemasOperacionais: this.sistemaOperacionalService.findAll(),
      bandasFrequencia: this.bandaFrequenciaService.findAll(),
      protocolosSeguranca: this.protocoloSegurancaService.findAll(),
      quantidadeAntenas: this.quantidadeAntenaService.findAll(),
      sinaisWireless: this.sinalWirelessService.findAll(),
    }).subscribe((response) => {
      this.sistemasOperacionais = response.sistemasOperacionais;
      this.bandaFrequencias = response.bandasFrequencia;
      this.protocolosSeguranca = response.protocolosSeguranca;
      this.quantidadeAntenas = response.quantidadeAntenas;
      this.sinalWireless = response.sinaisWireless;
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
    })
  }

  salvar() {
    if (this.formGroup.valid) {
      const roteador = this.formGroup.value;
      if(roteador.id == null) {
        this.cadastrar(roteador);
      } else {
        this.atualizar(roteador);
      }
    }
  }

  cadastrar(roteador: any) {
    this.roteadorService.insert(roteador).subscribe({
      next: (roteadorCadastrado) => {
        this.router.navigateByUrl('/roteadores');
      },
      error: (e) => {
        console.log('Erro ao salvar', JSON.stringify(e));
      },
    });
  }

  atualizar(roteador: any) {
    this.roteadorService.update(roteador).subscribe({
      next: () => {
        this.router.navigateByUrl('/roteadores');
      },
      error: (e) => {
        console.log('Erro ao atualizar', JSON.stringify(e));
      },
    });
  }

  excluir() {
    const roteador = this.formGroup.value;
    this.roteadorService.delete(roteador).subscribe({
      next: () => {
        this.router.navigateByUrl('/roteadores');
      },
      error: (e) => {
        console.log('Erro ao excluir', JSON.stringify(e));
      },
    });
  }
}
