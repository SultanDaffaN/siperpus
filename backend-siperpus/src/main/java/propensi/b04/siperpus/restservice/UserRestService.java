package propensi.b04.siperpus.restservice;

import com.fasterxml.jackson.databind.util.JSONPObject;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.rest.BukuDTO;
import propensi.b04.siperpus.rest.DendaDTO;
import propensi.b04.siperpus.rest.UserDTO;

import java.util.List;
import java.util.Map;

public interface UserRestService {
    UserModel getUserByUsername(String username);
    UserModel getUserById(Long id);
    UserModel activateUser(UserDTO user, Long id);
    List<UserModel> getAllStaff();
    List<UserModel> getAllPengguna();
    int getTotalStaff();
    int getTotalPengguna();
    int getDendaTerkumpul();
    int getDendaBlmTerbayar();
    List<Map<String, Object>> getAllBorrowedBook(String username);
    void deleteUser(Long id);
    Boolean userExists(String username);
    UserModel bayarDendaUser(Long id, DendaDTO dendaDTO);
}
