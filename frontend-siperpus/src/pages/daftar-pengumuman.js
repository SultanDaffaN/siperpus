import React, { Component } from "react";
import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import AuthService from "../services/auth-service";
import EventBus from "../common/EventBus";
import {Navigate, NavLink, useNavigate, useParams} from "react-router-dom";
import profilePict from "../pictures/Profile Picture.png";
import Dropzone from "react-dropzone";
import Book from "../components/book";
import profileImg from "../pictures/Profile Logo.png";
import ConfDelPopUp from "../components/confDel-popup";
import Popup from "../components/popup";
import ScrollToTop from "../components/ScrollToTop";

// Referensi:
// 1. https://tailwind-elements.com/docs/standard/components/cards/
// 2. Detailbuku.js (untuk fitur delete)
// 3. tambahbuku.js
// 4. manage-pengguna.js
// 5. daftar-peminjaman-buku.js
// 6. detail-peminjam.js

class DaftarPengumuman extends Component{
    constructor(props){
        super(props);
        this.handleXSuccess = this.handleXSuccess.bind(this);
        this.handleConfirmPopupAction = this.handleConfirmPopupAction.bind(this);
        this.handleShowPopupConf = this.handleShowPopupConf.bind(this);
        this.deleteDataPengumuman = this.deleteDataPengumuman.bind(this);
        this.ubahFormatBulan = this.ubahFormatBulan.bind(this);
        this.state = {
            showStaffBoard: false,
            showKepalaBoard: false,
            showPenggunaBoard: false,
            boolean:false,
            authorize:true,
            loading: true,
            message:"",
            pengumumanData:[],
            kosong:{},

            subjek:"",
            isi:"",
            userKepala:"",

            data:"",
            successful: false,

            confirmDelete: false,
            idPengumuman:"",
            success: false
        };
    }

    ubahFormatBulan(tglPengumuman){
        let bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        return (tglPengumuman.slice(0,2) + " " + bulan[tglPengumuman.slice(4,5)-1] + " " + tglPengumuman.slice(6,10))
    }

    componentDidMount() {
        this.checkRole();
    }

    checkRole(){
        const userr = AuthService.getCurrentUser();

        if (userr === null || !userr.roles.includes("ROLE_KEPALA")) {
            this.setState({boolean:true});
        }
        else{
            this.setState({showKepalaBoard:true});
        }

        this.loadDataPengumuman();

    }



    loadDataPengumuman(){
        // GET data dari Backend
        APIConfig.get(`/pengumuman`).then(
            // Pengembalian Response Data jika berhasil
            response => {
                this.setState({pengumumanData:response.data.result});
                this.setState({loading:false});
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





    // Delete pengumuman
    deleteDataPengumuman(id) {
        // DELETE pengguna ke Backend
        APIConfig.delete(`/pengumuman/${id}`).then(
            response => {
                this.loadDataPengumuman();
                this.setState({
                    message: response.data,
                    successful: true
                });
                console.log(this.state.idPengumuman);
            },

            error => {
                this.setState({
                    message:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
                console.log(this.state.idPengumuman);


                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }

            }

        );
        this.loadDataPengumuman();
    }

    handleShowPopupConf(id){
        this.setState({confirmDelete:true}, () => console.log(this.state.confirmDelete));
        this.setState({idPengumuman:id}, () => console.log(this.state.idPengumuman));
    }

    handleConfirmPopupAction(action, id){
        this.setState({
            confirmDelete: false
        });

        if (action) {
            this.deleteDataPengumuman(id);
        }
    }

    handleXSuccess() {
        setTimeout(() => {
            this.setState({ successful: false,
                message: ""
            });
        }, 3000);

    }



    render(){
        return(
            <>
                <header className="bg-white m-5" align="center">
                    <div className="text-center text-2xl max-w-xl sm:py-6 md:py-6 lg:py-6 mx-auto">
                        <p><b>Pengumuman Perpustakaan</b></p>
                    </div>
                </header>


                <div className="container mx-auto">



                    {this.state.loading ?
                        <div className="flex h-screen">
                            <div className="mx-auto mt-48">
                                <Loading />
                            </div>
                        </div>
                        :

                        <>
                            <div className="ml-20">
                                {this.state.showKepalaBoard && (
                                    <NavLink to={"/tambah-pengumuman"} className="btn-green font-medium mt-5 w-48 pl-3">+ Tambah Pengumuman</NavLink>
                                )}
                            </div>

                            {(this.state.pengumumanData).slice(-6).map((pengumuman, no) =>

                                <div className=" my-2 sm:mx-6 sm:px-6 lg:mx-8 " key={pengumuman.idPengumuman}>

                                    <div className="p-6 flex flex-col bg-[#E6EFED] m-4 rounded">

                                        <div className="flex">
                                            <div className="">
                                                <img src={profileImg} className="object-contain"/>
                                            </div>

                                            <div>
                                                <h3 className="text-gray-900 text-2xl font-medium mx-4">{pengumuman.subjekPengumuman}</h3>
                                                <p className="text-gray-600 text-base mx-4">by {pengumuman.user.name}</p>
                                                <p className="text-gray-600 text-sm mx-4 ">{this.ubahFormatBulan(pengumuman.tglPengumuman)}</p>
                                            </div>

                                        </div>
                                        <p className="text-gray-700 text-base m-4 whitespace-pre-line">
                                            {pengumuman.isiPengumuman}
                                        </p>

                                        {this.state.showKepalaBoard && (
                                            <>
                                            <div className="flex flex-row-reverse items-center mt-3">
                                                <button className="btn-red"
                                                        onClick={() => this.handleShowPopupConf(pengumuman.idPengumuman)}
                                                >Hapus</button>
                                            </div>

                                            </>
                                        )}
                                    </div>
                                </div>
                            ).reverse()}

                            <div className="sm:mx-6 sm:px-6 lg:mx-8 flex justify-end">
                                <NavLink to={"/pengumuman-all"} className="italic font-bold"> Lihat seluruh pengumuman > </NavLink>
                            </div>



                        </>



                    }


                    <ScrollToTop />
                    {/* Confirmation Pop Up */}
                    {this.state.confirmDelete &&
                    <ConfDelPopUp onConfirmChange={this.handleConfirmPopupAction}
                                  id={this.state.idPengumuman}
                                  judul="Hapus Pengumuman"
                                  deskripsi="Apakah anda yakin ingin pengumuman ini?"/>}

                    {/* Popup jika sukses */}
                    {this.state.successful ?
                        <>
                            <Popup type="success" pesan="Pengumuman berhasil dihapus!" />
                            {this.handleXSuccess()}
                        </>
                        :<></>}

                </div>






            </>
        )
    }











}

export default DaftarPengumuman;



