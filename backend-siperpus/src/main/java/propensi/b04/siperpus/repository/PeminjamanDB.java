package propensi.b04.siperpus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.PeminjamanModel;
import propensi.b04.siperpus.model.UserModel;

import java.util.List;

@Repository
public interface PeminjamanDB extends JpaRepository<PeminjamanModel, Long> {
    @Query("select count(i) from PeminjamanModel i where i.tglPengembalian is null and i.user.username=:username")
    long countPeminjamanAktifByUser(String username);

    @Query("select i from PeminjamanModel i where i.tglPengembalian is null")
    List<PeminjamanModel> findAllPeminjamanAktif();

}
