package br.unitins.tp1.roteadores;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.everyItem;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;
import java.util.List;

import br.unitins.tp1.roteadores.dto.FornecedorRequestDTO;
import br.unitins.tp1.roteadores.dto.TelefoneRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.model.Fornecedor;
import br.unitins.tp1.roteadores.service.FornecedorService;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.MediaType;

@QuarkusTest
public class FornecedorResourceTest {
    
    @Inject
    public FornecedorService fornecedorService;

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testFindById() {
        given()
            .when().get("/fornecedores/1")
            .then().statusCode(200)
            .body("id", is(1));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testFindByNome() {
        given()
            .when().pathParam("nome", "Prefeitura de Palmas")
            .get("/fornecedores/search/{nome}")
            .then().statusCode(200)
            .body("nome", hasItem(is("Prefeitura de Palmas")));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testFindByCnpj() {
        given()
            .when().pathParam("cnpj", "24851")
            .get("/fornecedores/search/cnpj/{cnpj}")
            .then().statusCode(200)
            .body("bandaFrequencia.id", everyItem(is(notNullValue())),
                  "bandaFrequencia.nome", everyItem(is("24851")));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testFindByEmail() {
        given()
            .when().pathParam("email", "@to.gov.br")
            .get("/fornecedores/search/email/{email}")
            .then().statusCode(200)
            .body("bandaFrequencia.id", everyItem(is(notNullValue())),
                  "bandaFrequencia.nome", everyItem(is("@to.gov.br")));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testFindAll() {
        given()
            .when().get("/fornecedores")
            .then().statusCode(200);
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testCreate() {
        FornecedorRequestDTO dto = new FornecedorRequestDTO(
            "Prefeitura de Paraiso",
            "00299180000154",
            "paraiso@to.gov.br",
            List.of(new TelefoneRequestDTO("63", "3904-1538"),
                    new TelefoneRequestDTO("63", "3904-1668")),
            List.of(new EnderecoRequestDTO("Av. Transbrasiliana", "Centro", "335", "Sem Complemento", "77600000", 2l))
            );

        given()
            .contentType(MediaType.APPLICATION_JSON)
            .body(dto)
            .when()
                .post("/fornecedores")
            .then()
                .statusCode(201)
                .body("nome", is("Prefeitura de Paraiso"),
                      "cnpj", is("00299180000154"),
                      "email", is("paraiso@to.gov.br"),
                      "telefones.numero", hasItem(is("3904-1538")),
                      "enderecos.cep", hasItem(is("77600000")));
                
        // removendo o dado que foi inserido
        fornecedorService.delete(fornecedorService.findByNome("Prefeitura de Paraiso").getFirst().getId());
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testUpdate() {
        FornecedorRequestDTO dto = new FornecedorRequestDTO(
            "Prefeitura de Paraiso",
            "00299180000152",
            "paraisodotocantins@to.gov.br",
            List.of(new TelefoneRequestDTO("63", "3904-1538")),
            List.of(new EnderecoRequestDTO("Av. Transbrasiliana", "Centro", "335", "Sem Complemento", "77600000", 2l))
            );

        long id = fornecedorService.create(dto).getId();

        FornecedorRequestDTO novoDto = new FornecedorRequestDTO(
            "Prefeitura de Paraiso 2",
            "00299180000153",
            "paraisodotocantins2@to.gov.br",
            List.of(new TelefoneRequestDTO("63", "3904-1538")),
            List.of(new EnderecoRequestDTO("Av. Transbrasiliana", "Centro", "335", "Sem Complemento", "77600000", 2l))
            );

        given()
            .contentType(ContentType.JSON)
            .body(novoDto)
            .when()
                .put("/fornecedores/" + id)
            .then()
                .statusCode(204);
        
        Fornecedor fornecedor = fornecedorService.findById(id);

        assertEquals(fornecedor.getNome(), "Prefeitura de Paraiso 2");
        assertEquals(fornecedor.getCnpj(), "00299180000153");
        assertEquals(fornecedor.getEmail(), "paraisodotocantins2@to.gov.br");

        fornecedorService.delete(id);

    }  

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testDelete() {
        FornecedorRequestDTO dto = new FornecedorRequestDTO(
            "Prefeitura de Paraiso",
            "00299180000155",
            "paraisodotocantins@to.gov.br",
            List.of(new TelefoneRequestDTO("63", "3904-1538")),
            List.of(new EnderecoRequestDTO("Av. Transbrasiliana", "Centro", "335", "Sem Complemento", "77600000", 1l))
            );

        Long id = fornecedorService.create(dto).getId();

        given()
            .when()
                .delete("/fornecedores/" + id)
            .then().statusCode(204);

        Fornecedor fornecedor = fornecedorService.findById(id);
        assertNull(fornecedor);

    }
    


}
