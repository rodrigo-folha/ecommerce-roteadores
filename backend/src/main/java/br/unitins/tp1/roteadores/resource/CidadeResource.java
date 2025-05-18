package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.PaginacaoResponseDTO;
import br.unitins.tp1.roteadores.dto.endereco.CidadeRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.CidadeResponseDTO;
import br.unitins.tp1.roteadores.service.endereco.CidadeService;
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

@Path("/cidades")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CidadeResource {

    private static final Logger LOG = Logger.getLogger(CidadeResource.class);

    @Inject
    public CidadeService cidadeService;

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(CidadeResponseDTO.valueOf(cidadeService.findById(id))).build();
    }

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/search/nome/{nome}")
    public Response findByNome(@PathParam("nome") String nome,
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = cidadeService.count(nome);
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);
        PaginacaoResponseDTO<CidadeResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, cidadeService.findByNome(nome, page, pageSize).stream().map(CidadeResponseDTO::valueOf).toList());
        
        return Response.ok(paginacao).build();
    }

    @GET
    // @RolesAllowed({"Adm", "User"})
    public Response findAll(
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {

        Long count = cidadeService.count();
        LOG.info("Execucao do metodo findAll");
        PaginacaoResponseDTO<CidadeResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, cidadeService.findAll(page, pageSize).stream().map(CidadeResponseDTO::valueOf).toList());
        
        return Response.ok(paginacao).build();
    }

    @GET
    @Path("/count")
    public Response count() {
        LOG.info("Execucao do metodo count");
        return Response.ok(cidadeService.count()).build();
    }

    @POST
    // @RolesAllowed({"Adm"})
    public Response create(@Valid CidadeRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
                .entity(CidadeResponseDTO.valueOf(cidadeService.create(dto)))
                .build();
    }

    @PUT
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid CidadeRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id da cidade: " + id);
        cidadeService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id da cidade: " + id);
        cidadeService.delete(id);
        return Response.noContent().build();
    }
}
