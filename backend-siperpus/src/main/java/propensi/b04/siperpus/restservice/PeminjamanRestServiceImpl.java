package propensi.b04.siperpus.restservice;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propensi.b04.siperpus.model.*;
import propensi.b04.siperpus.repository.*;
import propensi.b04.siperpus.rest.PeminjamanDTO;
import propensi.b04.siperpus.rest.PengembalianDTO;

import javax.swing.text.html.Option;
import javax.transaction.Transactional;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@Transactional
public class PeminjamanRestServiceImpl implements PeminjamanRestService {
    @Autowired
    PeminjamanDB peminjamanDB;

    @Autowired
    BukuDB bukuDB;

    @Autowired
    UserDB userDB;

    @Autowired
    ReservasiDB reservasiDB;

    @Autowired
    UlasanDB ulasanDB;

    @Override
    public PeminjamanModel createPeminjaman(PeminjamanDTO peminjamanDTO) {
        PeminjamanModel peminjaman = new PeminjamanModel();
        peminjaman.setTglPeminjaman(peminjamanDTO.tgl_peminjaman);
        peminjaman.setDenda(0);
        peminjaman.setBatasPengembalian(peminjamanDTO.tgl_peminjaman.plusDays(14));
        peminjaman.setUser(userDB.findByUsername(peminjamanDTO.username).get());

        // Buku
        BukuModel buku = bukuDB.findById(peminjamanDTO.idBuku).get();
        peminjaman.setBuku(buku);
        buku.setJml_tersedia(buku.getJml_tersedia() - 1);
        if (buku.getJml_tersedia() == 0){
            buku.setStatusBuku("Dipinjam");
        }

        return peminjamanDB.save(peminjaman);
    }

    @Override
    public List<PeminjamanModel> getListPeminjaman(){
        return peminjamanDB.findAll();
    }

    @Override
    public List<PeminjamanModel> getListPeminjamanAktif(){
        // Kalkulasi denda
        for (PeminjamanModel peminjaman: peminjamanDB.findAllPeminjamanAktif()) {
            if (LocalDate.now().isAfter(peminjaman.getBatasPengembalian())){
                long telatHari = DAYS.between(LocalDate.now(), peminjaman.getBatasPengembalian());
                peminjaman.setDenda((int) Math.abs(2000*telatHari));

            }
        }

        return peminjamanDB.findAllPeminjamanAktif();
    }

    @Override
    public List<PeminjamanModel> getListPeminjamanAktifUserById(Long idUser){
        UserModel user = userDB.getById(idUser);
        List<PeminjamanModel> peminjamanAktifUser = new ArrayList<PeminjamanModel>();
        Integer tempDendaUser = 0;

        for (PeminjamanModel peminjaman: user.getListPeminjaman()) {
            if (peminjaman.getTglPengembalian() == null){
                if (LocalDate.now().isAfter(peminjaman.getBatasPengembalian())){
                    long telatHari = DAYS.between(LocalDate.now(), peminjaman.getBatasPengembalian());
                    peminjaman.setDenda((int) Math.abs(2000*telatHari));

                }
                peminjamanAktifUser.add(peminjaman);
            }
            tempDendaUser += peminjaman.getDenda();
        }

        //Kalkulasi unpaid Denda user
        tempDendaUser = tempDendaUser - user.getUnpaidDenda();
        user.setUnpaidDenda(user.getUnpaidDenda() + tempDendaUser - user.getPaidDenda());

        return peminjamanAktifUser;
    }

    @Override
    public long getJumlahPeminjamanByUsername(String username) {
        return peminjamanDB.countPeminjamanAktifByUser(username);
    }

    @Override
    public boolean bukuIsAvailable(Long idBuku){
        boolean isAvailable = true;
        BukuModel buku = bukuDB.getById(idBuku);

        if(!buku.getStatusBuku().equals("available")){
            isAvailable = false;
        }

        return isAvailable;
    }


    @Override
    public PeminjamanModel pengembalianBuku(PengembalianDTO pengembalianDTO, Long idPeminjaman) {
        PeminjamanModel peminjaman = peminjamanDB.getById(idPeminjaman);
        BukuModel buku = peminjaman.getBuku();
        if(peminjaman.getTglPengembalian() == null){
            //update jumlah buku available
            buku.setJml_tersedia(buku.getJml_tersedia() + 1);

            //Ubah status buku jika jumlah tersedia lebih dari 0
            if (buku.getJml_tersedia() > 0) {
                buku.setStatusBuku("available");
            }

            //set tgl pengembalian
            peminjaman.setTglPengembalian(pengembalianDTO.tgl_pengembalian);


            //update reservasi by remove antrian pertama
            if(!buku.getListReservasi().isEmpty()){
                ReservasiModel reservasi = buku.getListReservasi().get(0);
                reservasiDB.deleteReservasiByIdReservasi(reservasi.getIdReservasi());
            }
        }

        return peminjamanDB.save(peminjaman);
    }

    @Override
    public int getTotalPeminjamanAktif(){
        return getListPeminjamanAktif().size();
    }

    @Override
    public int getTotalBukuTerlambat(){
        List<PeminjamanModel> bukuTerlambat = new ArrayList<PeminjamanModel>();
        List<PeminjamanModel> bukuDipinjam = peminjamanDB.findAllPeminjamanAktif();

        for (PeminjamanModel peminjaman: bukuDipinjam) {
            if (peminjaman.getDenda() > 0) {
                bukuTerlambat.add(peminjaman);
            }
        }
        return bukuTerlambat.size();
    }

    @Override
    public Map<String, Integer> getKategoriBukuPopular(){
        Map<String, Integer> result = new HashMap<String, Integer>();

        for (PeminjamanModel peminjaman: peminjamanDB.findAll()) {
            if (result.containsKey(peminjaman.getBuku().getKategoriBuku())) {
                result.put(peminjaman.getBuku().getKategoriBuku(), result.get(peminjaman.getBuku().getKategoriBuku()) + 1);
            }
            else {
                result.put(peminjaman.getBuku().getKategoriBuku(), 1);
            }
        }
        return result;
    }

    @Override
    public List<PeminjamanModel> getListRiwayatPeminjamanUserByUsername(String username){
        UserModel user = userDB.findByUsername(username).get();
        List<PeminjamanModel> riwayatPeminjaman = new ArrayList<PeminjamanModel>();

        for (PeminjamanModel peminjaman: user.getListPeminjaman()) {
            if (peminjaman.getTglPengembalian() != null){
                if(ulasanDB.existsByBuku(peminjaman.getBuku()) && ulasanDB.existsByUser(user)){
                }else{
                    riwayatPeminjaman.add(peminjaman);
                }
            }
        }

        return riwayatPeminjaman;
    }
}
