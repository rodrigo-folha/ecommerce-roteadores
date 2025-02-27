package br.unitins.tp1.roteadores.resource;

import java.io.IOException;

import org.jboss.logging.Logger;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import br.unitins.tp1.roteadores.dto.roteador.RoteadorRequestDTO;
import br.unitins.tp1.roteadores.dto.roteador.RoteadorResponseDTO;
import br.unitins.tp1.roteadores.form.ImageForm;
import br.unitins.tp1.roteadores.service.file.RoteadorFileServiceImpl;
import br.unitins.tp1.roteadores.service.roteador.RoteadorService;
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

@Path("/roteadores")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RoteadorResource {

    private static final Logger LOG = Logger.getLogger(RoteadorResource.class);

    @Inject
    public RoteadorService roteadorService;

    @Inject
    public RoteadorFileServiceImpl roteadorFileService;

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        return Response.ok(RoteadorResponseDTO.valueOf(roteadorService.findById(id))).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/search/{nome}")
    public Response findByNome(@PathParam("nome") String nome) {
        LOG.info("Execucao do metodo findByNome. Nome: " + nome);
        return Response.ok(roteadorService.findByNome(nome)
            .stream()
            .map(o -> RoteadorResponseDTO.valueOf(o))
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/search/sinalwireless/{idSinalWireless}")
    public Response findBySinalWireless(@PathParam("idSinalWireless") Long idSinalWireless) {
        LOG.info("Execucao do metodo findBysinalWireless. idSinalWireless: " + idSinalWireless);
        return Response.ok(roteadorService.findBySinalWireless(idSinalWireless)
            .stream()
            .map(RoteadorResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/search/sistemasoperacionais/{idSistemaOperacional}")
    public Response findBySistemaOperacional(@PathParam("idSistemaOperacional") Long idSistemaOperacional) {
        LOG.info("Execucao do metodo findBySistemaOperacional. idSinalWireless: " + idSistemaOperacional);
        return Response.ok(roteadorService.findBySistemaOperacional(idSistemaOperacional)
            .stream()
            .map(RoteadorResponseDTO::valueOf)
            .toList()).build();
    }
    
    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/search/quantidadeantenas/{idQuantidadeAntena}")
    public Response findByQuantidadeAntena(@PathParam("idQuantidadeAntena") Long idQuantidadeAntena) {
        LOG.info("Execucao do metodo findByQuantidadeAntena. idQuantidadeAntena: " + idQuantidadeAntena);
        return Response.ok(roteadorService.findByQuantidadeAntena(idQuantidadeAntena)
            .stream()
            .map(RoteadorResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/search/bandafrequencias/{idBandaFrequencia}")
    public Response findByBandaFrequencia(@PathParam("idBandaFrequencia") Long idBandaFrequencia) {
        LOG.info("Execucao do metodo findByBandaFrequencia. idBandaFrequencia: " + idBandaFrequencia);
        return Response.ok(roteadorService.findByBandaFrequencia(idBandaFrequencia)
            .stream()
            .map(RoteadorResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/search/protocolosseguranca/{idProtocoloSeguranca}")
    public Response findByProtocoloSeguranca(@PathParam("idProtocoloSeguranca") Long idProtocoloSeguranca) {
        LOG.info("Execucao do metodo findByProtocoloSeguranca. idProtocoloSeguranca: " + idProtocoloSeguranca);
        return Response.ok(roteadorService.findByProtocoloSeguranca(idProtocoloSeguranca)
            .stream()
            .map(RoteadorResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    @Path("/search/preco/{min}/{max}")
    public Response findByPreco(@PathParam("min") Double min, @PathParam("max") Double max) {
        LOG.info("Execucao do metodo findByPreco. Preco min: " + min + ", preco max: " + max);
        return Response.ok(roteadorService.findByPreco(min, max)
            .stream()
            .map(RoteadorResponseDTO::valueOf)
            .toList()).build();
    }

    @GET
    @RolesAllowed({"Adm", "User"})
    public Response findAll() {
        LOG.info("Execucao do metodo findAll");
        return Response.ok(roteadorService.findAll()
            .stream()
            .map(RoteadorResponseDTO::valueOf)
            .toList()).build();
    }

    @POST
    @RolesAllowed({"Adm"})
    public Response create(@Valid RoteadorRequestDTO dto) {
        LOG.info("Execucao do metodo create");
        return Response.status(Status.CREATED)
            .entity(RoteadorResponseDTO.valueOf(roteadorService.create(dto)))
            .build();
    }

    @PUT
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid RoteadorRequestDTO roteador) {
        LOG.info("Execucao do metodo update. Id do roteador: " + id);
        roteadorService.update(id, roteador);
        return Response.noContent().build();
    }

    @DELETE
    @RolesAllowed({"Adm"})
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo delete. Id do roteador: " + id);
        roteadorService.delete(id);
        return Response.noContent().build();
    }
    
    @PATCH
    @RolesAllowed({"Adm"})
    @Path("/{idRoteador}/upload/imagem")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadImage(@PathParam("idRoteador") Long id, @MultipartForm ImageForm form) {
        LOG.info("Execucao do uploadImage. Id do roteador: " + id);

        try {
            String nomeImagem = roteadorFileService.save(form.getNomeImagem(), form.getImagem());

            roteadorService.updateNomeImagem(id, nomeImagem);
        } catch (IOException e) {
            Response.status(500).build();
        }
        return Response.noContent().build();
    }

    @GET
    @RolesAllowed({"Adm"})
    @Path("/download/imagem/{nomeImagem}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadImage(@PathParam("nomeImagem") String nomeImagem) {
        LOG.info("Execucao do metodo downloadImage.");
        ResponseBuilder response = Response.ok(roteadorFileService.find(nomeImagem));
        response.header("Content-Disposition", "attachment; filename=" + nomeImagem);
        return response.build();
    }
}
