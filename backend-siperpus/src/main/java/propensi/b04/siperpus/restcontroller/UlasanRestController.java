package propensi.b04.siperpus.restcontroller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.UlasanModel;
import propensi.b04.siperpus.rest.BaseResponse;
import propensi.b04.siperpus.rest.BukuDTO;
import propensi.b04.siperpus.rest.UlasanDTO;
import propensi.b04.siperpus.restservice.UlasanRestService;

import javax.validation.Valid;
import java.text.ParseException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/ulasan")
public class UlasanRestController {
    @Autowired
    private UlasanRestService ulasanRestService;

    @PostMapping(value = "/{idBuku}")
    @PreAuthorize("hasRole('PENGGUNA')")
    public BaseResponse<UlasanModel> addUlasan(
            @Valid @RequestBody UlasanDTO ulasanDTO,
            @PathVariable(value = "idBuku") Long idBuku,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<UlasanModel> response = new BaseResponse<>();
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            try {
                UlasanModel newUlasan = ulasanRestService.createUlasan(ulasanDTO, idBuku);
                response.setStatus(201);
                response.setMessage("Ulasan has been Created!");
                response.setResult(newUlasan);
            } catch (Exception e) {
                response.setStatus(400);
                response.setMessage(e.toString());
                response.setResult(null);
            }
            return response;
        }
    }
}
