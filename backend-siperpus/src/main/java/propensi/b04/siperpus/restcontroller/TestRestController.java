package propensi.b04.siperpus.restcontroller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/test")
public class TestRestController {
    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('KEPALA') or hasRole('STAFF') or hasRole('PENGGUNA')")
    public String userAccess() {
        return "User Content.";
    }

    @GetMapping("/kepala")
    @PreAuthorize("hasRole('KEPALA')")
    public String kepalaAccess() {
        return "Kepala Board.";
    }

    @GetMapping("/staff")
    @PreAuthorize("hasRole('STAFF')")
    public String staffAccess() {
        return "Staff Board.";
    }

    @GetMapping("/pengguna")
    @PreAuthorize("hasRole('PENGGUNA')")
    public String penggunaAccess() {
        return "Pengguna Board.";
    }
}
