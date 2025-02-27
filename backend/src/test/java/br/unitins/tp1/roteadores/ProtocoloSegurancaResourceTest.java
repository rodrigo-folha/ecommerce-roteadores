package br.unitins.tp1.roteadores;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

import br.unitins.tp1.roteadores.dto.roteador.ProtocoloSegurancaRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.ProtocoloSeguranca;
import br.unitins.tp1.roteadores.service.roteador.ProtocoloSegurancaService;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;

@QuarkusTest
public class ProtocoloSegurancaResourceTest {
    
    @Inject
    public ProtocoloSegurancaService protocoloSegurancaService;

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindById() {
        given()
            .when().get("/protocolosseguranca/1")
            .then().statusCode(200)
            .body("id", is(1));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindByNome() {
        given()
            .when().pathParam("nome", "WPA2-PSK")
            .get("/protocolosseguranca/search/{nome}")
            .then().statusCode(200)
            .body("nome", hasItem(is("WPA2-PSK")));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindAll() {
        given()
            .when().get("/protocolosseguranca")
            .then().statusCode(200);
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testCreate() {
        ProtocoloSegurancaRequestDTO dto = new ProtocoloSegurancaRequestDTO("WPA 5");

        given()
            .contentType(ContentType.JSON)
            .body(dto)
            .when()
                .post("/protocolosseguranca")
            .then()
                .statusCode(201)
                .body("nome", is("WPA 5"));
                
        // removendo o dado que foi inserido
        protocoloSegurancaService.delete(protocoloSegurancaService.findByNome("WPA 5").getFirst().getId());
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testUpdate() {
        ProtocoloSegurancaRequestDTO dto = new ProtocoloSegurancaRequestDTO("WPA 5");
        long id = protocoloSegurancaService.create(dto).getId();

        ProtocoloSegurancaRequestDTO novoDto = new ProtocoloSegurancaRequestDTO("WPA 6");

        given()
            .contentType(ContentType.JSON)
            .body(novoDto)
            .when()
                .put("/protocolosseguranca/" + id)
            .then()
                .statusCode(204);
        
        ProtocoloSeguranca protocoloSeguranca = protocoloSegurancaService.findById(id);

        assertEquals(protocoloSeguranca.getNome(), "WPA 6");

        protocoloSegurancaService.delete(id);

    }  

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testDelete() {
        ProtocoloSegurancaRequestDTO dto = new ProtocoloSegurancaRequestDTO("WPA 5");
        Long id = protocoloSegurancaService.create(dto).getId();

        given()
            .when()
                .delete("/protocolosseguranca/" + id)
            .then().statusCode(204);

        ProtocoloSeguranca protocoloSeguranca = protocoloSegurancaService.findById(id);
        assertNull(protocoloSeguranca);

    }
    


}
