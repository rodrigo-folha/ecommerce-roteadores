package br.unitins.tp1.roteadores;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

import br.unitins.tp1.roteadores.dto.roteador.SistemaOperacionalRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.SistemaOperacional;
import br.unitins.tp1.roteadores.service.roteador.SistemaOperacionalService;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;

@QuarkusTest
public class SistemaOperacionalResourceTest {
    
    @Inject
    public SistemaOperacionalService sistemaOperacionalService;

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindById() {
        given()
            .when().get("/sistemasoperacionais/1")
            .then().statusCode(200)
            .body("id", is(1));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindByNome() {
        given()
            .when().pathParam("nome", "RouterOS")
            .get("/sistemasoperacionais/search/{nome}")
            .then().statusCode(200)
            .body("nome", hasItem(is("RouterOS")));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindAll() {
        given()
            .when().get("/sistemasoperacionais")
            .then().statusCode(200);
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testCreate() {
        SistemaOperacionalRequestDTO dto = new SistemaOperacionalRequestDTO("Windows XP");

        given()
            .contentType(ContentType.JSON)
            .body(dto)
            .when()
                .post("/sistemasoperacionais")
            .then()
                .statusCode(201)
                .body("nome", is("Windows XP"));
                
        // removendo o dado que foi inserido
        sistemaOperacionalService.delete(sistemaOperacionalService.findByNome("Windows XP").getFirst().getId());
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testUpdate() {
        SistemaOperacionalRequestDTO dto = new SistemaOperacionalRequestDTO("Windows XP");
        long id = sistemaOperacionalService.create(dto).getId();

        SistemaOperacionalRequestDTO novoDto = new SistemaOperacionalRequestDTO("Windows XP");

        given()
            .contentType(ContentType.JSON)
            .body(novoDto)
            .when()
                .put("/sistemasoperacionais/" + id)
            .then()
                .statusCode(204);
        
        SistemaOperacional sistemaOperacional = sistemaOperacionalService.findById(id);

        assertEquals(sistemaOperacional.getNome(), "Windows XP");

        sistemaOperacionalService.delete(id);

    }  

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testDelete() {
        SistemaOperacionalRequestDTO dto = new SistemaOperacionalRequestDTO("Windows XP");
        Long id = sistemaOperacionalService.create(dto).getId();

        given()
            .when()
                .delete("/sistemasoperacionais/" + id)
            .then().statusCode(204);

        SistemaOperacional sistemaOperacional = sistemaOperacionalService.findById(id);
        assertNull(sistemaOperacional);

    }
    


}
