package propensi.b04.siperpus.restservice;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.PeminjamanModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.rest.PeminjamanDTO;
import propensi.b04.siperpus.rest.PengembalianDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface PeminjamanRestService {
    PeminjamanModel createPeminjaman(PeminjamanDTO peminjamanDTO);
    List<PeminjamanModel> getListPeminjaman();
    List<PeminjamanModel> getListPeminjamanAktif();
    long getJumlahPeminjamanByUsername(String username);
    boolean bukuIsAvailable(Long idBuku);
    PeminjamanModel pengembalianBuku(PengembalianDTO pengembalianDTO, Long idPeminjaman);
    List<PeminjamanModel> getListPeminjamanAktifUserById(Long idUser);
    int getTotalPeminjamanAktif();
    int getTotalBukuTerlambat();
    Map<String, Integer> getKategoriBukuPopular();
    List<PeminjamanModel> getListRiwayatPeminjamanUserByUsername(String username);
}
