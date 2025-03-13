package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.pedido.CupomDescontoRequestDTO;
import br.unitins.tp1.roteadores.dto.pedido.CupomDescontoResponseDTO;
import br.unitins.tp1.roteadores.service.pedido.CupomDescontoService;
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

@Path("/cuponsdesconto")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CupomDescontoResource {

    private static final Logger LOG = Logger.getLogger(CupomDescontoResource.class);
    
    @Inject
    public CupomDescontoService cupomdescontoService;

    @GET
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(cupomdescontoService.findById(id)).build();
    }

    @GET
    // @RolesAllowed({"Adm"})
    @Path("/search/{codigo}")
    public Response findByCodigo(@PathParam("codigo") String codigo) {
        LOG.info("Execucao do metodo findByCodigo. Codigo: " + codigo);
        return Response.ok(cupomdescontoService.findByCodigo(codigo)).build();
    }

    @GET
    // @RolesAllowed({"Adm"})
    public Response findAll() {
        LOG.info("Execucao do metodo findAll");
        return Response.ok(cupomdescontoService.findAll()
            .stream()
            .map(CupomDescontoResponseDTO::valueOf)
            .toList()).build();
    }

    @POST
    // @RolesAllowed({"Adm"})
    public Response create(@Valid CupomDescontoRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
            .entity(cupomdescontoService.create(dto))
            .build();
    }

    @PUT
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid CupomDescontoRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id do Cupom de desconto: " + id);
        cupomdescontoService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do Cupom de desconto: " + id);
        cupomdescontoService.delete(id);
        return Response.noContent().build();
    }
}
