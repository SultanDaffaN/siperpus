package propensi.b04.siperpus.restcontroller;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import propensi.b04.siperpus.model.ERole;
import propensi.b04.siperpus.model.RoleModel;
import propensi.b04.siperpus.model.UserModel;
import propensi.b04.siperpus.payload.request.LoginRequest;
import propensi.b04.siperpus.payload.request.SignupRequest;
import propensi.b04.siperpus.payload.response.JwtResponse;
import propensi.b04.siperpus.payload.response.MessageResponse;
import propensi.b04.siperpus.repository.RoleDB;
import propensi.b04.siperpus.repository.UserDB;
import propensi.b04.siperpus.restservice.UserRestService;
import propensi.b04.siperpus.security.jwt.JwtUtils;
import propensi.b04.siperpus.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthRestController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserDB userDB;

    @Autowired
    RoleDB roleDB;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRestService userRestService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        UserModel user = userRestService.getUserByUsername(loginRequest.getUsername());
        if (user.getStatus().equals("Aktif")){

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    userDetails.getName(),
                    userDetails.getNisn(),
                    roles));
        }

        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("User must be Activate!"));

    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userDB.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Username is already taken!"));
        }

        if (userDB.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email is already in use!"));
        }

        // Create new user's account
        UserModel user = new UserModel(signUpRequest.getName(),
                signUpRequest.getNisn(),
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<RoleModel> roles = new HashSet<>();

        if (strRoles == null) {
            RoleModel userRole = roleDB.findByName(ERole.ROLE_PENGGUNA)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "kepala":
                        RoleModel kepalaRole = roleDB.findByName(ERole.ROLE_KEPALA)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        user.setStatus("Aktif");
                        roles.add(kepalaRole);

                        break;
                    case "staff":
                        RoleModel staffRole = roleDB.findByName(ERole.ROLE_STAFF)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(staffRole);

                        break;

                    case "pengunjung":
                        RoleModel pengunjungRole = roleDB.findByName(ERole.ROLE_PENGUNJUNG)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(pengunjungRole);

                        break;
                    default:
                        RoleModel penggunaRole = roleDB.findByName(ERole.ROLE_PENGGUNA)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(penggunaRole);
                }
            });
        }

        user.setRoles(roles);
        userDB.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
