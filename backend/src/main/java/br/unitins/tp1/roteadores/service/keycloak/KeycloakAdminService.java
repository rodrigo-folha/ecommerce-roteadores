package br.unitins.tp1.roteadores.service.keycloak;

public interface KeycloakAdminService {

    public String obterAdminToken();

    public String obterToken(String login, String senha);

    public void criarUsuario(String username, String email, String senha);

    public void atribuirRoleUser(String username);

    public void alterarSenhaUsuario(String username, String novaSenha);
    
}
