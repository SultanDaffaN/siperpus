package propensi.b04.siperpus.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import propensi.b04.siperpus.model.ERole;
import propensi.b04.siperpus.model.RoleModel;

@Repository
public interface RoleDB extends JpaRepository<RoleModel, Long> {
    Optional<RoleModel> findByName(ERole name);
}

