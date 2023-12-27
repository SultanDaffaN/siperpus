package propensi.b04.siperpus.restservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.UlasanModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.repository.UlasanDB;
import propensi.b04.siperpus.repository.UserDB;
import propensi.b04.siperpus.rest.UlasanDTO;

import javax.transaction.Transactional;

@Service
@Transactional
public class UlasanRestServiceImpl implements UlasanRestService{
    @Autowired
    UlasanDB ulasanDB;

    @Autowired
    UserDB userDB;

    @Autowired
    BukuRestService bukuRestService;

    @Override
    public UlasanModel createUlasan(UlasanDTO ulasan, Long idBuku) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();
        UserModel user = userDB.findByUsername(username).get();

        BukuModel buku = bukuRestService.getBukuById(idBuku);

        UlasanModel newUlasan = new UlasanModel();
        newUlasan.setIsiUlasan(ulasan.isiUlasan);
        newUlasan.setUser(user);
        newUlasan.setBuku(buku);
        return ulasanDB.save(newUlasan);
    }
}
