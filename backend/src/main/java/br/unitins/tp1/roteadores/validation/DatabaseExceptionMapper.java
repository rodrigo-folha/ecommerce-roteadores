// package br.unitins.tp1.roteadores.validation;

// import org.jboss.logging.Logger;
// import org.postgresql.util.PSQLException;

// import jakarta.enterprise.context.ApplicationScoped;
// import jakarta.ws.rs.core.Response;
// import jakarta.ws.rs.ext.ExceptionMapper;
// import jakarta.ws.rs.ext.Provider;

// @Provider
// @ApplicationScoped
// public class DatabaseExceptionMapper implements ExceptionMapper<Throwable> {

//     private static final Logger LOG = Logger.getLogger(DatabaseExceptionMapper.class);

//     @Override
//     public Response toResponse(Throwable exception) {
//         Throwable rootCause = getRootCause(exception);

//         if (rootCause instanceof PSQLException) {
//             return handlePSQLException((org.postgresql.util.PSQLException) rootCause);
//         }

        
//         LOG.error("Erro inesperado: ", exception);
//         return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
//                 .entity(new ValidationError("500", "Erro inesperado"))
//                 .build();
//     }

//     private Response handlePSQLException(PSQLException exception) {
//         LOG.errorf("Erro no PostgreSQL: %s", exception.getMessage());
//         ValidationError error = new ValidationError("400", "Erro de integridade referencial");
//         error.addFieldError("id", "A operação nao pode ser concluida porque o registro esta sendo referenciado por outra entidade.");

//         return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
//     }

//     private Throwable getRootCause(Throwable throwable) {
//         Throwable cause = throwable;
//         while (cause.getCause() != null && cause != cause.getCause()) {
//             cause = cause.getCause();
//         }
//         return cause;
//     }
// }
