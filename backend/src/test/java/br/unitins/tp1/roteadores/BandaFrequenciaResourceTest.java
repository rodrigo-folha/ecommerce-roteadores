package br.unitins.tp1.roteadores;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

import br.unitins.tp1.roteadores.dto.roteador.BandaFrequenciaRequestDTO;
import br.unitins.tp1.roteadores.model.roteador.BandaFrequencia;
import br.unitins.tp1.roteadores.resource.BandaFrequenciaResource;
import br.unitins.tp1.roteadores.service.roteador.BandaFrequenciaService;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;

@QuarkusTest
public class BandaFrequenciaResourceTest {
    
    @Inject
    public BandaFrequenciaService bandaFrequenciaService;

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindById() {
        given()
            .when().get("/bandafrequencias/1")
            .then().statusCode(200)
            .body("id", is(1));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindByNome() {
        given()
            .when().pathParam("nome", "Quad-Band")
            .get("/bandafrequencias/search/{nome}")
            .then().statusCode(200)
            .body("nome", hasItem(is("Quad-Band")));
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    public void testFindAll() {
        given()
            .when().get("/bandafrequencias")
            .then().statusCode(200);
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testCreate() {
        BandaFrequenciaRequestDTO dto = new BandaFrequenciaRequestDTO("Five-Band");

        given()
            .contentType(ContentType.JSON)
            .body(dto)
            .when()
                .post("/bandafrequencias")
            .then()
                .statusCode(201)
                .body("nome", is("Five-Band"));
                
        // removendo o dado que foi inserido
        bandaFrequenciaService.delete(bandaFrequenciaService.findByNome("Five-Band").getFirst().getId());
    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testUpdate() {
        BandaFrequenciaRequestDTO dto = new BandaFrequenciaRequestDTO("Six-Band");
        long id = bandaFrequenciaService.create(dto).getId();

        BandaFrequenciaRequestDTO novoDto = new BandaFrequenciaRequestDTO("Sixth-Band");

        given()
            .contentType(ContentType.JSON)
            .body(novoDto)
            .when()
                .put("/bandafrequencias/" + id)
            .then()
                .statusCode(204);
        
        BandaFrequencia bf = bandaFrequenciaService.findById(id);

        assertEquals(bf.getNome(), "Sixth-Band");

        bandaFrequenciaService.delete(id);

    }  

    @Test
    @TestSecurity(user = "test", roles = {"Adm"})
    public void testDelete() {
        BandaFrequenciaRequestDTO dto = new BandaFrequenciaRequestDTO("Seven-Band");
        Long id = bandaFrequenciaService.create(dto).getId();

        given()
            .when()
                .delete("/bandafrequencias/" + id)
            .then().statusCode(204);

        BandaFrequencia bf = bandaFrequenciaService.findById(id);
        assertNull(bf);

    }

    @Test
    @TestSecurity(user = "test", roles = {"Adm", "User"})
    @TestHTTPEndpoint(BandaFrequenciaResource.class)
    public void testFindAll2(){
        given()
            .when().get()
            .then()
                .statusCode(200)
                .body("$.size()", greaterThanOrEqualTo(1));
    }

}
