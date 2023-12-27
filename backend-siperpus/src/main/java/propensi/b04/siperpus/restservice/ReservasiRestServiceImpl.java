package propensi.b04.siperpus.restservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.PeminjamanModel;
import propensi.b04.siperpus.model.ReservasiModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.repository.BukuDB;
import propensi.b04.siperpus.repository.ReservasiDB;
import propensi.b04.siperpus.repository.UserDB;
import propensi.b04.siperpus.rest.ReservasiDTO;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@Transactional
public class ReservasiRestServiceImpl implements ReservasiRestService{
    @Autowired
    ReservasiDB reservasiDB;

    @Autowired
    BukuDB bukuDB;

    @Autowired
    UserDB userDB;

    @Override
    public ReservasiModel createReservasi(ReservasiDTO reservasiDTO, String username) {
        BukuModel buku = bukuDB.findById(reservasiDTO.idBuku).get();
        UserModel user = userDB.findByUsername(username).get();

        ReservasiModel newReservasi = new ReservasiModel();
        newReservasi.setBuku(buku);
        newReservasi.setUser(user);
        return reservasiDB.save(newReservasi);
    }

    @Override
    public List<ReservasiModel> getListReservasiByUser(String username){
        UserModel user = userDB.findByUsername(username).get();
        List<ReservasiModel> reservasiUser = user.getListReservasi();

        return reservasiUser;
    }

}
