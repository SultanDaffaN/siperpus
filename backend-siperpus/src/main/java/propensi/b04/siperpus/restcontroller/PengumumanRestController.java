package propensi.b04.siperpus.restcontroller;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propensi.b04.siperpus.model.AbsenModel;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.PengumumanModel;
import propensi.b04.siperpus.rest.AbsenDTO;
import propensi.b04.siperpus.rest.BaseResponse;
import propensi.b04.siperpus.rest.BukuDTO;
import propensi.b04.siperpus.rest.PengumumanDTO;
import propensi.b04.siperpus.restservice.PengumumanRestService;
import propensi.b04.siperpus.restservice.UserRestService;

import javax.validation.Valid;
import java.text.ParseException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/pengumuman")
public class PengumumanRestController {
    @Autowired
    private PengumumanRestService pengumumanRestService;

    @Autowired
    private UserRestService userRestService;

    @GetMapping()
    public BaseResponse<List<PengumumanModel>> getAllPengumuman(){
        BaseResponse<List<PengumumanModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(pengumumanRestService.getListPengumuman());

        return response;
    }

    @PostMapping(value = "")
    @PreAuthorize("hasRole('KEPALA')")
    public BaseResponse<PengumumanModel> addPengumuman(
            @Valid @RequestBody PengumumanDTO pengumuman,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<PengumumanModel> response = new BaseResponse<>();
        try {
            PengumumanModel newPengumuman = pengumumanRestService.createPengumuman(pengumuman);
            response.setStatus(201);
            response.setMessage("Pengumuman Created!");
            response.setResult(newPengumuman);
        } catch (Exception e) {
            response.setStatus(400);
            response.setMessage(e.toString());
            response.setResult(null);
        }
        return response;
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('KEPALA')")
    public ResponseEntity<String> deletePengumuman(@PathVariable("id") Long idPengumuman) {
        try {
            pengumumanRestService.deletePengumuman(idPengumuman);
            return ResponseEntity.ok("Pengumuman with id " + String.valueOf(idPengumuman) + " Deleted!");
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Pengumuman with id " + String.valueOf(idPengumuman) + " Not Found.");
        }
    }

    @PutMapping(value = "/{id}")
    @PreAuthorize("hasRole('KEPALA')")
    public BaseResponse<PengumumanModel> updatePengumuman(
            @Valid @RequestBody PengumumanDTO pengumumanDTO,
            @PathVariable(value = "id") Long idPengumuman,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<PengumumanModel> response = new BaseResponse<>();
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            try {
                PengumumanModel updatedPengumuman = pengumumanRestService.updatePengumuman(pengumumanDTO, idPengumuman);
                response.setStatus(200);
                response.setMessage("Pengumuman Updated!");
                response.setResult(updatedPengumuman);
            } catch (Exception e) {
                response.setStatus(400);
                response.setMessage(e.toString());
                response.setResult(null);
            }
            return response;
        }
    }
}

