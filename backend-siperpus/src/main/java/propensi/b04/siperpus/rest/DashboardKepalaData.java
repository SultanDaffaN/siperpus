package propensi.b04.siperpus.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DashboardKepalaData {
    private int totalBuku;
    private int bukuDipinjam;
    private int bukuTerlambat;
    private int dendaTerkumpul;
    private int dendaBlmTerbayar;
    private int pengunjungBulanan;
    private int totalStaff;
    private int totalPengguna;
}
