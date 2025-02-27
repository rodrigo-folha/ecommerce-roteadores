package br.unitins.tp1.roteadores.resource;

import java.io.IOException;
import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import br.unitins.tp1.roteadores.dto.TelefoneRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.FuncionarioRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.FuncionarioResponseDTO;
import br.unitins.tp1.roteadores.dto.usuario.FuncionarioUpdateRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.CpfPatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.DataNascimentoPatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.EmailPatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.NomePatchRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.patches.SenhaPatchRequestDTO;
import br.unitins.tp1.roteadores.form.ImageForm;
import br.unitins.tp1.roteadores.service.file.FuncionarioFileServiceImpl;
import br.unitins.tp1.roteadores.service.usuario.FuncionarioService;
import br.unitins.tp1.roteadores.service.usuario.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
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

@Path("/funcionarios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FuncionarioResource {

    private static final Logger LOG = Logger.getLogger(FuncionarioResource.class);

    @Inject
    public FuncionarioService funcionarioService;

    @Inject
    public UsuarioService usuarioService;

    @Inject
    public JsonWebToken jsonWebToken;

    @Inject
    public FuncionarioFileServiceImpl funcionarioFileService;

    @GET
    @RolesAllowed({ "Adm" })
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(FuncionarioResponseDTO.valueOf(funcionarioService.findById(id))).build();
    }

    @GET
    @RolesAllowed({ "Adm" })
    @Path("/search/{nome}")
    public Response findByNome(@PathParam("nome") String nome) {
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);
        return Response.ok(funcionarioService.findByNome(nome)
                .stream()
                .map(FuncionarioResponseDTO::valueOf)
                .toList()).build();
    }

    @GET
    @RolesAllowed({ "Adm" })
    @Path("/search/email/{email}")
    public Response findByEmail(@PathParam("email") String email) {
        LOG.info("Execucao do metodo findByEmail. Email: " + email);
        return Response.ok(funcionarioService.findByEmail(email)
                .stream()
                .map(FuncionarioResponseDTO::valueOf)
                .toList()).build();
    }

    @GET
    @RolesAllowed({ "Adm" })
    public Response findAll() {
        LOG.info("Execucao do metodo findAll");
        return Response.ok(funcionarioService.findAll()
                .stream()
                .map(o -> FuncionarioResponseDTO.valueOf(o))
                .toList()).build();
    }

    @POST
    @RolesAllowed({ "Adm" })
    @Path("/gerarfuncionario/{email}")
    public Response gerarFuncionarioFromCliente(@PathParam("email") String email) {
        LOG.info("Execucao do metodo gerarClienteFromFuncionario");
        return Response.status(Status.CREATED)
                .entity(FuncionarioResponseDTO.valueOf(funcionarioService.gerarFuncionarioFromCliente(email)))
                .build();
    }

    @POST
    @RolesAllowed({ "Adm" })
    public Response create(@Valid FuncionarioRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
                .entity(FuncionarioResponseDTO.valueOf(funcionarioService.create(dto)))
                .build();
    }

    @PUT
    @RolesAllowed({ "Adm" })
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid FuncionarioUpdateRequestDTO funcionario) {
        LOG.info("Execucao do metodo update. Id do Funcionario: " + id);
        funcionarioService.update(id, funcionario);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/update/senha")
    public Response updateSenha(@Valid SenhaPatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateSenha");
        String email = jsonWebToken.getSubject();

        funcionarioService.updateSenha(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/update/nome")
    public Response updateNome(@Valid NomePatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateNome");
        String email = jsonWebToken.getSubject();

        funcionarioService.updateNome(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/update/cpf")
    public Response updateCpf(@Valid CpfPatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateCpf");
        String email = jsonWebToken.getSubject();

        funcionarioService.updateCpf(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/update/datanascimento")
    public Response updateDataNascimento(@Valid DataNascimentoPatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateDataNascimento");
        String email = jsonWebToken.getSubject();

        funcionarioService.updateDataNascimento(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/update/email")
    public Response updateEmail(@Valid EmailPatchRequestDTO dto) {
        LOG.info("Execucao do metodo updateEmail");
        String email = jsonWebToken.getSubject();

        funcionarioService.updateEmail(email, dto);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/{id}/enderecos/{idEndereco}")
    public Response updateEnderecoEspecifico(@PathParam("id") Long id, @PathParam("idEndereco") Long idEndereco,
            @Valid EnderecoRequestDTO endereco) {
        LOG.info("Execucao do metodo updateEnderecoEspecifico. Id do funcionario: " + id + ", id do endereco: "
                + idEndereco);
        funcionarioService.updateEnderecoEspecifico(id, idEndereco, endereco);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/{id}/enderecos")
    public Response updateEndereco(@PathParam("id") Long id, @Valid List<EnderecoRequestDTO> endereco) {
        LOG.info("Execucao do metodo updateEndereco. Id do funcionario: " + id);
        funcionarioService.updateEndereco(id, endereco);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/{id}/telefones/{idTelefone}")
    public Response updateTelefoneEspecifico(@PathParam("id") Long id, @PathParam("idTelefone") Long idTelefone,
            @Valid TelefoneRequestDTO telefone) {
        LOG.info("Execucao do metodo updateTelefoneEspecifico. Id do funcionario: " + id + ", id do telefone: "
                + idTelefone);
        funcionarioService.updateTelefoneEspecifico(id, idTelefone, telefone);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/{id}/telefones")
    public Response updateTelefone(@PathParam("id") Long id, @Valid List<TelefoneRequestDTO> telefone) {
        LOG.info("Execucao do metodo updateTelefone. Id do funcionario: " + id);
        funcionarioService.updateTelefone(id, telefone);
        return Response.noContent().build();
    }

    @DELETE
    @RolesAllowed({ "Adm" })
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do funcionario: " + id);
        funcionarioService.delete(id);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({ "Adm" })
    @Path("/{id}/upload/imagem")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadImage(@PathParam("id") Long id, @MultipartForm ImageForm form) {
        LOG.info("Execucao do metodo uploadImage. Id do funcionario: " + id);

        try {
            String nomeImagem = funcionarioFileService.save(form.getNomeImagem(), form.getImagem());

            funcionarioService.updateNomeImagem(id, nomeImagem);
        } catch (IOException e) {
            Response.status(500).build();
        }
        return Response.noContent().build();
    }

    @GET
    @RolesAllowed({ "Adm" })
    @Path("/download/imagem/{nomeImagem}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadImagem(@PathParam("nomeImagem") String nomeImagem) {
        LOG.info("Execucao do metodo downloadImage.");
        ResponseBuilder response = Response.ok(funcionarioFileService.find(nomeImagem));
        response.header("Content-Disposition", "attachment; filename=" + nomeImagem);
        return response.build();
    }
}
