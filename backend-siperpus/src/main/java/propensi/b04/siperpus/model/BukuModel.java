package propensi.b04.siperpus.model;

import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;




import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter @Getter
@Entity
@Table(name = "buku")
public class BukuModel  implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBuku;

    @NotNull
    @Size(max = 255)
    @Column(name="nama", nullable = false)
    private String namaBuku;

    @NotNull
    @Size(max = 255)
    @Column(name="penulis", nullable = false)
    private String penulisBuku;

    @NotNull
    @Column(name="tahun", nullable = false)
    private Integer tahunBuku;

    @NotNull
    @Size(max = 255)
    @Column(name="penerbit", nullable = false)
    private String penerbitBuku;

    @NotNull
    @Size(max = 255)
    @Column(name="kategori", nullable = false)
    private String kategoriBuku;

    @NotNull
    @Size(max = 255)
    @Column(name="status", nullable = false)
    private String statusBuku;

    @NotNull
    @Size(max = 255)
    @Column(name="gambar", nullable = false)
    private String gambarBuku;

    @NotNull
    @Column(name="deskripsi", nullable = false)
    private String deskripsi;

    @NotNull
    @Column(name="stok", nullable = false)
    private Integer stok;

    @NotNull
    @Column(name="jml_tersedia", nullable = false)
    private Integer jml_tersedia;

    // Relasi dengan PeminjamanModel
    @OneToMany(mappedBy = "buku", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("buku")
    private List<PeminjamanModel> listPeminjaman;

    // Relasi dengan UlasanModel
    @OneToMany(mappedBy = "buku", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("buku")
    private List<UlasanModel> listUlasan;

    // Relasi dengan ReservasiModel
    @OneToMany(mappedBy = "buku", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("buku")
    private List<ReservasiModel> listReservasi;
}
