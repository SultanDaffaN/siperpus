package propensi.b04.siperpus.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import propensi.b04.siperpus.model.BukuModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BukuDB extends JpaRepository<BukuModel, Long>{
    @Query("select i from BukuModel i where i.namaBuku LIKE %:nama%")
    List<BukuModel> findByFilterTitle(@Param("nama") String namaBuku);

    @Query("select count(i) from PeminjamanModel i where i.tglPengembalian is null and i.buku.idBuku=:idBuku")
    Integer countPeminjamanAktif(Long idBuku);
}
