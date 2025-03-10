import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { HomeComponent } from './components/template/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { RoteadorListComponent } from './components/roteador/roteador-list/roteador-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { estadoResolver } from './components/estado/resolver';
import { CidadeFormComponent } from './components/cidade/cidade-form/cidade-form.component';
import { cidadeResolver } from './components/cidade/resolver';

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
        
        {path: 'login', component: LoginComponent},
        {path: 'cadastrar', component: CadastroComponent},
    ]
  }
];
