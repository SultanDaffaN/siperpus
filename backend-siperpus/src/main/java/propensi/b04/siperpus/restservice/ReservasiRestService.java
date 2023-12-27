package propensi.b04.siperpus.restservice;

import propensi.b04.siperpus.model.ReservasiModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.rest.ReservasiDTO;

import java.util.List;

public interface ReservasiRestService {
    ReservasiModel createReservasi(ReservasiDTO reservasiDTO, String username);
    List<ReservasiModel> getListReservasiByUser(String username);
}
