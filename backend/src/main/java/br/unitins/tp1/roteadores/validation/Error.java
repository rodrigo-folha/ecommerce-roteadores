package br.unitins.tp1.roteadores.validation;

public class Error {
    
    private String codigo;
    private String message;

    public Error(String codigo, String message) {
        this.codigo = codigo;
        this.message = message;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
