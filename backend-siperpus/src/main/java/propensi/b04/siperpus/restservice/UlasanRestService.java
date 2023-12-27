package propensi.b04.siperpus.restservice;

import propensi.b04.siperpus.model.UlasanModel;
import propensi.b04.siperpus.rest.UlasanDTO;

public interface UlasanRestService {
    UlasanModel createUlasan(UlasanDTO ulasan, Long idBuku);
}
