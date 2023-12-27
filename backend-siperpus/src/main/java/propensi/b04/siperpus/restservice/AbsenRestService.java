package propensi.b04.siperpus.restservice;

import propensi.b04.siperpus.model.AbsenModel;
import propensi.b04.siperpus.rest.AbsenDTO;

import java.util.List;

public interface AbsenRestService {
    AbsenModel createAbsen(AbsenDTO absen);
    List<AbsenModel> getListAbsen();
    List<AbsenModel> getListAbsenByTgl(String tgl);
    int getTotalAbsenBulanan();
    List<Integer> getAbsenHarianPerBulan();
}
