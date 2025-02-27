package br.unitins.tp1.roteadores.validation;

import org.jboss.logging.Logger;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
@ApplicationScoped
public class BeanValidationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

    private static final Logger LOG = Logger.getLogger(BeanValidationExceptionMapper.class);
    
    @Override
    public Response toResponse(ConstraintViolationException exception) {

        LOG.error("Bean Validation Error: " + exception.getMessage());
        
        ValidationError error = new ValidationError("400", "Erro de Validação");

        for (ConstraintViolation<?> violation : exception.getConstraintViolations()) {
            String fullFieldName = violation.getPropertyPath().toString();
            int index = fullFieldName.lastIndexOf(".");
            String fieldName = fullFieldName.substring(index + 1);
            String message = violation.getMessage();
            error.addFieldError(fieldName, message);
        }

        return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
    }
}
