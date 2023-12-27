package propensi.b04.siperpus.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.UserModel;

@Repository
public interface UserDB extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByUsername(String username);
    Optional<UserModel> findById(Long id);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
