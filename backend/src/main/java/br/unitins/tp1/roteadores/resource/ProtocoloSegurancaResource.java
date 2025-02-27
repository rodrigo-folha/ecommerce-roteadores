package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.roteador.ProtocoloSegurancaRequestDTO;
import br.unitins.tp1.roteadores.dto.roteador.ProtocoloSegurancaResponseDTO;
import br.unitins.tp1.roteadores.service.roteador.ProtocoloSegurancaService;
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

@Path("/protocolosseguranca")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProtocoloSegurancaResource {

    private static final Logger LOG = Logger.getLogger(ProtocoloSegurancaResource.class);

    @Inject
    public ProtocoloSegurancaService protocoloSegurancaService;

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(protocoloSegurancaService.findById(id)).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/search/{nome}")
    public Response findByNome(@PathParam("nome") String nome) {
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);
        return Response.ok(protocoloSegurancaService.findByNome(nome)
            .stream()
            .map(ProtocoloSegurancaResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    public Response findAll() {
        LOG.info("Execucao do metodo findAll");
        return Response.ok(protocoloSegurancaService.findAll()
            .stream()
            .map(ProtocoloSegurancaResponseDTO::valueOf)
            .toList()).build();
    }

    @POST
    @RolesAllowed({"Adm"})
    public Response create(@Valid ProtocoloSegurancaRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
            .entity(protocoloSegurancaService.create(dto))
            .build();
    }

    @PUT
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid ProtocoloSegurancaRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id do Protocolo de Seguranca: " + id);
        protocoloSegurancaService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do Protocolo de Seguranca: " + id);
        protocoloSegurancaService.delete(id);
        return Response.noContent().build();
    }
}
