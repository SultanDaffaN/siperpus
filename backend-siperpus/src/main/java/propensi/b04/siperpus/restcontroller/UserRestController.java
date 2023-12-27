package propensi.b04.siperpus.restcontroller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.apache.catalina.User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.access.prepost.PreAuthorize;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.PeminjamanModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.rest.BaseResponse;
import propensi.b04.siperpus.rest.BukuDTO;
import propensi.b04.siperpus.rest.DendaDTO;
import propensi.b04.siperpus.rest.UserDTO;
import propensi.b04.siperpus.restservice.BukuRestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propensi.b04.siperpus.restservice.UserRestService;

import java.time.LocalDate;
import java.util.List;
import javax.validation.Valid;
import java.text.ParseException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/users")
public class UserRestController {
    @Autowired
    private UserRestService userRestService;

    @GetMapping("/staff")
    @PreAuthorize("hasRole('KEPALA')")
    public BaseResponse<List<UserModel>> getAllStaff(){
        BaseResponse<List<UserModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(userRestService.getAllStaff());

        return response;
    }

    @GetMapping("/pengguna")
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<List<UserModel>> getAllPengguna(){
        BaseResponse<List<UserModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(userRestService.getAllPengguna());

        return response;
    }

    @GetMapping("/pengguna/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<UserModel> getPenggunaById(@PathVariable("id") Long idUser){
        BaseResponse<UserModel> response = new BaseResponse<>();
        try {
            UserModel user = userRestService.getUserById(idUser);
            response.setStatus(200);
            response.setMessage("success");
            response.setResult(user);
        } catch (Exception e) {
            response.setStatus(400);
            response.setMessage(e.toString());
            response.setResult(null);
        }
        return response;
    }

    @PutMapping(value = "/activate/{id}")
    @PreAuthorize("hasRole('KEPALA') or hasRole('STAFF')")
    public BaseResponse<UserModel> activateUser(
            @Valid @RequestBody UserDTO user,
            @PathVariable(value = "id") Long id,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<UserModel> response = new BaseResponse<>();
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            try {
                UserModel newUser = userRestService.activateUser(user, id);
                response.setStatus(200);
                response.setMessage("User has been activated!");
                response.setResult(newUser);
            } catch (Exception e) {
                response.setStatus(400);
                response.setMessage(e.toString());
                response.setResult(null);
            }
            return response;
        }
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('KEPALA') or hasRole('STAFF')")
    public ResponseEntity<String> deleteBuku(@PathVariable("id") Long idUser) {
        try {
            userRestService.deleteUser(idUser);
            return ResponseEntity.ok("User has been deleted!");
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User Not Found.");
        }
    }

    @PutMapping(value = "/pembayaran-denda/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<UserModel> pembayaranDendaUser(
            @Valid @RequestBody DendaDTO dendaDTO,
            @PathVariable(value = "id") Long id,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<UserModel> response = new BaseResponse<>();
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            try {
                UserModel newUser = userRestService.bayarDendaUser(id, dendaDTO);
                response.setStatus(200);
                response.setMessage("Pembayaran Denda Berhasil dilakukan!");
                response.setResult(newUser);
            } catch (Exception e) {
                response.setStatus(400);
                response.setMessage(e.toString());
                response.setResult(null);
            }
            return response;
        }
    }
}
