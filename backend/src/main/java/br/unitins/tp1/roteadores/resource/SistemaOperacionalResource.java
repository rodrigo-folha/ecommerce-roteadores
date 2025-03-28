package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.PaginacaoResponseDTO;
import br.unitins.tp1.roteadores.dto.roteador.SistemaOperacionalRequestDTO;
import br.unitins.tp1.roteadores.dto.roteador.SistemaOperacionalResponseDTO;
import br.unitins.tp1.roteadores.service.roteador.SistemaOperacionalService;
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

@Path("/sistemasoperacionais")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SistemaOperacionalResource {

    private static final Logger LOG = Logger.getLogger(SistemaOperacionalResource.class);
    
    @Inject
    public SistemaOperacionalService sistemaOperacionalService;

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(sistemaOperacionalService.findById(id)).build();
    }
    
    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/search/{nome}")
    public Response findByNome(@PathParam("nome") String nome,
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = sistemaOperacionalService.count(nome);
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);

        PaginacaoResponseDTO<SistemaOperacionalResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, sistemaOperacionalService.findByNome(nome, page, pageSize).stream().map(SistemaOperacionalResponseDTO::valueOf).toList());

        return Response.ok(paginacao).build();
    }
    
    @GET
    // @RolesAllowed({"Adm", "User"})
    public Response findAll(
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = sistemaOperacionalService.count();
        LOG.info("Execucao do metodo findAll");
        PaginacaoResponseDTO<SistemaOperacionalResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, sistemaOperacionalService.findAll(page, pageSize).stream().map(SistemaOperacionalResponseDTO::valueOf).toList());

        return Response.ok(paginacao).build();
    }

    @POST
    // @RolesAllowed({"Adm"})
    public Response create(@Valid SistemaOperacionalRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
            .entity(sistemaOperacionalService.create(dto))
            .build();
    }

    @PUT
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid SistemaOperacionalRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id do Sistema Operacional: " + id);
        sistemaOperacionalService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do Sistema Operacional: " + id);
        sistemaOperacionalService.delete(id);
        return Response.noContent().build();
    }

    @GET
    @Path("/count")
    public Response count() {
        LOG.info("Execucao do metodo count");
        return Response.ok(sistemaOperacionalService.count()).build();
    }

    @GET
    @Path("nome/{nome}/count")
    public Response totalPorNome(@PathParam("nome") String nome) {
        return Response.ok(sistemaOperacionalService.count(nome)).build();
    }
}
