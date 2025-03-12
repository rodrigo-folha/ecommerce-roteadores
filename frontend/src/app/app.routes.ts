import { Routes } from '@angular/router';
import { BandafrequenciaFormComponent } from './components/bandafrequencia/bandafrequencia-form/bandafrequencia-form.component';
import { BandafrequenciaListComponent } from './components/bandafrequencia/bandafrequencia-list/bandafrequencia-list.component';
import { bandaFrequenciaResolver } from './components/bandafrequencia/resolver';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { CidadeFormComponent } from './components/cidade/cidade-form/cidade-form.component';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { cidadeResolver } from './components/cidade/resolver';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { estadoResolver } from './components/estado/resolver';
import { LoginComponent } from './components/login/login.component';
import { ProtocolosegurancaFormComponent } from './components/protocoloseguranca/protocoloseguranca-form/protocoloseguranca-form.component';
import { ProtocolosegurancaListComponent } from './components/protocoloseguranca/protocoloseguranca-list/protocoloseguranca-list.component';
import { protocoloSegurancaResolver } from './components/protocoloseguranca/resolver';
import { RoteadorListComponent } from './components/roteador/roteador-list/roteador-list.component';
import { sinalWirelessResolver } from './components/sinalwireless/resolver';
import { SinalwirelessFormComponent } from './components/sinalwireless/sinalwireless-form/sinalwireless-form.component';
import { SinalwirelessListComponent } from './components/sinalwireless/sinalwireless-list/sinalwireless-list.component';
import { sistemaoperacionalResolver } from './components/sistemaoperacional/resolver';
import { SistemaoperacionalFormComponent } from './components/sistemaoperacional/sistemaoperacional-form/sistemaoperacional-form.component';
import { SistemaoperacionalListComponent } from './components/sistemaoperacional/sistemaoperacional-list/sistemaoperacional-list.component';
import { HomeComponent } from './components/template/home/home.component';
import { QuantidadeantenaListComponent } from './components/quantidadeantena/quantidadeantena-list/quantidadeantena-list.component';
import { QuantidadeantenaFormComponent } from './components/quantidadeantena/quantidadeantena-form/quantidadeantena-form.component';
import { quantidadeantenaResolver } from './components/quantidadeantena/resolver';
import { RoteadorFormComponent } from './components/roteador/roteador-form/roteador-form.component';
import { roteadorResolver } from './components/roteador/resolver';

export const routes: Routes = [
//   {path: 'estados', component: EstadoListComponent, title: 'Lista de Estados',},
//   {path: 'cidades', component: CidadeListComponent, title: 'Lista de Cidades',},
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    children: [
        {path: '', component: EstadoListComponent},

        {path: 'estados', component: EstadoListComponent},
        {path: 'estados/new', component: EstadoFormComponent},
        {path: 'estados/edit/:id', component: EstadoFormComponent, resolve: {estado: estadoResolver}},
        
        {path: 'cidades', component: CidadeListComponent},
        {path: 'cidades/new', component: CidadeFormComponent},
        {path: 'cidades/edit/:id', component: CidadeFormComponent, resolve: {cidade: cidadeResolver}},

        {path: 'roteadores', component: RoteadorListComponent},
        {path: 'roteadores/new', component: RoteadorFormComponent},
        {path: 'roteadores/edit/:id', component: RoteadorFormComponent, resolve: {roteador: roteadorResolver}},

        {path: 'sistemasoperacionais', component: SistemaoperacionalListComponent},
        {path: 'sistemasoperacionais/new', component: SistemaoperacionalFormComponent},
        {path: 'sistemasoperacionais/edit/:id', component: SistemaoperacionalFormComponent, resolve: {sistemaoperacional: sistemaoperacionalResolver}},

        {path: 'sinalwireless', component: SinalwirelessListComponent},
        {path: 'sinalwireless/new', component: SinalwirelessFormComponent},
        {path: 'sinalwireless/edit/:id', component: SinalwirelessFormComponent, resolve: {sinalwireless: sinalWirelessResolver}},

        {path: 'bandafrequencias', component: BandafrequenciaListComponent},
        {path: 'bandafrequencias/new', component: BandafrequenciaFormComponent},
        {path: 'bandafrequencias/edit/:id', component: BandafrequenciaFormComponent, resolve: {bandafrequencia: bandaFrequenciaResolver}},

        {path: 'quantidadeantenas', component: QuantidadeantenaListComponent},
        {path: 'quantidadeantenas/new', component: QuantidadeantenaFormComponent},
        {path: 'quantidadeantenas/edit/:id', component: QuantidadeantenaFormComponent, resolve: {quantidadeantena: quantidadeantenaResolver}},

        {path: 'protocolosseguranca', component: ProtocolosegurancaListComponent},
        {path: 'protocolosseguranca/new', component: ProtocolosegurancaFormComponent},
        {path: 'protocolosseguranca/edit/:id', component: ProtocolosegurancaFormComponent, resolve: {protocoloseguranca: protocoloSegurancaResolver}},
        
        {path: 'login', component: LoginComponent},
        {path: 'cadastrar', component: CadastroComponent},
    ]
  }
];
