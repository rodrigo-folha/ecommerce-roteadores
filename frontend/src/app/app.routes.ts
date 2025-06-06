import { Routes } from '@angular/router';
import { BandafrequenciaFormComponent } from './components/bandafrequencia/bandafrequencia-form/bandafrequencia-form.component';
import { BandafrequenciaListComponent } from './components/bandafrequencia/bandafrequencia-list/bandafrequencia-list.component';
import { bandaFrequenciaResolver } from './components/bandafrequencia/bandafrequencia.resolver';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { CidadeFormComponent } from './components/cidade/cidade-form/cidade-form.component';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { cidadeResolver } from './components/cidade/cidade.resolver';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { estadoResolver } from './components/estado/estado.resolver';
import { LoginComponent } from './components/login/login.component';
import { ProtocolosegurancaFormComponent } from './components/protocoloseguranca/protocoloseguranca-form/protocoloseguranca-form.component';
import { ProtocolosegurancaListComponent } from './components/protocoloseguranca/protocoloseguranca-list/protocoloseguranca-list.component';
import { protocoloSegurancaResolver } from './components/protocoloseguranca/protocoloseguranca.resolver';
import { RoteadorListComponent } from './components/roteador/roteador-list/roteador-list.component';
import { sinalWirelessResolver } from './components/sinalwireless/sinalwireless.resolver';
import { SinalwirelessFormComponent } from './components/sinalwireless/sinalwireless-form/sinalwireless-form.component';
import { SinalwirelessListComponent } from './components/sinalwireless/sinalwireless-list/sinalwireless-list.component';
import { sistemaoperacionalResolver } from './components/sistemaoperacional/sistemaoperacional.resolver';
import { SistemaoperacionalFormComponent } from './components/sistemaoperacional/sistemaoperacional-form/sistemaoperacional-form.component';
import { SistemaoperacionalListComponent } from './components/sistemaoperacional/sistemaoperacional-list/sistemaoperacional-list.component';
import { HomeComponent } from './components/template/home/home.component';
import { QuantidadeantenaListComponent } from './components/quantidadeantena/quantidadeantena-list/quantidadeantena-list.component';
import { QuantidadeantenaFormComponent } from './components/quantidadeantena/quantidadeantena-form/quantidadeantena-form.component';
import { quantidadeantenaResolver } from './components/quantidadeantena/quantidadeantena.resolver';
import { RoteadorFormComponent } from './components/roteador/roteador-form/roteador-form.component';
import { roteadorResolver } from './components/roteador/roteador.resolver';
import { LoteListComponent } from './components/lote/lote-list/lote-list.component';
import { LoteFormComponent } from './components/lote/lote-form/lote-form.component';
import { loteResolver } from './components/lote/lote.resolver';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { FuncionarioFormComponent } from './components/funcionario/funcionario-form/funcionario-form.component';
import { funcionarioResolver } from './components/funcionario/funcionario.resolver';
import { SidebarComponent } from './components/template/sidebar/sidebar.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { CupomListComponent } from './components/cupom/cupom-list/cupom-list.component';
import { CupomFormComponent } from './components/cupom/cupom-form/cupom-form.component';
import { cupomResolver } from './components/cupom/cupom.resolver';
import { HeaderAdminComponent } from './components/template/admin-template/header-admin/header-admin.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { fornecedorResolver } from './components/fornecedor/fornecedor.resolver';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import { clienteResolver } from './components/cliente/cliente.resolver';
import { PaginaInicialComponent } from './components/inicio/pagina-inicial/pagina-inicial.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { PageNotFoundComponent } from './components/template/page-not-found/page-not-found.component';
import { HomeUserComponent } from './components/template/user-template/home-user/home-user.component';
import { PaginaProdutoComponent } from './components/template/user-template/pagina-produto/pagina-produto.component';
import { LoginUserComponent } from './components/template/user-template/login-user/login-user.component';
import { RegistrarUserComponent } from './components/template/user-template/registrar-user/registrar-user.component';
import { PaginaRoteadoresComponent } from './components/template/user-template/pagina-roteadores/pagina-roteadores.component';
import { HomeAdminComponent } from './components/template/admin-template/home-admin/home-admin.component';
import { PerfilAdminComponent } from './components/template/admin-template/perfil-admin/perfil-admin.component';
import { ProdutoAdminComponent } from './components/template/admin-template/produto-admin/produto-admin.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { CartComponent } from './components/cart/cart.component';
import { PerfilUsuarioComponent } from './components/template/user-template/perfil-usuario/perfil-usuario.component';
import { authGuard } from './guards/auth.guard';
import { PedidosComponent } from './components/template/user-template/pedidos/pedidos.component';
import { pedidoResolver } from './components/template/user-template/pedidos/pedido.resolver';
import { authAdminGuard } from './guards/auth-admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: UserTemplateComponent,
    title: 'e-commerce',
    children: [
      {path: '', pathMatch: 'full', redirectTo: ''},
      {path: '', component: HomeUserComponent},
      {path: 'pagina-roteador/:id', component: PaginaProdutoComponent, resolve: {roteador: roteadorResolver}},
      
      {path: 'carrinho', component: CartComponent},
      
      {path: 'login', component: LoginUserComponent},
      {path: 'cadastrar', component: RegistrarUserComponent},
      {path: 'roteadores', component: PaginaRoteadoresComponent},
      
      {path: 'minha-conta', component: PerfilUsuarioComponent, canActivate: [authGuard]},
      {path: 'minha-conta/pedidos/:id', component: PedidosComponent, canActivate: [authGuard], resolve: {pedido: pedidoResolver}},
      // {path: 'login', component: LoginComponent},
      // {path: 'cadastrar', component: CadastroComponent},
    ]
  },

  {path: 'admin/login', component: LoginComponent, title: 'Login' },

  {
    path: 'admin',
    component: AdminTemplateComponent,
    title: 'Administrativo',
    canActivate: [authAdminGuard],
    children: [
      // {path: 'sidebar', component: SidebarComponent},

      
        {path: '', pathMatch: 'full', redirectTo: 'admin'},
        {path: '', component: HomeComponent, title: 'Home'},

        // {path: 'login', component: LoginComponent, title: 'Login' },
      
        {path: 'home-admin', component: HomeAdminComponent, title: 'Home Admin'},
        {path: 'perfil', component: PerfilAdminComponent, title: 'Perfil Admin'},
        {path: 'produto-admin', component: ProdutoAdminComponent, title: 'Produto Admin'},

        {path: 'estados', component: EstadoListComponent},
        {path: 'estados/new', component: EstadoFormComponent},
        {path: 'estados/edit/:id', component: EstadoFormComponent, resolve: {estado: estadoResolver}},
        
        {path: 'cidades', component: CidadeListComponent},
        {path: 'cidades/new', component: CidadeFormComponent},
        {path: 'cidades/edit/:id', component: CidadeFormComponent, resolve: {cidade: cidadeResolver}},

        {path: 'lotes', component: LoteListComponent},
        {path: 'lotes/new', component: LoteFormComponent},
        {path: 'lotes/edit/:id', component: LoteFormComponent, resolve: {lote: loteResolver}},

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

        {path: 'clientes', component: ClienteListComponent},
        {path: 'clientes/new', component: ClienteFormComponent},
        {path: 'clientes/edit/:id', component: ClienteFormComponent, resolve: {cliente: clienteResolver}},

        {path: 'funcionarios', component: FuncionarioListComponent},
        {path: 'funcionarios/new', component: FuncionarioFormComponent},
        {path: 'funcionarios/edit/:id', component: FuncionarioFormComponent, resolve: {funcionario: funcionarioResolver}},

        {path: 'fornecedores', component: FornecedorListComponent},
        {path: 'fornecedores/new', component: FornecedorFormComponent},
        {path: 'fornecedores/edit/:id', component: FornecedorFormComponent, resolve: {fornecedor: fornecedorResolver}},
        
        {path: 'cupons', component: CupomListComponent},
        {path: 'cupons/new', component: CupomFormComponent},
        {path: 'cupons/edit/:id', component: CupomFormComponent, resolve: {cupom: cupomResolver}},

      ]
    },

    { path: "**", component: PageNotFoundComponent },
    
    
];
