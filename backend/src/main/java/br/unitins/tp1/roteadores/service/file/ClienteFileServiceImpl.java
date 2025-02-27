package br.unitins.tp1.roteadores.service.file;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import br.unitins.tp1.roteadores.validation.ValidationException;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ClienteFileServiceImpl implements FileService{
    
    private final String PATH_CLIENTE = "D:\\Arquivos\\quarkus\\ecommerce-roteadores\\cliente\\";
    // private final String PATH_CLIENTE = System.getProperty("user.home")
    //         + File.separator + "quarkus"
    //         + File.separator + "roteadores"
    //         + File.separator + "images"
    //         + File.separator + "cliente"
    //         + File.separator;

    private static final List<String> SUPPORTED_MIME_TYPES =
        Arrays.asList("image/jpeg", "image/jpg", "image/png", "image/gif");

    private static final int MAX_FILE_SIZE = 1024 * 1024 * 10; // 10 MB


    @Override
    public String save(String nomeArquivo, byte[] arquivo) throws IOException {
        verificarTipoArquivo(nomeArquivo);
        verificarTamanhoArquivo(arquivo);

        Path diretorio = Paths.get(PATH_CLIENTE);
        if(!new File(PATH_CLIENTE).exists())
            Files.createDirectory(diretorio);

        String mimeType = Files.probeContentType(Paths.get(nomeArquivo));
        String extensao = mimeType.substring(mimeType.lastIndexOf("/") + 1);
        String novoNomeArquivo = UUID.randomUUID() + "." + extensao;

        // Criar funcao para se existir, rodar o UUID random de novo e gerar aleatorio, até não ter mais nenhum com mesmo nome

        // caminho final do arquivo
        Path filePath = diretorio.resolve(novoNomeArquivo);

        while (filePath.toFile().exists()) {
            novoNomeArquivo = UUID.randomUUID() + "." + extensao;
        }

        // salvando a imagem
        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            fos.write(arquivo);
        }

        return novoNomeArquivo;
        
    }

    private void verificarTipoArquivo(String nomeArquivo) throws IOException {
        String mimeType = Files.probeContentType(Paths.get(nomeArquivo));
        if (!SUPPORTED_MIME_TYPES.contains(mimeType)) {
            throw new IOException("Formato de arquivo nao suportado pelo sistema.");
        }
    }

    private void verificarTamanhoArquivo(byte[] arquivo) throws IOException {
        if (arquivo.length > MAX_FILE_SIZE) {
            throw new IOException("O arquivo excede o limite maximo de 10 MB.");
        }
    }

    

    @Override
    public File find(String nomeArquivo) {
        File arquivo = new File(PATH_CLIENTE + nomeArquivo);
        if (!arquivo.exists())
            throw new ValidationException("nomeArquivo", "Arquivo nao encontrado");
        return arquivo;
    }

    public static void main(String[] args) {
        System.out.println(System.getProperty("user.dir"));
        System.out.println(System.getProperty("user.home"));
    }
}
