package propensi.b04.siperpus.restservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.util.DateUtils;
import propensi.b04.siperpus.model.AbsenModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.repository.AbsenDB;
import propensi.b04.siperpus.repository.UserDB;
import propensi.b04.siperpus.rest.AbsenDTO;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class AbsenRestServiceImpl implements AbsenRestService{
    @Autowired
    AbsenDB absenDB;

    @Autowired
    UserDB userDB;

    @Override
    public List<AbsenModel> getListAbsen(){ return absenDB.findAll(); }

    @Override
    public List<AbsenModel> getListAbsenByTgl(String date){
        List<AbsenModel> absenPerTgl = new ArrayList<AbsenModel>();
        LocalDate dateRequest = LocalDate.parse(date);

        for (AbsenModel absen: absenDB.findAll()) {
            if (absen.getWaktuAbsen().toLocalDate().equals(dateRequest)){
                absenPerTgl.add(absen);
            }
        }

        return absenPerTgl;
    }

    @Override
    public int getTotalAbsenBulanan(){
        return getAbsenHarianPerBulan().stream().mapToInt(Integer::intValue).sum();
    }

    @Override
    public List<Integer> getAbsenHarianPerBulan(){
        Date date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        int month = localDate.getMonthValue();
        int today = localDate.getDayOfMonth();

        List<Integer> result = new ArrayList<>();

        // Pengelompokkan berdasarkan Bulan
        String monthStr;
        List<AbsenModel> absenBulanan = new ArrayList<AbsenModel>();

        if (month < 10) {
            monthStr = "0";
            monthStr += Integer.toString(month);
        }
        else {
            monthStr = Integer.toString(month);
        }

        for (AbsenModel absen: absenDB.findAll()) {
            if (absen.getWaktuAbsen().toString().substring(5,7).equals(monthStr)){
                absenBulanan.add(absen);
            }
        }

        // Pengelompokkan berdasarkan hari
        for (int i = 1; i <= today; i++) {
            String dayStr;
            int totalAbsensi = 0;

            if (i < 10) {
                dayStr = "0";
                dayStr += Integer.toString(i);
            }
            else {
                dayStr = Integer.toString(i);
            }

            for (AbsenModel absen: absenBulanan) {
                if (absen.getWaktuAbsen().toString().substring(8,10).equals(dayStr)){
                    totalAbsensi += 1;
                }
            }

            result.add(totalAbsensi);
        }

        return result;
    }

    @Override
    public AbsenModel createAbsen(AbsenDTO absen) {
        UserModel user = userDB.findByUsername(absen.username).get();

        AbsenModel newAbsen = new AbsenModel();
        LocalDateTime now = LocalDateTime.now();
        newAbsen.setWaktuAbsen(now.plusHours(7));
        newAbsen.setUser(user);
        return absenDB.save(newAbsen);
    }
}
