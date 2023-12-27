package propensi.b04.siperpus.restcontroller;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.rest.*;
import propensi.b04.siperpus.restservice.AbsenRestService;
import propensi.b04.siperpus.restservice.BukuRestService;
import propensi.b04.siperpus.restservice.PeminjamanRestService;
import propensi.b04.siperpus.restservice.UserRestService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/dashboard/kepala")
public class DashboardKepalaRestController {
    @Autowired
    BukuRestService bukuRestService;

    @Autowired
    PeminjamanRestService peminjamanRestService;

    @Autowired
    AbsenRestService absenRestService;

    @Autowired
    UserRestService userRestService;

    @GetMapping()
    @PreAuthorize("hasRole('KEPALA')")
    public BaseResponse<DashboardKepalaData> getDataDashboard(){
        DashboardKepalaData dataDashboard = new DashboardKepalaData();
        // Update pembayaran denda
        for (UserModel user: userRestService.getAllPengguna()) {
            peminjamanRestService.getListPeminjamanAktifUserById(user.getId());
        }
        dataDashboard.setTotalBuku(bukuRestService.getTotalBuku());
        dataDashboard.setBukuDipinjam(peminjamanRestService.getTotalPeminjamanAktif());
        dataDashboard.setBukuTerlambat(peminjamanRestService.getTotalBukuTerlambat());
        dataDashboard.setPengunjungBulanan(absenRestService.getTotalAbsenBulanan());
        dataDashboard.setTotalStaff(userRestService.getTotalStaff());
        dataDashboard.setTotalPengguna(userRestService.getTotalPengguna());
        dataDashboard.setDendaTerkumpul(userRestService.getDendaTerkumpul());
        dataDashboard.setDendaBlmTerbayar(userRestService.getDendaBlmTerbayar());

        BaseResponse<DashboardKepalaData> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(dataDashboard);

        return response;
    }

    @GetMapping("/data-absen")
    @PreAuthorize("hasRole('KEPALA')")
    public BaseResponse<AbsenDataBulanan> getDataAbsenBulanan(){
        AbsenDataBulanan absenData = new AbsenDataBulanan();
        absenData.setLstDataAbsen(absenRestService.getAbsenHarianPerBulan());

        BaseResponse<AbsenDataBulanan> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(absenData);

        return response;
    }

    @GetMapping("/persentase-kategori")
    @PreAuthorize("hasRole('KEPALA')")
    public BaseResponse<PersentaseKategori> getPersentaseKategoriBuku(){
        PersentaseKategori persentase = new PersentaseKategori();
        persentase.setPersentaseKategoriBuku(bukuRestService.getPersentaseKategori());

        BaseResponse<PersentaseKategori> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(persentase);

        return response;
    }

    @GetMapping("/kategori-popular")
    @PreAuthorize("hasRole('KEPALA')")
    public BaseResponse<KategoriBukuPopular> getKategoriBukuPopular(){
        KategoriBukuPopular kategoriPopular = new KategoriBukuPopular();
        kategoriPopular.setKategoriBukuPopular(peminjamanRestService.getKategoriBukuPopular());

        BaseResponse<KategoriBukuPopular> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(kategoriPopular);

        return response;
    }
}
