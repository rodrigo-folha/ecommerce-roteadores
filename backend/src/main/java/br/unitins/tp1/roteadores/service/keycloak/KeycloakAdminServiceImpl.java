package br.unitins.tp1.roteadores.service.keycloak;

import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.Json;
import jakarta.json.JsonObject;

@ApplicationScoped
public class KeycloakAdminServiceImpl implements KeycloakAdminService{

    @ConfigProperty(name = "keycloak.url")
    String KEYCLOAK_URL;

    @ConfigProperty(name = "keycloak.realm")
    String REALM;

    @ConfigProperty(name = "keycloak.client-id")
    String CLIENT_ID;

    @ConfigProperty(name = "keycloak.client-secret")
    String CLIENT_SECRET;

    @ConfigProperty(name = "keycloak.username")
    String USERNAME;

    @ConfigProperty(name = "keycloak.password")
    String PASSWORD;

    @Override
    public String obterAdminToken() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            String body = "username=" + USERNAME +
                          "&password=" + PASSWORD +
                          "&grant_type=password" +
                          "&client_id=" + CLIENT_ID +
                          "&client_secret=" + CLIENT_SECRET;

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(KEYCLOAK_URL + "/realms/" + REALM + "/protocol/openid-connect/token"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            JsonObject json = Json.createReader(new StringReader(response.body())).readObject();

            return json.getString("access_token");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter token do Keycloak", e);
        }
    }

    @Override
    public String obterToken(String login, String senha) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            String body = "username=" + login +
                          "&password=" + senha +
                          "&grant_type=password" +
                          "&client_id=" + CLIENT_ID +
                          "&client_secret=" + CLIENT_SECRET;

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(KEYCLOAK_URL + "/realms/" + REALM + "/protocol/openid-connect/token"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            JsonObject json = Json.createReader(new StringReader(response.body())).readObject();

            return json.getString("access_token");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter token do Keycloak", e);
        }
    }

    @Override
    public void criarUsuario(String username, String email, String senha) {
        String token = obterAdminToken();

        System.out.println("esse é o meu token: " + token);
        System.out.println("Esse é o meu username: " + username);
        System.out.println("Esse é o meu email: " + email);
        System.out.println("Essa é a minha senha: " + senha);

        JsonObject novoUsuario = Json.createObjectBuilder()
            .add("username", username)
            .add("enabled", true)
            .add("emailVerified", true)
            .add("email", email)
            .add("credentials", Json.createArrayBuilder().add(
                Json.createObjectBuilder()
                    .add("type", "password")
                    .add("value", senha)
                    .add("temporary", false)
            ))
            .build();

        System.out.println("Esse é o meu JsonObject novoUsuario: " + novoUsuario);

        try {
            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(KEYCLOAK_URL + "/admin/realms/quarkus/users"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + token)
                .POST(HttpRequest.BodyPublishers.ofString(novoUsuario.toString()))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 201) {
                throw new RuntimeException("Erro ao criar usuário: " + response.body());
            }

        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar usuário", e);
        }
    }

    @Override
    public void atribuirRoleUser(String username) {
        String token = obterAdminToken();
    
        try {
            HttpClient client = HttpClient.newHttpClient();
    
            // 1. Buscar o ID do usuário pelo username
            HttpRequest getUserRequest = HttpRequest.newBuilder()
                .uri(URI.create(KEYCLOAK_URL + "/admin/realms/" + REALM + "/users?username=" + username))
                .header("Authorization", "Bearer " + token)
                .build();
    
            HttpResponse<String> getUserResponse = client.send(getUserRequest, HttpResponse.BodyHandlers.ofString());
    
            if (getUserResponse.statusCode() != 200) {
                throw new RuntimeException("Erro ao buscar usuário: " + getUserResponse.body());
            }
    
            var usuarios = Json.createReader(new StringReader(getUserResponse.body())).readArray();
    
            if (usuarios.isEmpty()) {
                throw new RuntimeException("Usuário não encontrado");
            }
    
            String userId = usuarios.getJsonObject(0).getString("id");
    
            // 2. Buscar a role "User"
            HttpRequest getRoleRequest = HttpRequest.newBuilder()
                .uri(URI.create(KEYCLOAK_URL + "/admin/realms/" + REALM + "/roles/User"))
                .header("Authorization", "Bearer " + token)
                .build();
    
            HttpResponse<String> getRoleResponse = client.send(getRoleRequest, HttpResponse.BodyHandlers.ofString());
    
            if (getRoleResponse.statusCode() != 200) {
                throw new RuntimeException("Erro ao buscar role: " + getRoleResponse.body());
            }
    
            JsonObject role = Json.createReader(new StringReader(getRoleResponse.body())).readObject();
            String roleJson = "[" + role.toString() + "]";
    
            // 3. Atribuir a role ao usuário
            HttpRequest assignRoleRequest = HttpRequest.newBuilder()
                .uri(URI.create(KEYCLOAK_URL + "/admin/realms/" + REALM + "/users/" + userId + "/role-mappings/realm"))
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(roleJson))
                .build();
    
            HttpResponse<String> assignRoleResponse = client.send(assignRoleRequest, HttpResponse.BodyHandlers.ofString());
    
            if (assignRoleResponse.statusCode() != 204) {
                throw new RuntimeException("Erro ao atribuir role: " + assignRoleResponse.body());
            }
    
            System.out.println("Role 'User' atribuída com sucesso ao usuário " + username);
    
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atribuir role ao usuário", e);
        }
    }
    

    
}
