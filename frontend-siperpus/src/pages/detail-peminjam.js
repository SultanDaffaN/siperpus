import React, { Component } from "react";
import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import AuthService from "../services/auth-service";
import EventBus from "../common/EventBus";
import {Navigate, NavLink, useParams, useNavigate} from "react-router-dom";
import dateFormat from "dateformat";
import ConfTerimaBuku from "../components/confTerimaBuku";
import ConfTerimaBukuBerdenda from "../components/confTerimaBukuBerdenda";
import Popup from "../components/popup";
import ConfBayarDenda from "../components/confBayarDenda";
import profilePict from "../pictures/Profile Picture.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownShortWide, faArrowUpShortWide} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";

// Referensi:
// 1. https://stackoverflow.com/questions/58548767/react-router-dom-useparams-inside-class-component

function withRouter(Component) {
    function ComponentWithRouter(props) {
        let params = useParams()
        const navigate = useNavigate();
        return <Component {...props} params={params} navigate={navigate}/>
    }
    return ComponentWithRouter
}

class Detailpeminjam extends Component{
    constructor(props){
        super(props);

        this.checkAuthorize = this.checkAuthorize.bind(this);
        this.ubahFormatDate = this.ubahFormatDate.bind(this);
        this.handleButtonTerimaBuku = this.handleButtonTerimaBuku.bind(this);
        this.loadDaftarPinjam = this.loadDaftarPinjam.bind(this);
        this.loadDetailPeminjam = this.loadDetailPeminjam.bind(this);
        this.handleButtonTerimaBuku = this.handleButtonTerimaBuku.bind(this);
        this.handleConfTerimaBuku = this.handleConfTerimaBuku.bind(this);
        this.handleConfTerimaBukuBerdenda = this.handleConfTerimaBukuBerdenda.bind(this);
        this.getCurrentDate = this.getCurrentDate.bind(this);
        this.handleTerimaDenda = this.handleTerimaDenda.bind(this);
        this.handlePengembalianBuku = this.handlePengembalianBuku.bind(this);
        this.handlePembayaranUser = this.handlePembayaranUser.bind(this);
        this.handleXSuccessBuku = this.handleXSuccessBuku.bind(this);
        this.handleXSuccessDenda = this.handleXSuccessDenda.bind(this);

        this.handleSortByJudulBuku = this.handleSortByJudulBuku.bind(this);
        this.handleSortByTglPeminjaman = this.handleSortByTglPeminjaman.bind(this);
        this.handleUbahFormatTgl = this.handleUbahFormatTgl.bind(this);
        this.handleSortByBatasPengembalian = this.handleSortByBatasPengembalian.bind(this);
        this.handleSortByDenda = this.handleSortByDenda.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.state = {
            showStaffBoard: false,
            showKepalaBoard: false,
            showPenggunaBoard: false,
            currentUser: undefined,
            peminjam_list:[],
            testID:0,
            dataUser:[],
            message:"",

            authorize: true,
            data: [],
            showTerimaBuku: false,
            showTerimaBukuDenda: false,
            showTerimaDenda: false,
            idPeminjaman: 0,
            idUser: 0,
            dendaBuku: 0,
            dendaUser: 0,
            successBuku: false,
            successDenda: false,
            peminjam: true,
            dendaMessage: "",
            loading: true,

            sortJudulBuku: true,
            sortTglPeminjaman: true,
            sortBatasPengembalian: true,
            sortDenda: true,

            showSortJudulBuku: false,
            showSortTglPeminjaman: false,
            showSortBatasPengembalian: false,
            showSortDenda: false,

            perPage:6,
            countPage:0,
            offsetPage:0,
            currentPage:0

        };
    }

    // Fungsi untuk Load Detail Peminjam
    loadDetailPeminjam() {
        // GET data dari Backend
        APIConfig.get(`/peminjaman/aktif/user/${this.props.params.idPeminjam}`).then(
            // Pengembalian Response Data jika berhasil
            response => {
                this.setState({
                    peminjam_list: response.data.result
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



    // Fungsi untuk Load Daftar Pinjam
    loadDaftarPinjam() {
        // GET data dari Backend
        APIConfig.get(`/users/pengguna/${this.props.params.idPeminjam}`).then(
            // Pengembalian Response Data jika berhasil
            response => {
                this.setState({
                    dataUser: response.data.result,
                    loading: false,

                    sortJudulBuku: true,
                    sortTglPeminjaman: true,
                    sortBatasPengembalian: true,
                    sortDenda: true,

                    showSortJudulBuku: false,
                    showSortTglPeminjaman: false,
                    showSortBatasPengembalian: false,
                    showSortDenda: false,

                    countPage: Math.ceil(response.data.result.length / this.state.perPage)
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

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showStaffBoard: user.roles.includes("ROLE_STAFF"),
                showKepalaBoard: user.roles.includes("ROLE_KEPALA"),
                showPenggunaBoard: user.roles.includes("ROLE_PENGGUNA"),
            });
        }
        this.loadDetailPeminjam();
        this.loadDaftarPinjam();
    }

    // Fungsi untuk mengubah format Date
    ubahFormatDate(date){
        let newDate = new Date(date.split('/')[2], date.split('/')[1], date.split('/')[0]);
        newDate.setDate(newDate.getDate());

        return dateFormat(newDate, "d mmmm yyyy");
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

    // Fungsi untuk handle tombol terima buku
    handleButtonTerimaDenda(idUser, denda){
        this.setState({
            showTerimaDenda: true,
            idUser: idUser,
            dendaUser: denda
        });
    }

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

    // Fungsi untuk handle Denda User
    handleTerimaDenda(jmlDibayar){
        this.setState({
            showTerimaDenda: false,
            dendaMessage: "Penerimaan denda berhasil dilakukan!"
        });

        this.handlePembayaranUser(jmlDibayar);
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
            dendaMessage: "Pengembalian Buku dan penerimaan denda berhasil dilakukan!"
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
                }, this.loadDetailPeminjam());
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
                    successDenda: true,
                });
                this.loadDaftarPinjam();
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
            this.setState({
                successDenda: false,
                dendaMessage: ""
            });
        }, 3000);
    }

    // Handle sort by judul buku
    handleSortByJudulBuku(){
        let result = this.state.peminjam_list;

        if (this.state.sortJudulBuku) {
            result.sort((judulA, judulB) => (judulA.buku.namaBuku.toLowerCase() > judulB.buku.namaBuku.toLowerCase()) ? 1 : -1)
        }

        else {
            result.sort((judulA, judulB) => (judulA.buku.namaBuku.toLowerCase() > judulB.buku.namaBuku.toLowerCase()) ? -1 : 1)
        }

        this.setState({
            peminjam_list: result,

            sortJudulBuku: !this.state.sortJudulBuku,
            sortTglPeminjaman: true,
            sortBatasPengembalian: true,
            sortDenda: true,

            showSortJudulBuku: true,
            showSortTglPeminjaman: false,
            showSortBatasPengembalian: false,
            showSortDenda: false
        });
    }

    // Handle sort by tanggal peminjaman
    handleSortByTglPeminjaman(){
        let result = this.state.peminjam_list;

        if (this.state.sortTglPeminjaman) {
            result.sort((tanggalA, tanggalB) => (this.handleUbahFormatTgl(tanggalA.tglPeminjaman) > this.handleUbahFormatTgl(tanggalB.tglPeminjaman)) ? 1 : -1)
        }

        else {
            result.sort((tanggalA, tanggalB) => (this.handleUbahFormatTgl(tanggalA.tglPeminjaman) > this.handleUbahFormatTgl(tanggalB.tglPeminjaman)) ? -1 : 1)
        }

        this.setState({
            peminjam_list: result,

            sortTglPeminjaman: !this.state.sortTglPeminjaman,
            sortJudulBuku: true,
            sortBatasPengembalian: true,
            sortDenda: true,

            showSortJudulBuku: false,
            showSortTglPeminjaman: true,
            showSortBatasPengembalian: false,
            showSortDenda: false
        });
    }

    handleUbahFormatTgl(tgl){
        tgl = tgl.slice(5) + tgl.slice(3,6) + tgl.slice(0,2)
        return tgl;
    }

    // Handle Paging
    handlePage(event){
        const newOffset = ((event.selected) * this.state.perPage);

        this.setState({ offsetPage : newOffset });
    }

    // Handle sort by batas balikin
    handleSortByBatasPengembalian(){
        let result = this.state.peminjam_list;

        if (this.state.sortBatasPengembalian) {
            result.sort((balikinA, balikinB) => (this.handleUbahFormatTgl(balikinA.batasPengembalian) > this.handleUbahFormatTgl(balikinB.batasPengembalian)) ? 1 : -1)
        }

        else {
            result.sort((balikinA, balikinB) => (this.handleUbahFormatTgl(balikinA.batasPengembalian) > this.handleUbahFormatTgl(balikinB.batasPengembalian)) ? -1 : 1)
        }

        this.setState({
            peminjam_list: result,

            sortBatasPengembalian: !this.state.sortBatasPengembalian,
            sortJudulBuku: true,
            sortTglPeminjaman: true,
            sortDenda: true,

            showSortJudulBuku: false,
            showSortTglPeminjaman: false,
            showSortBatasPengembalian: true,
            showSortDenda: false
        });
    }

    // Handle sort by denda
    handleSortByDenda(){
        let result = this.state.peminjam_list;

        if (this.state.sortDenda) {
            result.sort((dendaA, dendaB) => (dendaA.denda > dendaB.denda) ? 1 : -1)
        }

        else {
            result.sort((dendaA, dendaB) => (dendaA.denda > dendaB.denda) ? -1 : 1)
        }

        this.setState({
            peminjam_list: result,

            sortDenda: !this.state.sortDenda,
            sortJudulBuku: true,
            sortTglPeminjaman: true,
            sortBatasPengembalian: true,

            showSortJudulBuku: false,
            showSortTglPeminjaman: false,
            showSortBatasPengembalian: false,
            showSortDenda: true
        });
    }

    render(){
        return(

            <>
                <div className="m-10">
                    {/* Judul */}
                    <h2 className="font-avertaBold text-3xl text-center"> Detail Peminjam </h2>
                    {this.state.loading ?
                        <div className="flex h-screen">
                            <div className="mx-auto mt-48">
                                <Loading />
                            </div>
                        </div>
                        :
                        <div className="flex flex-col mt-10">
                            <div className="flex">
                                {/* Gambar */}
                                <div className="h-28 w-40">
                                    <img src={profilePict}
                                         title="Title of image"
                                         alt="alt text here"
                                         className="h-42 w-40"/>
                                </div>

                                <div className="ml-10">
                                    <h4 className="font-avertaBold mt-1">{this.state.dataUser.name}</h4>
                                    {/* <h4 className="font-averta mt-2"> Guru/Siswa </h4>*/}
                                    <h4 className="font-averta mt-2"> Total Denda: Rp{this.state.dataUser.unpaidDenda} </h4>
                                    {this.state.dataUser.unpaidDenda > 0 &&
                                    <button onClick={() => this.handleButtonTerimaDenda(this.state.dataUser.id, this.state.dataUser.unpaidDenda)} className="btn-green mt-3">
                                        Terima Denda
                                    </button>
                                    }
                                </div>
                            </div>

                            {/* Table Component (reuse) */}
                            <div className="flex flex-col mt-16">
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
                                                    Judul Buku

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
                                                </th>

                                                <th
                                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                                    Tanggal Peminjaman

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
                                                    }</th>
                                                <th
                                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                                    Batas Pengembalian

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
                                                    }</th>
                                                <th
                                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50 text-center">
                                                    Denda

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
                                                    }</th>

                                                <th
                                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50 text-center">
                                                </th>
                                            </tr>
                                            </thead>

                                            {/* Table Body */}
                                            <tbody className="bg-white">

                                            {this.state.peminjam_list.slice(this.state.offsetPage, this.state.offsetPage + this.state.perPage).map((peminjaman, no) =>
                                                <tr key={peminjaman.idPeminjaman}>
                                                    {/* No. */}
                                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                        {no + 1}
                                                    </td>

                                                    {/* Judul Buku */}
                                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                        {peminjaman.buku.namaBuku}
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

                                        {/* React Paging */}
                                        {this.state.peminjam_list.length > 6 &&
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
                                </div>
                            </div>
                        </div>
                    }


                    {/* Pengganti jika tidak ada buku yang sedang dipinjam*/}
                    {this.state.peminjam_list.length === 0 && !this.state.loading ?
                        <h2 className="ourFont font-bold text-3xl text-center mt-10">Tidak Ada Data Buku yang sedang Dipinjam</h2>
                        : <></>}

                    <div className="flex justify-end mt-20">
                        <button className="btn-outline-green" onClick={() => this.props.navigate(-1)}>Kembali</button>
                    </div>

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

                {/* Confirmation Terima Denda User */}
                {this.state.showTerimaDenda && <ConfBayarDenda onConfirmChange={this.handleTerimaDenda}
                                                               idUser={this.state.idUser}
                                                               dendaUser={this.state.dendaUser}
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
                        <Popup type="success" pesan={this.state.dendaMessage} />
                        {this.handleXSuccessDenda()}
                    </>
                    :<></>}
            </>
        )
    }




}

const DetailPeminjamWithParam = withRouter(Detailpeminjam);

export default DetailPeminjamWithParam;


