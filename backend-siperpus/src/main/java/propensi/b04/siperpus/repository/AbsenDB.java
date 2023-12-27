package propensi.b04.siperpus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import propensi.b04.siperpus.model.AbsenModel;
import propensi.b04.siperpus.model.PeminjamanModel;

import java.util.List;

@Repository
public interface AbsenDB extends JpaRepository<AbsenModel, Long> {
    List<AbsenModel> findAll();
}
