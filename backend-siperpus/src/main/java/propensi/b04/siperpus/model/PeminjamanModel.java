package propensi.b04.siperpus.model;

import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;




import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Setter @Getter
@Entity
@Table(name = "peminjaman")
public class PeminjamanModel  implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPeminjaman;

    @NotNull
    @JsonFormat(pattern="dd/MM/yyyy")
    @Column(name = "tgl_peminjaman", nullable = false)
    private LocalDate tglPeminjaman;

    @NotNull
    @JsonFormat(pattern="dd/MM/yyyy")
    @Column(name = "batas_pengembalian", nullable = false)
    private LocalDate batasPengembalian;

    @JsonFormat(pattern="dd/MM/yyyy")
    @Column(name = "tgl_pengembalian")
    private LocalDate tglPengembalian;

    @NotNull
    @Column(name = "denda", nullable = false)
    private Integer denda = 0;

    // Relasi dengan UserModel
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idUser", referencedColumnName = "id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer","handler"})
    private UserModel user;

    // Relasi dengan BukuModel
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idBuku", referencedColumnName = "idBuku", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = {"listPeminjaman","hibernateLazyInitializer","handler"})
    private BukuModel buku;

}
