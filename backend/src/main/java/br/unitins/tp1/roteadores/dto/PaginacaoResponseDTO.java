package br.unitins.tp1.roteadores.dto;

import java.util.List;

public record PaginacaoResponseDTO<T>(
    long total,
    int page,
    int pageSize,
    List<T> resultado 
) {
    public static <T> PaginacaoResponseDTO<T> valueOf(long total, int page, int pageSize, List<T> resultado) {
        return new PaginacaoResponseDTO<>(total, page, pageSize, resultado);
    }
}
