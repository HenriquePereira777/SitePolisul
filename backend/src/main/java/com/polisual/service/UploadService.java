package com.polisual.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

// Guarda as fotos enviadas pelo painel admin em disco (volume do Docker) e devolve a URL pública.
@Service
@Slf4j
public class UploadService {

    @Value("${app.upload-dir:uploads}")
    private String dir;

    private Path raiz;

    @PostConstruct
    void init() throws IOException {
        raiz = Paths.get(dir).toAbsolutePath().normalize();
        Files.createDirectories(raiz);
        log.info("Pasta de uploads: {}", raiz);
    }

    public Path getRaiz() { return raiz; }

    /** Valida pelo conteúdo real do arquivo (não pelo nome) e salva com nome aleatório. */
    public String salvar(MultipartFile arquivo) throws IOException {
        if (arquivo == null || arquivo.isEmpty()) throw new IllegalArgumentException("Arquivo vazio.");
        byte[] h = new byte[12];
        int lidos;
        try (var in = arquivo.getInputStream()) { lidos = in.readNBytes(h, 0, 12); }
        String ext = extensao(h, lidos);
        if (ext == null) throw new IllegalArgumentException("Formato inválido. Envie JPG, PNG ou WEBP.");

        String nome = UUID.randomUUID().toString().replace("-", "") + "." + ext;
        Path destino = raiz.resolve(nome).normalize();
        if (!destino.startsWith(raiz)) throw new IllegalArgumentException("Nome inválido.");
        try (var in = arquivo.getInputStream()) { Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING); }
        return "/uploads/" + nome;
    }

    private static String extensao(byte[] h, int n) {
        if (n >= 3 && (h[0] & 0xFF) == 0xFF && (h[1] & 0xFF) == 0xD8 && (h[2] & 0xFF) == 0xFF) return "jpg";
        if (n >= 8 && (h[0] & 0xFF) == 0x89 && h[1] == 'P' && h[2] == 'N' && h[3] == 'G') return "png";
        if (n >= 12 && h[0] == 'R' && h[1] == 'I' && h[2] == 'F' && h[3] == 'F'
                && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P') return "webp";
        return null;
    }
}
