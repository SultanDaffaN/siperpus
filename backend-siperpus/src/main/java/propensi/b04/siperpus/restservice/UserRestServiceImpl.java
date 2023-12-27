package propensi.b04.siperpus.restservice;

import propensi.b04.siperpus.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propensi.b04.siperpus.repository.RoleDB;
import propensi.b04.siperpus.repository.UserDB;
import propensi.b04.siperpus.rest.DendaDTO;
import propensi.b04.siperpus.rest.UserDTO;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;

import static java.time.temporal.ChronoUnit.DAYS;
import static org.apache.commons.lang3.text.WordUtils.capitalizeFully;

@Service
@Transactional
public class UserRestServiceImpl implements UserRestService{
    @Autowired
    UserDB userDB;

    @Autowired
    RoleDB roleDB;

    @Override
    public UserModel getUserByUsername(String username) {
        return userDB.findByUsername(username).get();
    }

    @Override
    public UserModel getUserById(Long id) { return userDB.findById(id).get(); }

    @Override
    public UserModel activateUser(UserDTO userDTO, Long id) {
        UserModel user = getUserById(id);
        user = userDTO.activateUser(user);
        return userDB.save(user);
    }

    @Override
    public List<UserModel> getAllStaff() {
        List<UserModel> listUser = userDB.findAll();
        List<UserModel> listStaff = new ArrayList<>();

        for (UserModel user: listUser) {
            if (user.getRoles().contains(roleDB.findByName(ERole.ROLE_STAFF).get())){
                listStaff.add(user);
            }
        }
        return listStaff;
    }

    @Override
    public List<UserModel> getAllPengguna() {
        List<UserModel> listUser = userDB.findAll();
        List<UserModel> listPengguna = new ArrayList<>();

        for (UserModel user: listUser) {
            if (user.getRoles().contains(roleDB.findByName(ERole.ROLE_PENGGUNA).get())){
                listPengguna.add(user);
            }
        }
        return listPengguna;
    }

    @Override
    public int getTotalStaff(){
        return getAllStaff().size();
    }

    @Override
    public int getTotalPengguna(){
        return getAllPengguna().size();
    }

    @Override
    public int getDendaTerkumpul(){
        int dendaTerkumpul = 0;

        for (UserModel user: getAllPengguna()) {
            dendaTerkumpul += user.getPaidDenda();
        }

        return dendaTerkumpul;
    }

    @Override
    public int getDendaBlmTerbayar(){
        int dendaBlmTerbayar = 0;

        for (UserModel user: getAllPengguna()) {
            dendaBlmTerbayar += user.getUnpaidDenda();
        }

        return dendaBlmTerbayar;
    }

    @Override
    public List<Map<String, Object>> getAllBorrowedBook(String username) {
        UserModel user = userDB.findByUsername(username).get();

        List<Map<String, Object>> peminjamanPengguna = new ArrayList<>();

        List<PeminjamanModel> listPeminjaman = user.getListPeminjaman();
        long nomor = 0;

        for(PeminjamanModel peminjaman : listPeminjaman){
            if (peminjaman.getTglPengembalian() != null){
                HashMap<String, Object> result = new HashMap<>();
                nomor++;
                Long idPeminjaman = peminjaman.getIdPeminjaman();
                Long idBuku = peminjaman.getBuku().getIdBuku();
                String judulBuku = peminjaman.getBuku().getNamaBuku();
                String status = "";
                long denda = 0;
                LocalDate batasPengembalian = peminjaman.getTglPeminjaman().plusDays(14);
                LocalDate now = LocalDate.now();
                if(now.isEqual(batasPengembalian)){
                    status = "Perlu Dikembalikan";
                }else if (now.isBefore(batasPengembalian)){
                    long sisaHari = DAYS.between(batasPengembalian, now);
                    status = "Tersisa " + Math.abs(sisaHari) + " hari";
                }else{
                    status = "Terlambat";
                    long telatHari = DAYS.between(now, batasPengembalian);
                    denda = Math.abs(2000*telatHari);
                }

                String batasPengembalianString = Integer.toString(batasPengembalian.getDayOfMonth()) + ' ' + capitalizeFully(batasPengembalian.getMonth().toString()) + ' ' + batasPengembalian.getYear();

                result.put("idPeminjaman", idPeminjaman);
                result.put("idBuku", idBuku);
                result.put("nomor", nomor);
                result.put("judulBuku", judulBuku);
                result.put("batasPengembalian", batasPengembalianString);
                result.put("status", status);
                result.put("denda", denda);

                peminjamanPengguna.add(result);
            }
        }

        return peminjamanPengguna;

    }

    @Override
    public void deleteUser(Long id) {
        userDB.deleteById(id);
    }

    @Override
    public Boolean userExists(String username){
        return userDB.existsByUsername(username);
    }

    @Override
    public UserModel bayarDendaUser(Long id, DendaDTO dendaDTO) {
        UserModel user = getUserById(id);
        user.setPaidDenda(user.getPaidDenda() + dendaDTO.bayarDenda);

        // Kalkulasi unpaid denda
        Integer tempDendaUser = 0;
        for (PeminjamanModel peminjaman: user.getListPeminjaman()) {
            tempDendaUser += peminjaman.getDenda();
        }
        tempDendaUser = tempDendaUser - user.getUnpaidDenda();
        user.setUnpaidDenda(user.getUnpaidDenda() + tempDendaUser - user.getPaidDenda());

        return userDB.save(user);
    }

}
