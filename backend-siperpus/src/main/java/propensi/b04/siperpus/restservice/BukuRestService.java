package propensi.b04.siperpus.restservice;

import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.rest.BukuDTO;

import java.util.List;
import java.util.Map;

public interface BukuRestService {
    List<BukuModel> getListBuku(String namaBuku);
    BukuModel getBukuById(Long id);
    BukuModel createBuku(BukuDTO buku);
    BukuModel updateBuku(BukuDTO buku, Long id);
    void deleteBuku(Long id);
    int getTotalBuku();
    Map<String, Integer> getPersentaseKategori();
}
