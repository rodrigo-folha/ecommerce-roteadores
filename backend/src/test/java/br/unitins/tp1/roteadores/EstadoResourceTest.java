package br.unitins.tp1.roteadores;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import br.unitins.tp1.roteadores.dto.endereco.EstadoRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Estado;
import br.unitins.tp1.roteadores.resource.EstadoResource;
import br.unitins.tp1.roteadores.service.endereco.EstadoService;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.MediaType;

@QuarkusTest
public class EstadoResourceTest {
    
    @Inject
    public EstadoService estadoService;

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindById() {
        given()
            .when().get("/estados/1")
            .then().statusCode(200)
            .body("id", is(1));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindByNome() {
        given()
            .when().pathParam("nome", "Tocantins")
            .get("/estados/search/{nome}")
            .then().statusCode(200)
            .body("nome", hasItem(is("Tocantins")));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindAll() {
        given()
            .when().get("/estados")
            .then().statusCode(200);
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testCreate() {
        EstadoRequestDTO dto = new EstadoRequestDTO("Acre", "AC");

        given()
            .contentType(MediaType.APPLICATION_JSON)
            .body(dto)
            .when()
                .post("/estados")
            .then()
                .statusCode(201)
                .body("nome", is("Acre"),
                      "sigla", is("AC"));
                
        // removendo o dado que foi inserido
        estadoService.delete(estadoService.findByNome("Acre").getFirst().getId());
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testUpdate() {
        EstadoRequestDTO dto = new EstadoRequestDTO("Acre", "AC");

        long id = estadoService.create(dto).getId();

        EstadoRequestDTO novoDto = new EstadoRequestDTO("Rondonia", "RO");

        given()
            .contentType(ContentType.JSON)
            .body(novoDto)
            .when()
                .put("/estados/" + id)
            .then()
                .statusCode(204);
        
        Estado estado = estadoService.findById(id);

        assertEquals(estado.getNome(), "Rondonia");
        assertEquals(estado.getSigla(), "RO");

        estadoService.delete(id);

    }  

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testDelete() {
        EstadoRequestDTO dto = new EstadoRequestDTO("Acre", "AC");

        Long id = estadoService.create(dto).getId();

        given()
            .when()
                .delete("/estados/" + id)
            .then().statusCode(204);

        assertThrows(ValidationException.class, () -> estadoService.findById(id));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    @TestHTTPEndpoint(EstadoResource.class)
    public void testFindAll2(){
        given()
            .when().get()
            .then()
                .statusCode(200)
                .body("$.size()", greaterThanOrEqualTo(1));
    }
    
}
