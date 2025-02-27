package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.roteador.BandaFrequenciaRequestDTO;
import br.unitins.tp1.roteadores.dto.roteador.BandaFrequenciaResponseDTO;
import br.unitins.tp1.roteadores.service.roteador.BandaFrequenciaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/bandafrequencias")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BandaFrequenciaResource {

    private static final Logger LOG = Logger.getLogger(BandaFrequenciaResource.class);
    
    @Inject
    public BandaFrequenciaService bandaFrequenciaService;

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(bandaFrequenciaService
            .findById(id))
            .build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/search/{nome}")
    public Response findByNome(@PathParam("nome") String nome) {
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);
        return Response.ok(bandaFrequenciaService
            .findByNome(nome)
            .stream()
            .map(BandaFrequenciaResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    public Response findAll() {
        LOG.info("Execucao do metodo findAll");
        return Response.ok(bandaFrequenciaService
            .findAll()
            .stream()
            .map(BandaFrequenciaResponseDTO::valueOf)
            .toList()).build();
    }

    @POST
    @RolesAllowed({"Adm"})
    public Response create(@Valid BandaFrequenciaRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
            .entity(BandaFrequenciaResponseDTO.valueOf(bandaFrequenciaService.create(dto)))
            .build();
    }

    @PUT
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid BandaFrequenciaRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id da Banda Frequencia: " + id);
        bandaFrequenciaService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id da Banda Frequencia: " + id);
        bandaFrequenciaService.delete(id);
        return Response.noContent().build();
    }
    
}
