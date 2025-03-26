package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.PaginacaoResponseDTO;
import br.unitins.tp1.roteadores.dto.endereco.EstadoRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EstadoResponseDTO;
import br.unitins.tp1.roteadores.service.endereco.EstadoService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/estados")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EstadoResource {

    @Inject
    public EstadoService estadoService;

    private static final Logger LOG = Logger.getLogger(EstadoResource.class);

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(EstadoResponseDTO.valueOf(estadoService.findById(id))).build();
    }

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/search/{nome}")
    public Response findByNome(@PathParam("nome") String nome,
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = estadoService.count(nome);
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);
        PaginacaoResponseDTO<EstadoResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, estadoService.findByNome(nome, page, pageSize).stream().map(EstadoResponseDTO::valueOf).toList());
        
        return Response.ok(paginacao).build();
    }

    @GET
    @Path("/count")
    public long total() {
        return estadoService.count();
    }

    @GET
    @Path("nome/{nome}/count")
    public long totalPorNome(@PathParam("nome") String nome) {
        return estadoService.count(nome);
    }

    @GET
    // @RolesAllowed({"Adm", "User"})
    public Response findAll(
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {

        Long count = estadoService.count();
        LOG.info("Execucao do metodo findAll");
        PaginacaoResponseDTO<EstadoResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, estadoService.findAll(page, pageSize).stream().map(EstadoResponseDTO::valueOf).toList());
        
        return Response.ok(paginacao).build();
    }

    @POST
    // @RolesAllowed({"Adm"})
    public Response create(@Valid EstadoRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
                .entity(EstadoResponseDTO.valueOf(estadoService.create(dto)))
                .build();
    }

    @PUT
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid EstadoRequestDTO estado) {
        LOG.info("Execucao do metodo update. Id do estado: " + id);
        estadoService.update(id, estado);
        return Response.noContent().build();
    }

    @DELETE
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do estado: " + id);
        estadoService.delete(id);
        return Response.noContent().build();
    }
}
