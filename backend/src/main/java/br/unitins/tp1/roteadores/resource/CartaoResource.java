package br.unitins.tp1.roteadores.resource;

import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.pagamento.CartaoRequestDTO;
import br.unitins.tp1.roteadores.dto.pagamento.CartaoResponseDTO;
import br.unitins.tp1.roteadores.model.pagamento.Cartao;
import br.unitins.tp1.roteadores.service.CartaoService;
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

@Path("/cartoes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CartaoResource {

    private static final Logger LOG = Logger.getLogger(CartaoResource.class);
    
    @Inject
    public CartaoService cartaoService;

    @Inject
    public JsonWebToken jsonWebToken;

    @GET
    @RolesAllowed("User")
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        String email = jsonWebToken.getSubject();
        return Response.ok(CartaoResponseDTO.valueOf(cartaoService.findById(email, id))).build();
    }

    @GET
    @RolesAllowed("User")
    public Response findByCliente() {
        LOG.info("Execucao do metodo findByCliente");
        String email = jsonWebToken.getSubject();
        List<Cartao> cartoes = cartaoService.findByCliente(email);
        return Response.ok(cartoes.stream().map(CartaoResponseDTO::valueOf).toList()).build();
    }

    @POST
    @RolesAllowed("User")
    public Response create(@Valid CartaoRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        String email = jsonWebToken.getSubject();
        return Response.status(Status.CREATED)
            .entity(CartaoResponseDTO.valueOf(cartaoService.create(email, dto)))
            .build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("User")
    public Response update(@PathParam("id") Long id, @Valid CartaoRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id: " + id);
        String email = jsonWebToken.getSubject();
        cartaoService.update(email, id, dto);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("User")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id: " + id);
        String email = jsonWebToken.getSubject();
        cartaoService.delete(email, id);
        return Response.noContent().build();
    }
}
