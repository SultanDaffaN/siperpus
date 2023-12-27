package propensi.b04.siperpus.restcontroller;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.access.prepost.PreAuthorize;
import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.rest.BaseResponse;
import propensi.b04.siperpus.rest.BukuDTO;
import propensi.b04.siperpus.restservice.BukuRestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import javax.enterprise.inject.Produces;
import javax.validation.Valid;
import java.text.ParseException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/books")
public class BukuRestController {
    @Autowired
    private BukuRestService bukuRestService;

    @GetMapping()
    public BaseResponse<List<BukuModel>> getAllBuku(@RequestParam(value = "nama", defaultValue = "") String namaBuku){
        BaseResponse<List<BukuModel>> response = new BaseResponse<>();
        response.setStatus(200);
        response.setMessage("success");
        response.setResult(bukuRestService.getListBuku(namaBuku));

        return response;
    }

    @GetMapping(value = "/{id}")
    public BaseResponse<BukuModel> getBukuById(@PathVariable("id") Long idBuku) {
        BaseResponse<BukuModel> response = new BaseResponse<>();
        try {
            BukuModel buku = bukuRestService.getBukuById(idBuku);
            response.setStatus(200);
            response.setMessage("success");
            response.setResult(buku);
        } catch (Exception e) {
            response.setStatus(400);
            response.setMessage(e.toString());
            response.setResult(null);
        }
        return response;
    }

    @PostMapping(value = "")
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<BukuModel> addBuku(
            @Valid @RequestBody BukuDTO buku,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<BukuModel> response = new BaseResponse<>();
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            try {
                BukuModel newBuku = bukuRestService.createBuku(buku);
                response.setStatus(201);
                response.setMessage("created");
                response.setResult(newBuku);
            } catch (Exception e) {
                response.setStatus(400);
                response.setMessage(e.toString());
                response.setResult(null);
            }
            return response;
        }
    }

    @PutMapping(value = "/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public BaseResponse<BukuModel> updateBuku(
            @Valid @RequestBody BukuDTO buku,
            @PathVariable(value = "id") Long id,
            BindingResult bindingResult) throws ParseException {
        BaseResponse<BukuModel> response = new BaseResponse<>();
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            try {
                BukuModel newBuku = bukuRestService.updateBuku(buku, id);
                response.setStatus(200);
                response.setMessage("updated");
                response.setResult(newBuku);
            } catch (Exception e) {
                response.setStatus(400);
                response.setMessage(e.toString());
                response.setResult(null);
            }
            return response;
        }
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<String> deleteBuku(@PathVariable("id") Long idBuku) {
        try {
            bukuRestService.deleteBuku(idBuku);
            return ResponseEntity.ok("Buku with id " + String.valueOf(idBuku) + " Deleted!");
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Buku with id " + String.valueOf(idBuku) + " Not Found.");
        }
    }
}
