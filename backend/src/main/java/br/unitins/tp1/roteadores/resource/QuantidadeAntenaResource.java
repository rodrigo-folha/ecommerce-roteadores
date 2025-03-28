package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.PaginacaoResponseDTO;
import br.unitins.tp1.roteadores.dto.roteador.QuantidadeAntenaRequestDTO;
import br.unitins.tp1.roteadores.dto.roteador.QuantidadeAntenaResponseDTO;
import br.unitins.tp1.roteadores.service.roteador.QuantidadeAntenaService;
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

@Path("quantidadeantenas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuantidadeAntenaResource {

    private static final Logger LOG = Logger.getLogger(QuantidadeAntenaResource.class);

    @Inject
    public QuantidadeAntenaService quantidadeAntenaService;

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(quantidadeAntenaService.findById(id)).build();
    }

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/search/{quantidade}")
    public Response findByQuantidade(@PathParam("quantidade") Integer quantidade,
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = quantidadeAntenaService.count(quantidade);
        LOG.info("Execucao do metodo findByQuantidade. Quantidade de antenas: " + quantidade);
        PaginacaoResponseDTO<QuantidadeAntenaResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, quantidadeAntenaService.findByQuantidade(quantidade, page, pageSize).stream().map(QuantidadeAntenaResponseDTO::valueOf).toList());
        return Response.ok(paginacao).build();
    }

    @GET
    // @RolesAllowed({"Adm", "User"})
    public Response findAll(
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = quantidadeAntenaService.count();
        LOG.info("Execucao do metodo findAll");
        PaginacaoResponseDTO<QuantidadeAntenaResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, quantidadeAntenaService.findAll(page, pageSize).stream().map(QuantidadeAntenaResponseDTO::valueOf).toList());
        return Response.ok(paginacao).build();
    }

    @POST
    // @RolesAllowed({"Adm"})
    public Response create(@Valid QuantidadeAntenaRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
            .entity(quantidadeAntenaService.create(dto))
            .build();
    }

    @PUT
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid QuantidadeAntenaRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id da quantidade de antenas: " + id);
        quantidadeAntenaService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id da quantidade de antenas: " + id);
        quantidadeAntenaService.delete(id);
        return Response.noContent().build();
    }

    @GET
    @Path("quantidade/{quantidade}/count")
    public Response countQuantidade(@PathParam("quantidade") Integer quantidade) {
        LOG.info("Execucao do metodo countQuantidade. Quantidade:  " + quantidade);
        return Response.ok(quantidadeAntenaService.count(quantidade)).build();
    }

    @GET
    @Path("/count")
    public Response count() {
        LOG.info("Execucao do metodo count");
        return Response.ok(quantidadeAntenaService.count()).build();
    }
}
