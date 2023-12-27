package propensi.b04.siperpus.model;

import com.fasterxml.jackson.annotation.JsonFormat;
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

@AllArgsConstructor
@NoArgsConstructor
@Setter @Getter
@Entity
@Table(name = "pengumuman")
public class PengumumanModel  implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPengumuman;

    @NotNull
    @Size(max = 500)
    @Column(name="subjek", nullable = false)
    private String subjekPengumuman;

    @NotNull
    @JsonFormat(pattern="dd/MM/yyyy")
    @Column(name = "tgl_pengumuman", nullable = false)
    private LocalDate tglPengumuman;

    @NotNull
    @Size(max = 5000)
    @Column(name="isi", nullable = false)
    private String isiPengumuman;

    // Relasi dengan UserModel
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idUser", referencedColumnName = "id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserModel user;

}
