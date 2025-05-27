package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.PaginacaoResponseDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoResponseDTO;
import br.unitins.tp1.roteadores.service.endereco.CidadeService;
import br.unitins.tp1.roteadores.service.endereco.EnderecoService;
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

@Path("/enderecos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnderecoResource {

    private static final Logger LOG = Logger.getLogger(EnderecoResource.class);

    @Inject
    public CidadeService cidadeService;

    @Inject
    public EnderecoService enderecoService;

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(EnderecoResponseDTO.valueOf(enderecoService.findById(id))).build();
    }

    @GET
    // @RolesAllowed({"Adm", "User"})
    public Response findAll(
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {

        Long count = enderecoService.count();
        LOG.info("Execucao do metodo findAll");
        PaginacaoResponseDTO<EnderecoResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, enderecoService.findAll(page, pageSize).stream().map(EnderecoResponseDTO::valueOf).toList());
        
        return Response.ok(paginacao).build();
    }

    @GET
    @Path("/count")
    public Response count() {
        LOG.info("Execucao do metodo count");
        return Response.ok(enderecoService.count()).build();
    }

    @POST
    // @RolesAllowed({"Adm"})
    public Response create(@Valid EnderecoRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
                .entity(EnderecoResponseDTO.valueOf(enderecoService.create(dto)))
                .build();
    }

    @PUT
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid EnderecoRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id do endereco: " + id);
        enderecoService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do endereco: " + id);
        enderecoService.delete(id);
        return Response.noContent().build();
    }
}
