package propensi.b04.siperpus.restservice;

import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.repository.BukuDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propensi.b04.siperpus.rest.BukuDTO;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class BukuRestServiceImpl implements BukuRestService{
    @Autowired
    BukuDB bukuDB;

    @Override
    public List<BukuModel> getListBuku(String namaBuku) {
        if (namaBuku.equals("")){
            return bukuDB.findAll();
        }
        return bukuDB.findByFilterTitle(namaBuku);
    }

    @Override
    public BukuModel getBukuById(Long id) {
        return bukuDB.findById(id).get();
    }

    @Override
    public void deleteBuku(Long id) {
        bukuDB.deleteById(id);
    }

    @Override
    public BukuModel createBuku(BukuDTO buku) {
        BukuModel newBuku = buku.convertToBuku();
        return bukuDB.save(newBuku);
    }

    @Override
    public BukuModel updateBuku(BukuDTO bukuDTO, Long id) {
        BukuModel buku = getBukuById(id);
        buku = bukuDTO.convertToBuku(buku);
        Integer jmlPeminjamanAktif = bukuDB.countPeminjamanAktif(buku.getIdBuku());
        buku.setJml_tersedia(bukuDTO.stok - jmlPeminjamanAktif);
        return bukuDB.save(buku);
    }

    @Override
    public int getTotalBuku(){
        return bukuDB.findAll().size();
    }

    @Override
    public Map<String, Integer> getPersentaseKategori(){
        Map<String, Integer> result = new HashMap<String, Integer>();

        for (BukuModel buku: bukuDB.findAll()) {
            if (result.containsKey(buku.getKategoriBuku())) {
                result.put(buku.getKategoriBuku(), result.get(buku.getKategoriBuku()) + 1);
            }
            else {
                result.put(buku.getKategoriBuku(), 1);
            }
        }
        return result;
    }
}
