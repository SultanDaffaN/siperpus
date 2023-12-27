package propensi.b04.siperpus.restcontroller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propensi.b04.siperpus.model.AbsenModel;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.rest.AbsenDTO;
import propensi.b04.siperpus.rest.BaseResponse;
import propensi.b04.siperpus.restservice.AbsenRestService;
import propensi.b04.siperpus.restservice.UserRestService;

import javax.validation.Valid;
import java.text.ParseException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/absen")
public class AbsenRestController {
    @Autowired
    private AbsenRestService absenRestService;

    @Autowired
    private UserRestService userRestService;

    @GetMapping()
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<List<AbsenModel>> getAllAbsen(){
        BaseResponse<List<AbsenModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(absenRestService.getListAbsen());

        return response;
    }

    @GetMapping(value = "/{tgl}")
    public BaseResponse<List<AbsenModel>> getAllAbsenByTgl(@PathVariable("tgl") String tgl) {
        BaseResponse<List<AbsenModel>> response = new BaseResponse<>();
        try {
            List<AbsenModel> lstAbsen = absenRestService.getListAbsenByTgl(tgl);
            response.setStatus(200);
            response.setMessage("success");
            response.setResult(lstAbsen);
        } catch (Exception e) {
            response.setStatus(400);
            response.setMessage(e.toString());
            response.setResult(null);
        }
        return response;
    }

    @PostMapping(value = "")
    @PreAuthorize("hasRole('PENGUNJUNG')")
    public BaseResponse<AbsenModel> addAbsen(
            @Valid @RequestBody AbsenDTO absen,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<AbsenModel> response = new BaseResponse<>();
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            if(!userRestService.userExists(absen.username)){
                response.setStatus(400);
                response.setMessage("Username doesn't exist");
                response.setResult(null);
            }
            else {
                try {
                    AbsenModel newAbsen = absenRestService.createAbsen(absen);
                    response.setStatus(201);
                    response.setMessage("created");
                    response.setResult(newAbsen);
                } catch (Exception e) {
                    response.setStatus(400);
                    response.setMessage(e.toString());
                    response.setResult(null);
                }
            }
            return response;
        }
    }
}
