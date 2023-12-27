package propensi.b04.siperpus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import propensi.b04.siperpus.model.PeminjamanModel;
import propensi.b04.siperpus.model.ReservasiModel;

import javax.persistence.ManyToMany;
import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ReservasiDB extends JpaRepository<ReservasiModel, Long> {
    List<ReservasiModel> findAll();

    //Query delete_reservasi by id
    @Transactional
    @Modifying
    @Query("delete from ReservasiModel i where i.idReservasi=:idReservasi")
    void deleteReservasiByIdReservasi(Long idReservasi);
}
