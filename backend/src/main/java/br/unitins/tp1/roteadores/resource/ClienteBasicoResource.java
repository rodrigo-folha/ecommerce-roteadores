package br.unitins.tp1.roteadores.resource;

import java.io.IOException;
import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import br.unitins.tp1.roteadores.dto.TelefoneRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.ClienteBasicoRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.ClienteBasicoResponseDTO;
import br.unitins.tp1.roteadores.dto.usuario.ClienteResponseDTO;
import br.unitins.tp1.roteadores.dto.usuario.ClienteUpdateRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.ListaDesejoResponseDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.CpfPatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.DataNascimentoPatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.EmailPatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.NomePatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.SenhaPatchRequestDTO;
import br.unitins.tp1.roteadores.form.ImageForm;
import br.unitins.tp1.roteadores.service.file.ClienteFileServiceImpl;
import br.unitins.tp1.roteadores.service.usuario.ClienteService;
import br.unitins.tp1.roteadores.service.usuario.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;
import jakarta.ws.rs.core.Response.Status;

@Path("/clientesbasicos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteBasicoResource {

    private static final Logger LOG = Logger.getLogger(ClienteResource.class);

    @Inject
    public ClienteService clienteService;

    @Inject 
    public UsuarioService usuarioService;

    @Inject
    public JsonWebToken jsonWebToken;

    @Inject
    public ClienteFileServiceImpl clienteFileService;

    @POST
    @Path("/cadastrar-cliente")
    public Response create(@Valid ClienteBasicoRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
                .entity(ClienteBasicoResponseDTO.valueOf(clienteService.createClienteBasico(dto)))
                .build();
    }

    @GET
    @RolesAllowed({"User"})
    public Response getMinhasInformacoes() {
        LOG.info("Execucao do metodo getMinhasInformacoes");
        String email = jsonWebToken.getSubject();
        return Response.ok(ClienteResponseDTO.valueOf(clienteService.getMinhasInformacoess(email))).build();
    }

    @PUT
    @RolesAllowed({"User"})
    @Path("/update")
    public Response update(@Valid ClienteUpdateRequestDTO cliente) {
        LOG.info("Execucao do metodo update");
        String email = jsonWebToken.getSubject();

        clienteService.update(email, cliente);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/update/senha")
    public Response updateSenha(@Valid SenhaPatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateSenha");
        String email = jsonWebToken.getSubject();

        clienteService.updateSenha(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/update/nome")
    public Response updateNome(@Valid NomePatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateNome");
        String email = jsonWebToken.getSubject();

        clienteService.updateNome(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/update/cpf")
    public Response updateCpf(@Valid CpfPatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateCpf");
        String email = jsonWebToken.getSubject();

        clienteService.updateCpf(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/update/datanascimento")
    public Response updateDataNascimento(@Valid DataNascimentoPatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateDataNascimento");
        String email = jsonWebToken.getSubject();

        clienteService.updateDataNascimento(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/update/email")
    public Response updateEmail(@Valid EmailPatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateEmail");
        String email = jsonWebToken.getSubject();

        clienteService.updateEmail(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/update/enderecos/{idEndereco}")
    public Response updateEnderecoEspecifico(@PathParam("idEndereco") Long idEndereco, @Valid EnderecoRequestDTO endereco) {
        LOG.info("Execucao do metodo updateEnderecoEspecifico. Id do endereco: " + idEndereco);
        String email = jsonWebToken.getSubject();
        clienteService.updateEnderecoEspecifico(email, idEndereco, endereco);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/update/enderecos")
    public Response updateEndereco(@Valid List<EnderecoRequestDTO> endereco) {
        LOG.info("Execucao do metodo updateEndereco.");
        String email = jsonWebToken.getSubject();
        clienteService.updateEndereco(email, endereco);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/update/telefones/{idTelefone}")
    public Response updateTelefoneEspecifico(@PathParam("idTelefone") Long idTelefone, @Valid TelefoneRequestDTO telefone) {
        LOG.info("Execucao do metodo updateTelefoneEspecifico. Id do telefone: " + idTelefone);
        String email = jsonWebToken.getSubject();
        clienteService.updateTelefoneEspecifico(email, idTelefone, telefone);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/update/telefones")
    public Response updateTelefone(@Valid List<TelefoneRequestDTO> telefone) {
        LOG.info("Execucao do metodo updateTelefone.");
        String email = jsonWebToken.getSubject();
        clienteService.updateTelefone(email, telefone);
        return Response.noContent().build();
    }

    @GET
    @RolesAllowed({"User"})
    @Path("/desejos")
    public Response getListaDesejos() {
        LOG.info("Execucao do metodo getListaDesejos");
        String email = jsonWebToken.getSubject();
        return Response.ok(clienteService.getListaDesejos(email)
            .stream()
            .map(ListaDesejoResponseDTO::valueOf)
            .toList()).build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/desejos/adicionar/{idProduto}")
    public Response adicionarProdutoListaDesejo(@PathParam("idProduto") Long idProduto) {
        String email = jsonWebToken.getSubject();
        LOG.info("Execucao do metodo adicionarProdutoListaDesejo");
        clienteService.adicionarProdutoListaDesejo(email, idProduto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/desejos/remover/{idProduto}")
    public Response removerProdutoListaDesejo(@PathParam("idProduto") Long idProduto) {
        String email = jsonWebToken.getSubject();
        LOG.info("Execucao do metodo removerProdutoListaDesejo");
        clienteService.removerProdutoListaDesejo(email, idProduto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"User"})
    @Path("/imagem/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadImage(@MultipartForm ImageForm form) {
        LOG.info("Execucao do metodo uploadImage.");
        String email = jsonWebToken.getSubject();
        try {
            String nomeImagem = clienteFileService.save(form.getNomeImagem(), form.getImagem());

            clienteService.updateNomeImagem(email, nomeImagem);
        } catch (IOException e) {
            Response.status(500).build();
        }
        return Response.noContent().build();
    }

    @GET
    @RolesAllowed({"User"})
    @Path("/imagem/download/{nomeImagem}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadImage(@PathParam("nomeImagem") String nomeImagem) {
        LOG.info("Execucao do metodo DownloadImage.");
        ResponseBuilder response = Response.ok(clienteFileService.find(nomeImagem));
        response.header("Content-Disposition", "attachment; filename=" + nomeImagem);
        return response.build();
    }
    
}
