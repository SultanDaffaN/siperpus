import './App.css';
import {Routes, Route} from 'react-router-dom';
import React, { Component } from "react";
import Navbar from './components/navbar';

import Login from "./pages/login";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Buku from './pages/buku';
import Register from './pages/register';
import ManageStaff from './pages/manage-staff';
import ManagePengguna from './pages/manage-pengguna';
import FormPeminjaman from './pages/form-peminjaman';
import Page403 from './pages/page-403';
import BukuDipinjam from './pages/daftar-buku-dipinjam';
import FormTambahBuku from './pages/form-tambah-buku';
import UbahBukuWithParam from './pages/form-ubah-buku';
import DetailBukuWithParam from './pages/detailbuku';
import Benchmark from './pages/benchmark';
import DaftarPeminjamanBuku from './pages/daftar-peminjaman-buku';
import DaftarAbsen from "./pages/daftar-absen";
import FormInputAbsen from "./pages/form-input-absen";
import DaftarPeminjam from './pages/daftar-peminjam';
import DetailPeminjamWithParam from "./pages/detail-peminjam";

import CreatePengumuman from "./pages/form-create-pengumuman";
import DaftarPengumuman from "./pages/daftar-pengumuman";

import DashboardPengguna from "./pages/dashboard-pengguna";
import FormUlasanWithParam from './pages/form-ulasan';
import Footer from './components/footer';
import DaftarPengumumanFull from "./pages/daftar-pengumuman-full";

class App extends Component {
  render() {
    return (
      <>
      <Navbar />
      <div className="flex flex-col h-screen">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/buku/:idBuku" element={<DetailBukuWithParam/>} />
          <Route path="/buku" element={<Buku/>} />
          <Route path="/users/staff" element={<ManageStaff/>} />
          <Route path="/users/pengguna" element={<ManagePengguna/>} />
          <Route path="/forbidden" element={<Page403/>} />
          <Route path="/tambah-buku" element={<FormTambahBuku/>} />
          <Route path="/buku/ubah/:idBuku" element={<UbahBukuWithParam/>} />
          <Route path="/peminjaman/tambah" element={<FormPeminjaman/>} />
          <Route path="/user/peminjaman" element={<BukuDipinjam/>} />
          <Route path="/benchmark" element={<Benchmark />} />
          <Route path="/peminjaman/buku" element={<DaftarPeminjamanBuku />} />
          <Route path="/absensi" element={<DaftarAbsen />} />
          <Route path="/peminjaman/peminjam" element={<DaftarPeminjam />} />
          <Route path="/peminjam/:idPeminjam" element={<DetailPeminjamWithParam/>} />
          <Route path="/absensi" element={<DaftarAbsen/>} />

          <Route path="/tambah-pengumuman" element={<CreatePengumuman/>} />
          <Route path="/pengumuman" element={<DaftarPengumuman/>} />
          <Route path="/pengumuman-all" element={<DaftarPengumumanFull/>} />

          <Route path="/dashboard" element={<DashboardPengguna/>} />

          <Route path="/ulasan/:idBuku" element={<FormUlasanWithParam/>} />
        </Routes>

        <Footer />
      </div>
      </>
    );
  }
}



export default App;
