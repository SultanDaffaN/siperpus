package propensi.b04.siperpus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.*;

@Entity
@Setter
@Getter
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String username;

    @NotBlank
    @Size(max = 120)
    private String name;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @NotBlank
    private String status = "Menunggu";

    @NotBlank
    @Size(max = 20)
    private String nisn;

    private Integer unpaidDenda = 0;

    private Integer paidDenda = 0;

    // Relasi dengan PeminjamanModel
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<PeminjamanModel> listPeminjaman;

    // Relasi dengan AbsenModel
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AbsenModel> listAbsen;

    // Relasi dengan UlasanModel
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<UlasanModel> listUlasan;

    // Relasi dengan PengumumanModel
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<PengumumanModel> listPengumuman;

    // Relasi dengan ReservasiModel
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReservasiModel> listReservasi;

    // Relasi dengan RoleModel
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(  name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<RoleModel> roles = new HashSet<>();

    public UserModel() {
    }

    public UserModel(String name, String nisn, String username, String email, String password) {
        this.name = name;
        this.nisn = nisn;
        this.username = username;
        this.email = email;
        this.password = password;
    }

//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getName() { return name; }
//
//    public void setName(String name) { this.name = name; }
//
//    public String getNisn() { return nisn; }
//
//    public void setNisn(String nisn) { this.nisn = nisn; }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getStatus() { return status; }
//
//    public void setStatus(String status) { this.status = status; }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    public Set<RoleModel> getRoles() {
//        return roles;
//    }
//
//    public void setRoles(Set<RoleModel> roles) {
//        this.roles = roles;
//    }
}

