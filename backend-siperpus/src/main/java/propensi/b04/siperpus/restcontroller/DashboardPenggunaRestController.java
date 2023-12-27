package propensi.b04.siperpus.restcontroller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import propensi.b04.siperpus.model.PeminjamanModel;
import propensi.b04.siperpus.model.ReservasiModel;
import propensi.b04.siperpus.rest.AbsenDataBulanan;
import propensi.b04.siperpus.rest.BaseResponse;
import propensi.b04.siperpus.restservice.PeminjamanRestService;
import propensi.b04.siperpus.restservice.ReservasiRestService;
import propensi.b04.siperpus.restservice.UserRestService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.time.temporal.ChronoUnit.DAYS;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/dashboard/pengguna")
public class DashboardPenggunaRestController {
    @Autowired
    ReservasiRestService reservasiRestService;

    @Autowired
    PeminjamanRestService peminjamanRestService;

    @Autowired
    UserRestService userRestService;

    @GetMapping("/reservasi")
    @PreAuthorize("hasRole('PENGGUNA')")
    public BaseResponse<List<ReservasiModel>> getListReservasiByUser(){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();

        BaseResponse<List<ReservasiModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(reservasiRestService.getListReservasiByUser(username));

        return response;
    }

    @GetMapping("/ulasan")
    @PreAuthorize("hasRole('PENGGUNA')")
    public BaseResponse<List<PeminjamanModel>> getListBukuUlasan(){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();

        BaseResponse<List<PeminjamanModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(peminjamanRestService.getListRiwayatPeminjamanUserByUsername(username));

        return response;
    }

    @GetMapping("/buku-dipinjam")
    @PreAuthorize("hasRole('PENGGUNA')")
    public BaseResponse<List<Map<String,Object>>> getListBukuDipinjam(){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();

        List<Map<String,Object>> peminjamanPengguna = new ArrayList<>();

        Long idUser = userRestService.getUserByUsername(username).getId();

        for (PeminjamanModel peminjaman : peminjamanRestService.getListPeminjamanAktifUserById(idUser)){
            HashMap<String, Object> result = new HashMap<>();

            String status = "";
            LocalDate now = LocalDate.now();
            if(now.isEqual(peminjaman.getBatasPengembalian())){
                status = "Perlu Dikembalikan";
            }else if (now.isBefore(peminjaman.getBatasPengembalian())){
                long sisaHari = DAYS.between(peminjaman.getBatasPengembalian(),now);
                status = "Tersisa " + Math.abs(sisaHari) + " hari";
            }else{
                status = "Terlambat";
            }

            result.put("status", status);
            result.put("peminjaman", peminjaman);

            peminjamanPengguna.add(result);

        }

        BaseResponse<List<Map<String,Object>>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(peminjamanPengguna);

        return response;
    }
}
