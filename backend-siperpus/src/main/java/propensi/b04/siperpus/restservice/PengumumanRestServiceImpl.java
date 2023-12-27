package propensi.b04.siperpus.restservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import propensi.b04.siperpus.model.AbsenModel;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.PengumumanModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.repository.PengumumanDB;
import propensi.b04.siperpus.repository.UserDB;
import propensi.b04.siperpus.rest.BukuDTO;
import propensi.b04.siperpus.rest.PengumumanDTO;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PengumumanRestServiceImpl implements PengumumanRestService{
    @Autowired
    PengumumanDB pengumumanDB;

    @Autowired
    UserDB userDB;

    @Override
    public List<PengumumanModel> getListPengumuman(){ return pengumumanDB.findAll(); }

    @Override
    public PengumumanModel createPengumuman(PengumumanDTO pengumuman) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();
        UserModel user = userDB.findByUsername(username).get();

        PengumumanModel newPengumuman = new PengumumanModel();
        newPengumuman.setSubjekPengumuman(pengumuman.subjekPengumuman);
        newPengumuman.setTglPengumuman(pengumuman.tglPengumuman);
        newPengumuman.setIsiPengumuman(pengumuman.isiPengumuman);
        newPengumuman.setUser(user);
        return pengumumanDB.save(newPengumuman);
    }

    @Override
    public void deletePengumuman(Long idPengumuman) {
        pengumumanDB.deleteById(idPengumuman);
    }

    @Override
    public PengumumanModel updatePengumuman(PengumumanDTO pengumumanDTO, Long idPengumuman) {
        PengumumanModel pengumuman = pengumumanDB.findById(idPengumuman).get();
        pengumuman.setSubjekPengumuman(pengumumanDTO.subjekPengumuman);
        pengumuman.setTglPengumuman(pengumumanDTO.tglPengumuman);
        pengumuman.setIsiPengumuman(pengumumanDTO.isiPengumuman);
        return pengumumanDB.save(pengumuman);
    }
}
