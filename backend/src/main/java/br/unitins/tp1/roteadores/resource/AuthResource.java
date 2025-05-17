package br.unitins.tp1.roteadores.resource;

import org.jboss.logging.Logger;

import br.unitins.tp1.roteadores.dto.usuario.AuthRequestDTO;
import br.unitins.tp1.roteadores.dto.usuario.UsuarioBasicoResponseDTO;
import br.unitins.tp1.roteadores.dto.usuario.UsuarioResponseDTO;
import br.unitins.tp1.roteadores.model.usuario.Perfil;
import br.unitins.tp1.roteadores.model.usuario.Usuario;
import br.unitins.tp1.roteadores.service.jwt.JwtService;
import br.unitins.tp1.roteadores.service.usuario.HashService;
import br.unitins.tp1.roteadores.service.usuario.UsuarioService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    private static final Logger LOG = Logger.getLogger(AuthResource.class);

    @Inject
    HashService hashService;

    @Inject
    UsuarioService usuarioService;

    @Inject
    JwtService jwtService;

    @POST
    // @Produces(MediaType.TEXT_PLAIN)
    public Response loginUsuario(@Valid AuthRequestDTO authDTO) {
        LOG.info("Logando no sistema");
        String hash = hashService.getHashSenha(authDTO.senha());
        
        Usuario usuario = usuarioService.findByEmailAndSenha(authDTO.email(), hash);
        
        if (usuario == null) {
            LOG.warn("Tentativa de login falhou - Usuario ou senha invalido(s)");
            return Response.status(Status.UNAUTHORIZED).entity("Usuario ou senha invalido(s)").build();
        } 

        if (!usuario.getPerfis().contains(Perfil.USER)) {
            LOG.warn("Cliente nao cadastrado!");
            return Response.status(Status.UNAUTHORIZED).entity("Cliente nao cadastrado!").build();
        }

        if (usuario.getPerfis().contains(Perfil.USER)) {
            usuario.getPerfis().clear();
            usuario.getPerfis().add(Perfil.USER);
        }

        UsuarioBasicoResponseDTO usuarioDTO = UsuarioBasicoResponseDTO.valueOf(usuario);

        return Response.ok(usuarioDTO)
            .header("Authorization", jwtService.generateJwt(UsuarioResponseDTO.valueOf(usuario)))
            .build();
        
    }

    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/funcionario")
    public Response loginAdm(@Valid AuthRequestDTO authDTO) {
        LOG.info("Logando no sistema");
        String hash = hashService.getHashSenha(authDTO.senha());
        
        Usuario usuario = usuarioService.findByEmailAndSenha(authDTO.email(), hash);
        
        if (usuario == null) {
            LOG.warn("Tentativa de login falhou - Usuario ou senha invalido(s)");
            return Response.status(Status.UNAUTHORIZED).entity("Usuario ou senha invalido(s)").build();
        } 

        if (!usuario.getPerfis().contains(Perfil.ADM)) {
            LOG.warn("Funcionario nao cadastrado!");
            return Response.status(Status.UNAUTHORIZED).entity("Funcionario nao cadastrado!").build();
        }

        if (usuario.getPerfis().contains(Perfil.ADM)) {
            usuario.getPerfis().clear();
            usuario.getPerfis().add(Perfil.ADM);
        }

        UsuarioBasicoResponseDTO usuarioDTO = UsuarioBasicoResponseDTO.valueOf(usuario);

        return Response.ok(usuarioDTO)
            .header("Authorization", jwtService.generateJwt(UsuarioResponseDTO.valueOf(usuario)))
            .build();
        
    }
  
}
