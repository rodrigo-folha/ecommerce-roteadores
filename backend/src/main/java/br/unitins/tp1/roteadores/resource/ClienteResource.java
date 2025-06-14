package br.unitins.tp1.roteadores.resource;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.PaginacaoResponseDTO;
import br.unitins.tp1.roteadores.dto.usuario.ClienteRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.ClienteResponseDTO;
import br.unitins.tp1.roteadores.service.file.ClienteFileServiceImpl;
import br.unitins.tp1.roteadores.service.usuario.ClienteService;
import br.unitins.tp1.roteadores.service.usuario.UsuarioService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteResource {

    private static final Logger LOG = Logger.getLogger(ClienteResource.class);

    @Inject
    public ClienteService clienteService;

    @Inject 
    public UsuarioService usuarioService;

    @Inject
    public JsonWebToken jsonWebToken;

    @Inject
    public ClienteFileServiceImpl clienteFileService;

    @GET
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(ClienteResponseDTO.valueOf(clienteService.findById(id))).build();
    }

    @GET
    // @RolesAllowed({"Adm"})
    @Path("/search/nome/{nome}")
    public Response findByNome(@PathParam("nome") String nome,
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = clienteService.count(nome);
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);
        PaginacaoResponseDTO<ClienteResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, clienteService.findByNome(nome, page, pageSize).stream().map(ClienteResponseDTO::valueOf).toList());
        return Response.ok(paginacao).build();
    }

    @GET
    // @RolesAllowed({"Adm"})
    @Path("/search/email/{email}")
    public Response findByEmail(@PathParam("email") String email) {
        LOG.info("Execucao do metodo findByEmail. Email: " + email);
        return Response.ok(clienteService.findByEmail(email)
                .stream()
                .map(ClienteResponseDTO::valueOf)
                .toList()).build();
    }

    @GET
    @Path("/search/usuario/{email}")
    public Response findByUsuario(@PathParam("email") String email) {
        LOG.info("Execucao do metodo findByUsuario. Usuario: " + email);
        return Response.ok(ClienteResponseDTO.valueOf(
                clienteService.findByUsuario(email)))
                .build();
    }

    @GET
    // @RolesAllowed({"Adm"})
    @Path("/search/cpf/{cpf}")
    public Response findByCpf(@PathParam("cpf") String cpf) {
        LOG.info("Execucao do metodo findByCpf. Cpf: " + cpf);
        return Response.ok(clienteService.findByNome(usuarioService.findByCpf(cpf).getNome())
                .stream()
                .map(ClienteResponseDTO::valueOf)
                .toList()).build();
    }

    @GET
    // @RolesAllowed({"Adm"})
    public Response findAll(
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("pageSize") @DefaultValue("100") int pageSize
    ) {
        Long count = clienteService.count();
        LOG.info("Execucao do metodo findAll");
        PaginacaoResponseDTO<ClienteResponseDTO> paginacao = PaginacaoResponseDTO.valueOf(
            count, page, pageSize, clienteService.findAll(page, pageSize).stream().map(ClienteResponseDTO::valueOf).toList());
        return Response.ok(paginacao).build();
    }

    @GET
    @Path("/count")
    public Response count() {
        LOG.info("Execucao do metodo count");
        return Response.ok(clienteService.count()).build();
    }

    @POST
    public Response create(@Valid ClienteRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
                .entity(ClienteResponseDTO.valueOf(clienteService.create(dto)))
                .build();
    }

    @POST
    // @RolesAllowed({"Adm"})
    @Path("/gerarcliente/{email}")
    public Response gerarClienteFromFuncionario(@PathParam("email") String email) {
        LOG.info("Execucao do metodo gerarClienteFromFuncionario");
        return Response.status(Status.CREATED)
            .entity(ClienteResponseDTO.valueOf(clienteService.gerarClienteFromFuncionario(email)))
            .build();
    }

    @DELETE
    // @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do cliente: " + id);
        clienteService.delete(id);
        return Response.noContent().build();
    }
    
}
