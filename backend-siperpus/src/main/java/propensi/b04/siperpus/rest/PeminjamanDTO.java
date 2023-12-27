package propensi.b04.siperpus.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


public class PeminjamanDTO {
    public LocalDate tgl_peminjaman;
    public String username;
    public Long idBuku;
}
