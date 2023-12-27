package propensi.b04.siperpus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.UlasanModel;
import propensi.b04.siperpus.model.UserModel;

public interface UlasanDB extends JpaRepository<UlasanModel, Long> {
    boolean existsByBuku(BukuModel buku);
    boolean existsByUser(UserModel user);
}
