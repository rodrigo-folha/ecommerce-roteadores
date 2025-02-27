package br.unitins.tp1.roteadores.resource;

import java.util.List;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.FornecedorRequestDTO;
import br.unitins.tp1.roteadores.dto.FornecedorResponseDTO;
import br.unitins.tp1.roteadores.dto.TelefoneRequestDTO;
import br.unitins.tp1.roteadores.dto.endereco.EnderecoRequestDTO;
import br.unitins.tp1.roteadores.service.FornecedorService;
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
import jakarta.ws.rs.core.Response.Status;

@Path("/fornecedores")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FornecedorResource {

    private static final Logger LOG = Logger.getLogger(FornecedorResource.class);
    
    @Inject
    public FornecedorService fornecedorService;

    @GET
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(fornecedorService.findById(id)).build();
    }

    @GET
    @RolesAllowed({"Adm"})
    @Path("/search/{nome}")
    public Response findByNome(@PathParam("nome") String nome) {
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);
        return Response.ok(fornecedorService.findByNome(nome)
            .stream()
            .map(FornecedorResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm"})
    @Path("/search/cnpj/{cnpj}")
    public Response findByCnpj(@PathParam("cnpj") String cnpj) {
        LOG.info("Execucao do metodo findByCNPJ. CNPJ: " + cnpj);
        return Response.ok(fornecedorService.findByCnpj(cnpj)
            .stream()
            .map(FornecedorResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm"})
    @Path("/search/email/{email}")
    public Response findByEmail(@PathParam("email") String email) {
        LOG.info("Execucao do metodo findByEmail. Email: " + email);
        return Response.ok(fornecedorService.findByEmail(email)
            .stream()
            .map(FornecedorResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm"})
    public Response findAll() {
        LOG.info("Execucao do metodo findAll");
        return Response.ok(fornecedorService.findAll()
            .stream()
            .map(FornecedorResponseDTO::valueOf)
            .toList()).build();
    }

    @POST
    @RolesAllowed({"Adm"}) 
    public Response create(@Valid FornecedorRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
            .entity(fornecedorService.create(dto))
            .build();
    }

    @PUT
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid FornecedorRequestDTO dto) {
        LOG.info("Execucao do metodo update. Id do Fornecedor: " + id);
        fornecedorService.update(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do Fornecedor: " + id);
        fornecedorService.delete(id);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"Adm"})
    @Path("/{id}/enderecos/{idEndereco}")
    public Response updateEnderecoEspecifico(@PathParam("id") Long id, @PathParam("idEndereco") Long idEndereco, @Valid EnderecoRequestDTO endereco) {
        LOG.info("Execucao do metodo updateEnderecoEspecifico. Id do fornecedor: " + id + ", id do endereco: " + idEndereco);
        fornecedorService.updateEnderecoEspecifico(id, idEndereco, endereco);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"Adm"})
    @Path("/{id}/enderecos")
    public Response updateEndereco(@PathParam("id") Long id, @Valid List<EnderecoRequestDTO> endereco) {
        LOG.info("Execucao do metodo updateEndereco. Id do fornecedor: " + id);
        fornecedorService.updateEndereco(id, endereco);
        return Response.noContent().build();
    }

    @PATCH
    @RolesAllowed({"Adm"})
    @Path("/{id}/telefones/{idTelefone}")
    public Response updateTelefoneEspecifico(@PathParam("id") Long id, @PathParam("idTelefone") Long idTelefone, @Valid TelefoneRequestDTO telefone) {
        LOG.info("Execucao do metodo updateTelefoneEspecifico. Id do fornecedor: " + id + ", id do telefone: " + idTelefone);
        fornecedorService.updateTelefoneEspecifico(id, idTelefone, telefone);
        return Response.noContent().build();
    }
    
    @PATCH
    @RolesAllowed({"Adm"})
    @Path("/{id}/telefones")
    public Response updateTelefone(@PathParam("id") Long id, @Valid List<TelefoneRequestDTO> telefone) {
        LOG.info("Execucao do metodo updateTelefone. Id do fornecedor: " + id);
        fornecedorService.updateTelefone(id, telefone);
        return Response.noContent().build();
    }
}
