package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.pedido.LoteRequestDTO;
import br.unitins.tp1.roteadores.dto.pedido.LoteResponseDTO;
import br.unitins.tp1.roteadores.service.pedido.LoteService;
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

@Path("/lotes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LoteResource {

    private static final Logger LOG = Logger.getLogger(LoteResource.class);
    
    @Inject
    public LoteService loteService;

    @GET
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(LoteResponseDTO.valueOf(loteService.findById(id))).build();
    }

    @GET
    @RolesAllowed({"Adm"})
    @Path("/search/codigo/{codigo}")
    public Response findByCodigo(@PathParam("codigo") String codigo) {
        LOG.info("Execucao do metodo findByCodigo. Codigo: " + codigo);
        return Response.ok(LoteResponseDTO.valueOf(loteService.findByCodigo(codigo))).build();
    }

    @GET
    @RolesAllowed({"Adm"})
    @Path("/search/roteador/qtdetotal/{idRoteador}")
    public Response findByIdRoteadorQtdeTotal(@PathParam("idRoteador") Long idRoteador) {
        LOG.info("Execucao do metodo findByRoteadorQtdeTotal. Id do Roteador: " + idRoteador);
        return Response.ok(loteService.findByIdRoteadorQtdeTotal(idRoteador)
                .stream()
                .map(LoteResponseDTO::valueOf)
                .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm"})
    public Response findAll() {
        LOG.info("Execucao do metodo findAll");
        return Response.ok(loteService.findAll()
            .stream()
            .map(LoteResponseDTO::valueOf)
            .toList()).build();
    }

    @POST
    @RolesAllowed({"Adm"})
    public Response create(@Valid LoteRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
            .entity(LoteResponseDTO.valueOf(loteService.create(dto)))
            .build();
    }

    @PUT
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid LoteRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id do lote: " + id);
        loteService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do lote: " + id);
        loteService.delete(id);
        return Response.noContent().build();
    }


}
