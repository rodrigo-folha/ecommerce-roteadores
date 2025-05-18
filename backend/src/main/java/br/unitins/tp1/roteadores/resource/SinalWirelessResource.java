package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.PaginacaoResponseDTO;
import br.unitins.tp1.roteadores.dto.roteador.SinalWirelessRequestDTO;
import br.unitins.tp1.roteadores.dto.roteador.SinalWirelessResponseDTO;
import br.unitins.tp1.roteadores.service.roteador.SinalWirelessService;
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

@Path("/sinalwireless")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SinalWirelessResource {

    private static final Logger LOG = Logger.getLogger(SinalWirelessResource.class);
    
    @Inject
    public SinalWirelessService sinalWirelessService;

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(sinalWirelessService.findById(id)).build();
    }

    @GET
    // @RolesAllowed({"Adm", "User"})
    @Path("/search/nome/{nome}")
    public Response findByNome(@PathParam("nome") String nome,
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = sinalWirelessService.count(nome);
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);
        PaginacaoResponseDTO<SinalWirelessResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, sinalWirelessService.findByNome(nome, page, pageSize).stream().map(SinalWirelessResponseDTO::valueOf).toList());
        return Response.ok(paginacao).build();
    }

    @GET
    // @RolesAllowed({"Adm", "User"})
    public Response findAll(
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = sinalWirelessService.count();
        LOG.info("Execucao do metodo findAll");
        PaginacaoResponseDTO<SinalWirelessResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, sinalWirelessService.findAll(page, pageSize).stream().map(SinalWirelessResponseDTO::valueOf).toList());
        return Response.ok(paginacao).build();
    }

    @POST
    // @RolesAllowed({"Adm"})
    public Response create(@Valid SinalWirelessRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
            .entity(sinalWirelessService.create(dto))
            .build();
    }

    @PUT
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid SinalWirelessRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id do Sinal Wireless: " + id);
        sinalWirelessService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do Sinal Wireless: " + id);
        sinalWirelessService.delete(id);
        return Response.noContent().build();
    }

    @GET
    @Path("nome/{nome}/count")
    public Response countNome(@PathParam("nome") String nome) {
        LOG.info("Execucao do metodo countNome. Nome:  " + nome);
        return Response.ok(sinalWirelessService.count(nome)).build();
    }

    @GET
    @Path("/count")
    public Response count() {
        LOG.info("Execucao do metodo count");
        return Response.ok(sinalWirelessService.count()).build();
    }

}
