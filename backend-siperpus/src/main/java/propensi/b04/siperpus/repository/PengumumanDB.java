package propensi.b04.siperpus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import propensi.b04.siperpus.model.PengumumanModel;

import java.util.List;

public interface PengumumanDB extends JpaRepository<PengumumanModel, Long> {
    List<PengumumanModel> findAll();
}
