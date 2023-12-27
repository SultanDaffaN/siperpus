package propensi.b04.siperpus.restcontroller;

import com.fasterxml.jackson.databind.util.JSONPObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propensi.b04.siperpus.model.PeminjamanModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.payload.response.JwtResponse;
import propensi.b04.siperpus.repository.UserDB;
import propensi.b04.siperpus.rest.BaseResponse;
import propensi.b04.siperpus.rest.PeminjamanDTO;
import propensi.b04.siperpus.rest.PengembalianDTO;
import propensi.b04.siperpus.rest.UserDTO;
import propensi.b04.siperpus.restservice.PeminjamanRestService;
import propensi.b04.siperpus.restservice.UserRestService;
import propensi.b04.siperpus.security.jwt.JwtUtils;
import propensi.b04.siperpus.security.services.UserDetailsImpl;
import propensi.b04.siperpus.security.services.UserDetailsServiceImpl;

import javax.validation.Valid;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/peminjaman")
public class PeminjamanRestController {
    @Autowired
    private PeminjamanRestService peminjamanRestService;

    @Autowired
    private UserRestService userRestService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserDB userDB;


    @GetMapping()
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<List<PeminjamanModel>> getAllPeminjaman(){
        BaseResponse<List<PeminjamanModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(peminjamanRestService.getListPeminjaman());

        return response;
    }

    @GetMapping(value = "/aktif")
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<List<PeminjamanModel>> getAllPeminjamanAktif(){
        BaseResponse<List<PeminjamanModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(peminjamanRestService.getListPeminjamanAktif());

        return response;
    }

    @GetMapping(value = "/aktif/user/{idUser}")
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<List<PeminjamanModel>> getAllPeminjamanAktifPengguna(
            @PathVariable("idUser") Long idUser
    ){
        BaseResponse<List<PeminjamanModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(peminjamanRestService.getListPeminjamanAktifUserById(idUser));

        return response;
    }


    @GetMapping(value = "/user")
    @PreAuthorize("hasRole('PENGGUNA')")
    public BaseResponse<List<Map<String, Object>>> getListPeminjamanPengguna(){

        BaseResponse<List<Map<String, Object>>> response = new BaseResponse<>();

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();

        List<Map<String, Object>> daftarPeminjaman = userRestService.getAllBorrowedBook(username);

        response.setStatus(200);
        response.setMessage("success");
        response.setResult(daftarPeminjaman);

        return response;
    }

    @PostMapping(value = "")
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<PeminjamanModel> addPeminjaman(
            @Valid @RequestBody PeminjamanDTO peminjamanDTO,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<PeminjamanModel> response = new BaseResponse<>();
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            if(peminjamanRestService.getJumlahPeminjamanByUsername(peminjamanDTO.username) > 5){
                response.setStatus(400);
                response.setMessage("Exceeds user's maximum borrowable books");
                response.setResult(null);
            } else if(! peminjamanRestService.bukuIsAvailable(peminjamanDTO.idBuku)){
                response.setStatus(400);
                response.setMessage("Not currently available to borrow");
                response.setResult(null);
            } else if(userDB.existsByUsername(peminjamanDTO.username) == false){
                response.setStatus(400);
                response.setMessage("Username peminjam tidak ada dalam sistem.");
                response.setResult(null);
            } else {
                try {
                    PeminjamanModel peminjaman = peminjamanRestService.createPeminjaman(peminjamanDTO);
                    response.setStatus(201);
                    response.setMessage("created");
                    response.setResult(peminjaman);
                } catch (Exception e) {
                    response.setStatus(400);
                    response.setMessage(e.toString());
                    response.setResult(null);
                }
            }
            return response;
        }
    }

    @PutMapping(value = "/pengembalian/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<PeminjamanModel> pengembalianBuku(
            @Valid @RequestBody PengembalianDTO pengembalianDTO,
            @PathVariable(value = "id") Long id,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<PeminjamanModel> response = new BaseResponse<>();
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            try {
                PeminjamanModel peminjaman = peminjamanRestService.pengembalianBuku(pengembalianDTO, id);
                response.setStatus(200);
                response.setMessage("Pengembalian berhasil");
                response.setResult(peminjaman);
            } catch (Exception e) {
                response.setStatus(400);
                response.setMessage(e.toString());
                response.setResult(null);
            }
            return response;
        }
    }
}
