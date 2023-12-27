import React, { Component } from "react";

import APIConfig from "../api/APIConfig";
import AuthService from "../services/auth-service";
import { Navigate, NavLink } from "react-router-dom";
import dateFormat from "dateformat";
import ConfTerimaBuku from "../components/confTerimaBuku";
import ConfTerimaBukuBerdenda from "../components/confTerimaBukuBerdenda";
import Popup from "../components/popup";
import Loading from "../components/loading";
import searchIcon from "../pictures/searchIcon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownShortWide, faArrowUpShortWide, faCoffee, faPlus } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { SearchIcon } from "@heroicons/react/outline";


export default class DaftarPeminjamanBuku extends Component {
  constructor(props) {
    super(props);
    this.checkAuthorize = this.checkAuthorize.bind(this);
    this.getPeminjamanData = this.getPeminjamanData.bind(this);
    this.ubahFormatDate = this.ubahFormatDate.bind(this);
    this.handleButtonTerimaBuku = this.handleButtonTerimaBuku.bind(this);
    this.handleConfTerimaBuku = this.handleConfTerimaBuku.bind(this);
    this.handleConfTerimaBukuBerdenda = this.handleConfTerimaBukuBerdenda.bind(this);
    this.getCurrentDate = this.getCurrentDate.bind(this);
    this.handlePengembalianBuku = this.handlePengembalianBuku.bind(this);
    this.handlePembayaranUser = this.handlePembayaranUser.bind(this);
    this.handleXSuccessBuku = this.handleXSuccessBuku.bind(this);
    this.handleXSuccessDenda = this.handleXSuccessDenda.bind(this);
    this.onChangeSortBy = this.onChangeSortBy.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSortByJudulBuku = this.handleSortByJudulBuku.bind(this);
    this.handleSortByPeminjam = this.handleSortByPeminjam.bind(this);
    this.handleSortByTglPeminjaman = this.handleSortByTglPeminjaman.bind(this);
    this.handleSortByBatasPengembalian = this.handleSortByBatasPengembalian.bind(this);
    this.handleSortByDenda = this.handleSortByDenda.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.handleUbahFormatTgl = this.handleUbahFormatTgl.bind(this);

    this.state = {
      authorize: true,
      data: [],
      showTerimaBuku: false,
      showTerimaBukuDenda: false,
      idPeminjaman: 0,
      idUser: 0,
      dendaBuku: 0,
      successBuku: false,
      successDenda: false,
      peminjam: true,
      loading: true,
      searchResult: [],

      sortJudulBuku: true,
      sortPeminjam: true,
      sortTglPeminjaman: true,
      sortBatasPengembalian: true,
      sortDenda: true,

      showSortJudulBuku: false,
      showSortPeminjam: false,
      showSortTglPeminjaman: false,
      showSortBatasPengembalian: false,
      showSortDenda: false,

      perPage:6,
      countPage:0,
      offsetPage:0,
      currentPage:0,
    };
  }

  componentDidMount() {
    this.checkAuthorize();
  }

  // Fungsi untuk Check Authorize Role
  checkAuthorize(){
    const user = AuthService.getCurrentUser();

    if (user === null || !user.roles.includes("ROLE_STAFF")) {
      this.setState({
        authorize: false
      });
    }

    else {
        this.getPeminjamanData();
    }
  }

  // Fungsi untuk mengambil data peminjaman
  getPeminjamanData() {
    // GET data dari Backend
    APIConfig.get("/peminjaman/aktif").then(
        // Pengembalian Response Data jika berhasil
        response => {
          this.setState({
            data: response.data.result,
            searchResult: response.data.result,
            loading: false,
            countPage: Math.ceil(response.data.result.length / this.state.perPage),

            sortJudulBuku: true,
            sortPeminjam: true,
            sortTglPeminjaman: true,
            sortBatasPengembalian: true,
            sortDenda: true,

            showSortJudulBuku: false,
            showSortPeminjam: false,
            showSortTglPeminjaman: false,
            showSortBatasPengembalian: false,
            showSortDenda: false,
          });
        }, 

        // Pengembalian Error Message jika Error
        error => {
          this.setState({
             message:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          });
  
        }
      );
  }

  // Fungsi untuk mengubah format Date
  ubahFormatDate(date){
    let newDate = new Date(date.split('/')[2], parseInt(date.split('/')[1]) - 1, date.split('/')[0]);
    
    return dateFormat(newDate, "d mmm yyyy");
  }

  // Fungsi untuk handle tombol terima buku
  handleButtonTerimaBuku(idPeminjaman, idUser, denda){
    // Mengecek apakah penerimaan buku disertai denda atau tidak
    if (denda > 0) {
      this.setState({
        showTerimaBukuDenda: true,
        idPeminjaman: idPeminjaman,
        dendaBuku: denda,
        idUser: idUser
      });
    }

    else {
      this.setState({
        showTerimaBuku: true,
        idPeminjaman: idPeminjaman
      });
    }
  }

  // Fungsi untuk handle terima buku biasa
  handleConfTerimaBuku(action){
    this.setState({
      showTerimaBuku: false,
    });

    if (action) {
      this.handlePengembalianBuku();
    }
  }

  // Fungsi untuk handle terima buku berdenda
  handleConfTerimaBukuBerdenda(action, bukuAndDenda, jmlDibayar){
    this.setState({
      showTerimaBukuDenda: false,
    });

    if (action) {
      if (bukuAndDenda) {
        this.handlePengembalianBuku();
        this.handlePembayaranUser(jmlDibayar);
      }
      else{
        this.handlePengembalianBuku();
      }
    }
  }

  // Fungsi untuk mendapatkan tanggal hari ini
  getCurrentDate(){
    let date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month < 10) {
        month = `0${month}`
    }

    if (day < 10) {
      day = `0${day}`
  }
    
    const result = `${year}-${month}-${day}`;

    return result
  }


  // Fungsi untuk Pengembalian Buku
  handlePengembalianBuku() {
    // Data yang akan dimasukkan ke Request Body
    const data = {
      tgl_pengembalian: this.getCurrentDate()
    };

    // PUT data ke Backend
    APIConfig.put(`/peminjaman/pengembalian/${this.state.idPeminjaman}`, data).then(
        // Pengembalian Response Data jika berhasil
        response => {
          this.setState({
            message: response.data.message,
            successBuku: true
          }, this.getPeminjamanData());
        }, 

        // Pengembalian Error Message jika Error
        error => {
          this.setState({
             message:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          });
  
        }
      );
  }

  // Fungsi untuk membayar denda
  handlePembayaranUser(jmlDibayar) {

    // Data yang akan dimasukkan ke Request Body
    const data = {
      bayarDenda: jmlDibayar
    };
    
    // PUT data ke Backend
    APIConfig.put(`/users/pembayaran-denda/${this.state.idUser}`, data).then(
        // Pengembalian Response Data jika berhasil
        response => {
          this.setState({
            message: response.data.message,
            successDenda: true
          });

        }, 

        // Pengembalian Error Message jika Error
        error => {
          this.setState({
             message:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          });
        }
      );
    }

  // Fungsi untuk menghilangkan popup successBuku
  handleXSuccessBuku() {
    setTimeout(() => {
      this.setState({ successBuku: false,});
    }, 3000);
  }

  // Fungsi untuk menghilangkan popup successDenda
  handleXSuccessDenda() {
    setTimeout(() => {
      this.setState({ successDenda: false,});
    }, 3000);
  }

  onChangeSortBy(e){
    if(e.target.value === "peminjam"){
      this.setState({peminjam: false});
    }
  }

  // Handle Search Feature
  async handleSearch(event){
    event.preventDefault();

    let search = event.target.value

    // Search Filter
    let result = this.state.data.filter((peminjaman) => {
      return peminjaman.buku.namaBuku.toLowerCase().indexOf(search.toLowerCase()) !== -1})

    this.setState({
      searchResult: result,
      countPage: Math.ceil(result.length / this.state.perPage),
      currentPage: 0,
      offsetPage: 0
    });
  }

  // Handle Sort By Judul Buku
  handleSortByJudulBuku(){
    let result = this.state.searchResult;

    // Sort By Judul Buku
    if (this.state.sortJudulBuku) {
      result.sort((peminjamanA, peminjamanB) => (peminjamanA.buku.namaBuku.toLowerCase() > peminjamanB.buku.namaBuku.toLowerCase()) ? 1 : -1)
    }

    else {
      result.sort((peminjamanA, peminjamanB) => (peminjamanA.buku.namaBuku.toLowerCase() > peminjamanB.buku.namaBuku.toLowerCase()) ? -1 : 1)
    }
    
    this.setState({
      searchResult: result,

      sortJudulBuku: !this.state.sortJudulBuku,
      sortPeminjam: true,
      sortTglPeminjaman: true,
      sortBatasPengembalian: true,
      sortDenda: true,

      showSortJudulBuku: true,
      showSortPeminjam: false,
      showSortTglPeminjaman: false,
      showSortBatasPengembalian: false,
      showSortDenda: false
    });
  }

  // Handle Sort By Peminjam
  handleSortByPeminjam(){
    let result = this.state.searchResult;

    // Sort By Peminjam
    if (this.state.sortPeminjam) {
      result.sort((peminjamanA, peminjamanB) => (peminjamanA.user.name.toLowerCase() > peminjamanB.user.name.toLowerCase()) ? 1 : -1)
    }

    else {
      result.sort((peminjamanA, peminjamanB) => (peminjamanA.user.name.toLowerCase() > peminjamanB.user.name.toLowerCase()) ? -1 : 1)
    }
    
    this.setState({
      searchResult: result,

      sortPeminjam: !this.state.sortPeminjam,
      sortJudulBuku: true,
      sortTglPeminjaman: true,
      sortBatasPengembalian: true,
      sortDenda: true,

      showSortJudulBuku: false,
      showSortPeminjam: true,
      showSortTglPeminjaman: false,
      showSortBatasPengembalian: false,
      showSortDenda: false
    });
  }

  // Handle Sort By Tanggal Peminjaman
  handleSortByTglPeminjaman(){
    let result = this.state.searchResult;

    // Sort By Tanggal Peminjaman
    if (this.state.sortTglPeminjaman) {
      result.sort((peminjamanA, peminjamanB) => (this.handleUbahFormatTgl(peminjamanA.tglPeminjaman) > this.handleUbahFormatTgl(peminjamanB.tglPeminjaman)) ? 1 : -1)
    }

    else {
      result.sort((peminjamanA, peminjamanB) => (this.handleUbahFormatTgl(peminjamanA.tglPeminjaman) > this.handleUbahFormatTgl(peminjamanB.tglPeminjaman)) ? -1 : 1)
    }
    
    this.setState({
      searchResult: result,

      sortTglPeminjaman: !this.state.sortTglPeminjaman,
      sortJudulBuku: true,
      sortPeminjam: true,
      sortBatasPengembalian: true,
      sortDenda: true,

      showSortJudulBuku: false,
      showSortPeminjam: false,
      showSortTglPeminjaman: true,
      showSortBatasPengembalian: false,
      showSortDenda: false
    });
  }

  handleUbahFormatTgl(tgl){
    tgl = tgl.slice(5) + tgl.slice(3,6) + tgl.slice(0,2)
    return tgl;
  }

  // Handle Sort By Batas Pengembalian
  handleSortByBatasPengembalian(){
    let result = this.state.searchResult;

    // Sort By Batas Pengembalian
    if (this.state.sortBatasPengembalian) {
      result.sort((peminjamanA, peminjamanB) => (this.handleUbahFormatTgl(peminjamanA.batasPengembalian) > this.handleUbahFormatTgl(peminjamanB.batasPengembalian)) ? 1 : -1)
    }

    else {
      result.sort((peminjamanA, peminjamanB) => (this.handleUbahFormatTgl(peminjamanA.batasPengembalian) > this.handleUbahFormatTgl(peminjamanB.batasPengembalian)) ? -1 : 1)
    }
    
    this.setState({
      searchResult: result,

      sortBatasPengembalian: !this.state.sortBatasPengembalian,
      sortJudulBuku: true,
      sortPeminjam: true,
      sortTglPeminjaman: true,
      sortDenda: true,

      showSortJudulBuku: false,
      showSortPeminjam: false,
      showSortTglPeminjaman: false,
      showSortBatasPengembalian: true,
      showSortDenda: false
    });
  }

  // Handle Sort By Denda
  handleSortByDenda(){
    let result = this.state.searchResult;

    // Sort By Denda
    if (this.state.sortDenda) {
      result.sort((peminjamanA, peminjamanB) => (peminjamanA.denda > peminjamanB.denda) ? 1 : -1)
    }

    else {
      result.sort((peminjamanA, peminjamanB) => (peminjamanA.denda > peminjamanB.denda) ? -1 : 1)
    }
    
    this.setState({
      searchResult: result,

      sortDenda: !this.state.sortDenda,
      sortJudulBuku: true,
      sortPeminjam: true,
      sortTglPeminjaman: true,
      sortBatasPengembalian: true,

      showSortJudulBuku: false,
      showSortPeminjam: false,
      showSortTglPeminjaman: false,
      showSortBatasPengembalian: false,
      showSortDenda: true
    });
  }

  // Handle Paging
  handlePage(event){
    const newOffset = ((event.selected) * this.state.perPage);

    this.setState({ offsetPage : newOffset });
  }
  
  render() {
    return (
      <>
      {/* Check Role  */}
      {this.state.authorize ? <></> : <Navigate to={"/forbidden"}/>}
      {this.state.peminjam ? <></> : <Navigate to={"/peminjaman/peminjam"}/>}

      <div className="m-10">
        {/* Judul */}
        <h2 className="font-avertaBold text-3xl text-center">Peminjaman Buku</h2>

        {/* Sort by */}
        <p className="font-averta text-center mt-5">
            Sort by 
            <select onChange={this.onChangeSortBy} id="role" name="role" className="text-tGray ml-3 py-1 pl-3 pr-20 border-2 rounded-full bg-[#E5E5E5]">
                <option value="buku">
                  Buku
                </option>
                <option value="peminjam">
                  Peminjam
                </option>
            </select>
        </p>

        <div className="flex justify-start items-end mt-12">
          {/* Tombol Peminjaman Baru */}
          <div className="hidden md:block">
            <NavLink to={"/peminjaman/tambah"} className="btn-green md:w-48 text-center">+ Tambah Peminjaman</NavLink>
          </div>

          <div className="md:hidden">
            <NavLink to={"/peminjaman/tambah"} className="py-2 pt-3 text-sm bg-pGreen2 hover:bg-pGreen3 text-white inline-block rounded-xl w-10 font-avertaSemiBold text-center text-md"><FontAwesomeIcon icon={faPlus}/></NavLink>
          </div>

          {/* Search Bar */}
          <div class="flex justify-between px-3 items-center border border-gray-300 bg-[#E6EFED] w-full md:w-3/5 ml-3 md:ml-8 h-10 rounded-xl">
              <input class="bg-[#E6EFED] w-full h-full rounded-xl focus:outline-none"
                      type="text"
                      placeholder="Cari Judul Buku"
                      onChange={this.handleSearch}
              ></input>
              <span className="self-center lg:pr-2">
                <SearchIcon height={23}/>
              </span>
          </div>
          
        </div>

        {/* Tabel Buku */}
        <div className="flex flex-col mt-10">
          <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                  <table className="min-w-full">
                      {/* Table Head */}
                      <thead>
                          <tr>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  No.</th>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  <div className="flex">
                                    <p className="w-22">Judul Buku</p>
                                    {!this.state.showSortJudulBuku ? 
                                    <span onClick={this.handleSortByJudulBuku} className="cursor-pointer ml-2 self-center text-gray-400">
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                    </span>
                                    :
                                    <span onClick={this.handleSortByJudulBuku} className="cursor-pointer ml-2 self-center">
                                      {this.state.sortJudulBuku ? 
                                      <FontAwesomeIcon icon={faArrowUpShortWide}/>
                                      :
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                      }
                                    </span>
                                    }
                                  </div>
                                  </th>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  <div className="flex">
                                    <p className="w-18">Peminjam</p>
                                    {!this.state.showSortPeminjam ?
                                    <span onClick={this.handleSortByPeminjam} className="cursor-pointer ml-2 self-center text-gray-400">
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                    </span>
                                    :
                                    <span onClick={this.handleSortByPeminjam} className="cursor-pointer ml-2">
                                      {this.state.sortPeminjam ? 
                                      <FontAwesomeIcon icon={faArrowUpShortWide}/>
                                      :
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                      }
                                    </span>
                                    }
                                  </div>
                                  </th>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4 text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  <div className="flex">
                                    <p className="w-24">Tanggal Peminjaman</p>
                                    {!this.state.showSortTglPeminjaman ?
                                    <span onClick={this.handleSortByTglPeminjaman} className="cursor-pointer ml-2 self-center text-gray-400">
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                    </span>
                                    :
                                    <span onClick={this.handleSortByTglPeminjaman} className="cursor-pointer ml-2 self-center">
                                      {this.state.sortTglPeminjaman ? 
                                      <FontAwesomeIcon icon={faArrowUpShortWide}/>
                                      :
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                      }
                                    </span>
                                    }
                                  </div>
                                  </th>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  <div className="flex">
                                    <p className="w-24">Batas Pengembalian</p>
                                    {!this.state.showSortBatasPengembalian ?
                                    <span onClick={this.handleSortByBatasPengembalian} className="cursor-pointer ml-5 self-center text-gray-400">
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                    </span>
                                    :
                                    <span onClick={this.handleSortByBatasPengembalian} className="cursor-pointer ml-5 self-center">
                                      {this.state.sortBatasPengembalian ? 
                                      <FontAwesomeIcon icon={faArrowUpShortWide}/>
                                      :
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                      }
                                    </span>
                                    }
                                  </div>
                                  </th>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50 text-center">
                                  <div className="flex">
                                    <p className="w-12">Denda</p>
                                    {!this.state.showSortDenda ?
                                    <span onClick={this.handleSortByDenda} className="cursor-pointer ml-2 self-center text-gray-400">
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                    </span>
                                    :
                                    <span onClick={this.handleSortByDenda} className="cursor-pointer ml-2">
                                      {this.state.sortDenda ? 
                                      <FontAwesomeIcon icon={faArrowUpShortWide}/>
                                      :
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                      }
                                    </span>
                                    }
                                  </div>
                                  </th>

                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50 text-center">
                                  </th>
                          </tr>
                      </thead>
                      
                      {/* Table Body */}
                      <tbody className="bg-white">
                          {this.state.searchResult.slice(this.state.offsetPage, this.state.offsetPage + this.state.perPage).map((peminjaman, no) => 
                            <tr key={peminjaman.idPeminjaman}>
                                {/* No. */}
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                  {no + 1}
                                </td>

                                {/* Judul Buku */}
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                  {peminjaman.buku.namaBuku}
                                </td>

                                {/* Peminjam */}
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                  {peminjaman.user.name}
                                </td>

                                {/* Tanggal Peminjam */}
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                  {this.ubahFormatDate(peminjaman.tglPeminjaman)}
                                </td>

                                {/* Batas Pengembalian */}
                                {
                                  // Telat mengembalikan
                                  peminjaman.denda > 0 ? 
                                  <td id="batasPengembalian" className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-iRed3">
                                    {this.ubahFormatDate(peminjaman.batasPengembalian)}
                                  </td>
                                  :
                                  // Belum telat mengembalikan
                                  <td id="batasPengembalian" className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    {this.ubahFormatDate(peminjaman.batasPengembalian)}
                                  </td>
                                }
                                
                                {/* Denda */}
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                  {peminjaman.denda > 0 ? <p>Rp{peminjaman.denda}</p>: <p>-</p>}
                                </td>

                                {/* Terima Buku */}
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                  <button onClick={() => this.handleButtonTerimaBuku(peminjaman.idPeminjaman, peminjaman.user.id, peminjaman.denda)} className="btn-green">Terima Buku</button>
                                </td>
                            </tr>
                          )}
                      </tbody>
                  </table>
                </div>
            </div>

            {/* Loading Data selama menunggu get Data */}
            {this.state.loading ?
            <div className="text-center self-center mt-14">
              <Loading />
            </div>
            : <></>}

            {/* Pengganti jika tidak ada buku yang sedang dipinjam*/}
            {this.state.data.length === 0  && !this.state.loading ? 
                    <h2 className="ourFont font-bold text-3xl text-center mt-10">Tidak Ada Data Buku yang sedang Dipinjam</h2>
                    : <></>}

            {/* React Paging */}
            {this.state.searchResult.length > 6 && 
            <div>
              <ReactPaginate
                  containerClassName="pagination flex justify-center mt-10 mx-auto max-w-xl"
                  activeClassName="active rounded-full bg-[#43816F] text-white"
                  pageClassName="w-10 h-10 text-center align-middle py-2 hover:bg-[#E6EFED] hover:text-black rounded-full "
                  pageLinkClassName="page-link"
                  previousClassName="w-10 h-10 text-center text-sm align-middle p-2 hover:bg-[#E6EFED] hover:text-black rounded-full"
                  previousLinkClassName="page-link"
                  nextClassName="page-item w-10 h-10 text-center text-sm align-middle p-2 hover:bg-[#E6EFED] hover:text-black rounded-full"
                  nextLinkClassName="page-link"
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={this.handlePage}
                  pageRangeDisplayed={5}
                  pageCount={this.state.countPage}
                  previousLabel="<"
                  renderOnZeroPageCount={null}>
              </ReactPaginate>
            </div>
            }
        </div>
        
        {/* Confirmation Terima Buku */}
        {this.state.showTerimaBuku && <ConfTerimaBuku onConfirmChange={this.handleConfTerimaBuku} 
                                                        id={this.state.idPeminjaman}
                                                        />}

        {/* Confirmation Terima Buku Berdenda */}
        {this.state.showTerimaBukuDenda && <ConfTerimaBukuBerdenda onConfirmChange={this.handleConfTerimaBukuBerdenda} 
                                                        idPeminjaman={this.state.idPeminjaman}
                                                        idUser={this.state.idUser}
                                                        dendaBuku={this.state.dendaBuku}
                                                        />}

        {/* Popup success Pengembalian Buku */}
        {this.state.successBuku? 
          <>
            <Popup type="success" pesan="Pengembalian Buku berhasil dilakukan!" />
            {this.handleXSuccessBuku()}
          </>
          :<></>}

        {/* Popup success Pengembalian Buku dan Pembayaran Denda */}
        {this.state.successDenda? 
          <>
            <Popup type="success" pesan="Pengembalian Buku dan penerimaan denda berhasil dilakukan!" />
            {this.handleXSuccessDenda()}
          </>
          :<></>}

      </div>
      </>
    );
  }
}
