package br.unitins.tp1.roteadores.service.file;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FuncionarioFileServiceImpl implements FileService {

    // private final String PATH_FUNCIONARIO = "D:\\Arquivos\\quarkus\\ecommerce-roteadores\\funcionario\\";
    private final String PATH_FUNCIONARIO = System.getProperty("user.home")
            + File.separator + "quarkus"
            + File.separator + "ecommerce-roteadores"
            + File.separator + "funcionario"
            + File.separator;

    private static final List<String> SUPPORTED_MIME_TYPES = Arrays.asList("image/jpeg", "image/jpg", "image/png",
            "image/gif");

    private static final int MAX_FILE_SIZE = 1024 * 1024 * 10; // 10 MB

    @Override
    public String save(String nomeArquivo, byte[] arquivo) throws IOException {
        nomeArquivo = nomeArquivo.trim();
        verificarTamanhoArquivo(arquivo);

        String mimeType = Files.probeContentType(Paths.get(nomeArquivo));
        verificarTipoArquivo(mimeType);

        Path diretorio = Paths.get(PATH_FUNCIONARIO);
        if (!new File(PATH_FUNCIONARIO).exists())
            Files.createDirectory(diretorio);

        String novoNomeArquivo = existeArquivo(nomeArquivo, diretorio);
        String extensao = mimeType.substring(mimeType.lastIndexOf("/") + 1);

        Path filePath = diretorio.resolve(novoNomeArquivo + "." + extensao); // caminho final do arquivo

        if (filePath.toFile().exists()) {
            throw new IOException("O nome do arquivo ja existe " + nomeArquivo);
        }

        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            fos.write(arquivo);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        return novoNomeArquivo;
    }

    private void verificarTipoArquivo(String mimeType) throws IOException {
        if (!SUPPORTED_MIME_TYPES.contains(mimeType)) {
            throw new IOException("O formato do arquivo não é suportado");
        }
    }

    private void verificarTamanhoArquivo(byte[] arquivo) throws IOException {
        if (arquivo.length > MAX_FILE_SIZE) {
            throw new IOException("O tamanho do arquivo excede o limite de 10 MB.");
        }
    }

    private String existeArquivo(String nomeArquivo, Path diretorio) {
        String novoNomeArquivo = UUID.randomUUID().toString();
        Path filePath = diretorio.resolve(novoNomeArquivo);

        while (filePath.toFile().exists()) {
            novoNomeArquivo = UUID.randomUUID().toString();
            filePath = diretorio.resolve(novoNomeArquivo);
        }

        return novoNomeArquivo;
    }

    @Override
    public File find(String nomeArquivo) throws FileNotFoundException {
        File file = new File(PATH_FUNCIONARIO + nomeArquivo);

        if (!file.exists()) {
            throw new FileNotFoundException("Arquivo não encontrado: " + nomeArquivo);
        }
        return file;
    }
}
