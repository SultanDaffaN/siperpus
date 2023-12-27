package propensi.b04.siperpus.rest;

import propensi.b04.siperpus.model.BukuModel;

public class BukuDTO {
    public String namaBuku;
    public String penulisBuku;
    public Integer tahunBuku;
    public String penerbitBuku;
    public String kategoriBuku;
    public String statusBuku;
    public String gambarBuku;
    public Integer stok;
    public String deskripsi;

    public BukuModel convertToBuku(){
        BukuModel buku = new BukuModel();
        buku.setNamaBuku(namaBuku);
        buku.setPenulisBuku(penulisBuku);
        buku.setTahunBuku(tahunBuku);
        buku.setPenerbitBuku(penerbitBuku);
        buku.setKategoriBuku(kategoriBuku);
        buku.setStatusBuku(statusBuku);
        buku.setGambarBuku(gambarBuku);
        buku.setStok(stok);
        buku.setJml_tersedia(stok);
        buku.setDeskripsi(deskripsi);

        return buku;
    }

    public BukuModel convertToBuku(BukuModel buku) {
        buku.setNamaBuku(namaBuku);
        buku.setPenulisBuku(penulisBuku);
        buku.setTahunBuku(tahunBuku);
        buku.setPenerbitBuku(penerbitBuku);
        buku.setKategoriBuku(kategoriBuku);
        buku.setStatusBuku(statusBuku);
        buku.setGambarBuku(gambarBuku);
        buku.setStok(stok);
        buku.setDeskripsi(deskripsi);

        return buku;
    }

}
