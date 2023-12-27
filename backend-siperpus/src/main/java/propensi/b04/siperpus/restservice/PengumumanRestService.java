package propensi.b04.siperpus.restservice;

import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.PengumumanModel;
import propensi.b04.siperpus.rest.BukuDTO;
import propensi.b04.siperpus.rest.PengumumanDTO;

import java.util.List;

public interface PengumumanRestService {
    PengumumanModel createPengumuman(PengumumanDTO pengumuman);
    List<PengumumanModel> getListPengumuman();
    void deletePengumuman(Long idPengumuman);
    PengumumanModel updatePengumuman(PengumumanDTO pengumumanDTO, Long idPengumuman);
}
