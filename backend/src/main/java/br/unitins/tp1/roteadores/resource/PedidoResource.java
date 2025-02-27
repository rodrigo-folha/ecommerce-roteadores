package br.unitins.tp1.roteadores.resource;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.pedido.PedidoBasicoResponseDTO;
import br.unitins.tp1.roteadores.dto.pedido.PedidoRequestDTO;
import br.unitins.tp1.roteadores.dto.pedido.PedidoResponseDTO;
import br.unitins.tp1.roteadores.dto.pedido.StatusPedidoRequestDTO;
import br.unitins.tp1.roteadores.service.pedido.PedidoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PedidoResource {

    private static final Logger LOG = Logger.getLogger(PedidoResource.class);

    @Inject
    public PedidoService pedidoService;

    @Inject
    public JsonWebToken jwt;

    @GET
    @RolesAllowed("User")
    public Response findByEmail() {
        LOG.info("Execucao do metodo findByEmail");

        // buscando o username do hash do jwt
        String username = jwt.getSubject();

        return Response.ok(pedidoService.findByEmail(username).
                    stream().
                    map(o -> PedidoResponseDTO.valueOf(o)).
                    toList()).build();
    }

    @GET
    @RolesAllowed("User")
    @Path("/resumo")
    public Response findByEmailResumido() {
        LOG.info("Execucao do metodo findByEmailResumido");

        // buscando o username do hash do jwt
        String username = jwt.getSubject();

        return Response.ok(pedidoService.findByEmail(username).
                    stream().
                    map(o -> PedidoBasicoResponseDTO.valueOf(o)).
                    toList()).build();
    }

    @GET
    @RolesAllowed({"User"})
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findById. Id: " + id);
        String email = jwt.getSubject();
        return Response.ok(PedidoResponseDTO.valueOf(pedidoService.findById(email, id))).build();
    }

    @GET
    @RolesAllowed({"Adm"})
    @Path("/search/{id}")
    public Response findByIdAdm(@PathParam("id") Long id) {
        LOG.info("Execucao do metodo findByIdAdm. Id: " + id);
        return Response.ok(PedidoResponseDTO.valueOf(pedidoService.findById(id))).build();
    }

    @GET
    @RolesAllowed({"Adm"})
    @Path("/search/all")
    public Response findAll() {
        LOG.info("Execucao do metodo findAll");
        return Response.ok(pedidoService.findAll()
                    .stream()
                    .map(PedidoResponseDTO::valueOf)
                    .toList()).build();
    }

    @POST
    @RolesAllowed("User")
    public Response create(@Valid PedidoRequestDTO dto) {
        LOG.info("Execucao do metodo create");

        // buscando o username do hash do jwt
        String username = jwt.getSubject();

        return Response.status(Status.CREATED).entity(
            PedidoResponseDTO.valueOf(pedidoService.create(dto, username))
        ).build();
    }

    @PATCH
    @RolesAllowed("User")
    @Path("/{idPedido}/pagamento/pagar/pix/{idpix}")
    public Response registrarPagamentoPix(@PathParam("idPedido") Long idPedido, @PathParam("idpix") Long idPix) {
        LOG.info("Execucao do metodo registrarPagamentoPix. Id do pedido: " + idPedido + ", id do pix: " + idPix);
        pedidoService.registrarPagamentoPix(idPedido, idPix);
        return Response.status(Status.NO_CONTENT).build();
    }

    @PATCH
    @RolesAllowed("User")
    @Path("/{idPedido}/pagamento/pagar/boleto/{idboleto}")
    public Response registrarPagamentoBoleto(@PathParam("idPedido") Long idPedido, @PathParam("idboleto") Long idBoleto) {     
        LOG.info("Execucao do metodo registrarPagamentoBoleto. Id do pedido: " + idPedido + ", id do boleto: " + idBoleto);
        pedidoService.registrarPagamentoBoleto(idPedido, idBoleto);
        return Response.status(Status.NO_CONTENT).build();
    }

    @PATCH
    @RolesAllowed("Adm")
    @Path("/statuspedido/{idPedido}")
    public Response updateStatusPedido(@PathParam("idPedido")Long idPedido, @Valid StatusPedidoRequestDTO statusPedido) {
        LOG.info("Execucao do metodo updateStatusPedido. Id do pedido: " + idPedido);  
        pedidoService.updateStatusPedido(idPedido, statusPedido);
        return Response.status(Status.NO_CONTENT).build();
    }

    @PATCH
    @RolesAllowed("User")
    @Path("/cancelar/{idPedido}")
    public Response cancelarPedido(@PathParam("idPedido") Long idPedido) {
        LOG.info("Execucao do metodo cancelarPedido. IdPedido: " + idPedido); 
        pedidoService.cancelarPedido(idPedido);
        return Response.status(Status.NO_CONTENT).build();
    }

    @PATCH
    @RolesAllowed("User")
    @Path("/devolver/{idPedido}")
    public Response devolverPedido(@PathParam("idPedido") Long idPedido) {
        LOG.info("Execucao do metodo devolverPedido. IdPedido: " + idPedido); 
        pedidoService.devolverPedido(idPedido);
        return Response.status(Status.NO_CONTENT).build();
    }
    
}
