package propensi.b04.siperpus.restcontroller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propensi.b04.siperpus.model.ReservasiModel;
import propensi.b04.siperpus.rest.BaseResponse;
import propensi.b04.siperpus.rest.ReservasiDTO;
import propensi.b04.siperpus.restservice.ReservasiRestService;

import javax.validation.Valid;
import java.text.ParseException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/reservasi")
public class ReservasiRestController {
    @Autowired
    private ReservasiRestService reservasiRestService;

    @PostMapping(value = "")
    @PreAuthorize("hasRole('PENGGUNA')")
    public BaseResponse<ReservasiModel> addReservasi(
            @Valid @RequestBody ReservasiDTO reservasi,
            BindingResult bindingResult) throws ParseException {

        BaseResponse<ReservasiModel> response = new BaseResponse<>();
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();

        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request Body has invalid type or missing field");
        } else {
            try {
                ReservasiModel newReservasi = reservasiRestService.createReservasi(reservasi, username);
                response.setStatus(201);
                response.setMessage("created");
                response.setResult(newReservasi);
            } catch (Exception e) {
                response.setStatus(400);
                response.setMessage(e.toString());
                response.setResult(null);
            }
            return response;
        }
    }
}
