import React, {Component} from "react";
import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import buku from "../pictures/buku.jpg";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import {Navigate, NavLink} from "react-router-dom";
import AuthService from "../services/auth-service";

export class DashboardPengguna extends Component {
    constructor(props) {
        super(props);
        this.getReservasiBuku = this.getReservasiBuku.bind(this);
        this.getBukuUlasan = this.getBukuUlasan.bind(this);
        this.getDipinjam = this.getDipinjam.bind(this);
        this.state = {
            dataBukuReservasi: [],
            dataBukuDipinjam: [],
            dataBukuUlasan: [],
            tanggal: new Date().toLocaleDateString(),
            loading: true,
            authorize: true,

        };
    }

    componentDidMount(){
        this.getReservasiBuku();
        this.getBukuUlasan();
        this.getDipinjam();
        this.checkAuthorize();
    }

    // Fungsi untuk Check Authorize Role
    checkAuthorize(){
        const user = AuthService.getCurrentUser();

        if (user === null || !user.roles.includes("ROLE_PENGGUNA")) {
            this.setState({
                authorize: false
            });
        }
    }

    // Fungsi untuk Get Data Temp
    getReservasiBuku(){
        // GET data dari Backend
        APIConfig.get("/dashboard/pengguna/reservasi").then(
            // Pengembalian Response Data jika berhasil
            response => {
                this.setState({
                    dataBukuReservasi: response.data.result,
                });
                this.setState({ loading: false });
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

    // Fungsi untuk Get Data Temp
    getBukuUlasan(){
        // GET data dari Backend
        APIConfig.get("/dashboard/pengguna/ulasan").then(
            // Pengembalian Response Data jika berhasil
            response => {
                this.setState({
                    dataBukuUlasan: response.data.result,
                });
                this.setState({ loading: false });
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

    // Fungsi untuk Get Data Reservasi
    getDipinjam() {
        // GET data dari Backend
        APIConfig.get("/dashboard/pengguna/buku-dipinjam").then(
            // Pengembalian Response Data jika berhasil
            response => {
                this.setState({
                    dataBukuDipinjam: response.data.result,
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

    render() {
        const settingsUlasan = {
            dots: true,
            autoplay: true,
            infinite: true,
            slidesToShow: Math.min(4, this.state.dataBukuUlasan.length),
            slidesToScroll: 1
        };
        const settingsReservasi = {
            dots: true,
            autoplay: true,
            infinite: true,
            slidesToShow: Math.min(4, this.state.dataBukuReservasi.length),
            slidesToScroll: 1
        };
        return (
            <>
                {/* Check Role  */}
                {this.state.authorize ? <></> : <Navigate to={"/forbidden"}/>}

                <div className="m-14">
                    {/* Judul */}
                    <h2 className="m-4 font-averta font-bold text-2xl text-center">Peminjaman</h2>

                    {/* Data Buku Dipinjam */}
                    <div className="m-10 p-4">
                        <h5 className="font-averta font-bold text-lg ml-10 mb-5">Buku yang Kupinjam</h5>
                        {this.state.loading ?
                            <div className="flex justify-center items-center">
                                <div className="md:mt-[10%] mt-[30%]">
                                    <Loading/>
                                </div>
                            </div>
                            :
                            <div className="">
                                {this.state.dataBukuDipinjam.map((bukuDipinjam) =>
                                    <div
                                        className="mb-6 bg-[#E6EFED] rounded rounded-lg border border-white hover:shadow-2xl hover:text-pGreen2">
                                        <div
                                            className="flex justify-around justify-items-center border border-x-0 border-b-2 border-t-0  border-[#8B9397]">
                                            <div className="ml-8 my-2 w-5/6 font-averta text-lg md:text-base"><b>Batas
                                                Pengembalian</b><br/>{bukuDipinjam.peminjaman.batasPengembalian}</div>
                                            <div className="my-2 flex text-right text-sm items-center">
                                                {bukuDipinjam.status === "Terlambat" ?
                                                    <div
                                                        className="p-2 bg-[#FF5353] font font-averta text-white rounded rounded-lg">Terlambat</div>
                                                    :
                                                    <>
                                                        {bukuDipinjam.status === "Perlu Dikembalikan" ?
                                                            <div
                                                                className="p-2 bg-[#FF9F02] font font-averta text-white rounded rounded-lg">{bukuDipinjam.status}</div>
                                                            : <div
                                                                className="p-2 bg-[#53BEB3] font font-averta text-white rounded rounded-lg">{bukuDipinjam.status}</div>
                                                        } </>
                                                }
                                            </div>
                                        </div>
                                        <div
                                            className="flex justify-around justify-items-center hover:shadow-2xl hover:text-pGreen2">
                                            <div className="ml-10 mr-4 w-24 rounded my-3 bg-black">
                                                <img className="m-0 rounded object-fill" src={bukuDipinjam.peminjaman.buku.gambarBuku}/>
                                            </div>
                                            <div className="flex items-center w-5/6 font-averta">
                                                <div>
                                                    <div
                                                        className="mb-1 font-averta font-bold text-lg md:text-base">{bukuDipinjam.peminjaman.buku.namaBuku}</div>
                                                    <div
                                                        className="mb-1 text-lg md:text-base">by {bukuDipinjam.peminjaman.buku.penulisBuku}</div>
                                                    <div
                                                        className="text-lg md:text-base"> Penerbit {bukuDipinjam.peminjaman.buku.penerbitBuku} ({bukuDipinjam.peminjaman.buku.tahunBuku})
                                                    </div>
                                                </div>
                                            </div>
                                            {bukuDipinjam.peminjaman.denda !== 0 ?
                                                <div className="grid grid-row-3 w-1/6 p-2 m-1">
                                                    <div className="row-1">
                                                    </div>
                                                    <div
                                                        className="flex font-averta border border-l-2 border-y-0 border-r-0  border-[#8B9397] text-center items-center row-2">
                                                        <div className="w-[100%]">
                                                            Total Denda:<br/>
                                                            <b>{bukuDipinjam.peminjaman.denda}</b>
                                                        </div>
                                                    </div>
                                                    <div className="row-3">
                                                    </div>
                                                </div> :
                                                <div className="mr7 w-24 sm:w-1/4 md:w-1/4 lg:w-120 p-2 m-1">
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    </div>

                    {/*Data Reservasi Buku*/}
                    <div className="m-10 p-4">
                        <h5 className="font-averta font-bold text-lg ml-10 mb-5">Reservasi</h5>
                        {this.state.loading ?
                            <div className="flex justify-center items-center">
                                <div className="md:mt-[10%] mt-[30%]">
                                    <Loading />
                                </div>
                            </div>
                            :
                            <div className="rounded rounded-lg bg-[#E6EFED]">
                                <Slider {...settingsReservasi}>
                                    {this.state.dataBukuReservasi.map((bukuReservasi) =>
                                        <div className="grid justify-items-center m-auto h-80 pt-2 pb-4">
                                            <div className="grid justify-items-center m-auto">
                                                <div className="w-28 h-48 flex items-center justify-items-center rounded">
                                                    <img className="m-0 rounded object-fill" src={bukuReservasi.buku.gambarBuku}/>
                                                </div>
                                                <div className="text-center font-averta">
                                                    <h3><b>{bukuReservasi.buku.namaBuku.slice(0,24)}{bukuReservasi.buku.namaBuku.length > 24 ? <span>...</span> : <></>}</b></h3>
                                                    <h3>{bukuReservasi.buku.penulisBuku.slice(0,24)}{bukuReservasi.buku.penulisBuku.length > 24 ? <span>...</span> : <></>}</h3>
                                                </div>
                                                <div className="my-3">
                                                    {bukuReservasi.buku.jml_tersedia === 0 ?
                                                    <div
                                                        className="w-32 p-2 pb-2.5 bg-[#FF9F02] font-averta text-center text-white rounded-md text-sm hover:bg-primary2"
                                                    >Mengantri
                                                    </div> :
                                                        <div
                                                            className="w-32 p-2 pb-2.5 bg-[#53BEB3] font-averta text-center text-white rounded-md text-sm hover:bg-primary2"
                                                        >Dapat dipinjam
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Slider>
                            </div>
                        }
                    </div>

                    {/* Data Buku Ulasan */}
                    <div className="m-10 p-4">
                        <h5 className="font-averta font-bold text-lg ml-10 mb-5">Beri Ulasan</h5>
                        {this.state.loading ?
                            <div className="flex justify-center items-center">
                                <div className="md:mt-[10%] mt-[30%]">
                                    <Loading />
                                </div>
                            </div>
                            :
                        <div className="rounded rounded-lg bg-[#E6EFED]">
                            <Slider {...settingsUlasan}>
                                {this.state.dataBukuUlasan.map((bukuUlasan) =>
                                <div className="grid justify-items-center m-auto h-80 pt-2 pb-4">
                                    <div className="grid justify-items-center m-auto">
                                        <div className="w-28 h-48 flex items-center justify-items-center rounded">
                                            <img className="m-0 rounded object-fill" src={bukuUlasan.buku.gambarBuku}/>
                                        </div>
                                        <div className="text-center font-averta">
                                            <h3><b>{bukuUlasan.buku.namaBuku.slice(0,24)}{bukuUlasan.buku.namaBuku.length > 24 ? <span>...</span> : <></>}</b></h3>
                                            <h3>{bukuUlasan.buku.penulisBuku.slice(0,24)}{bukuUlasan.buku.penulisBuku.length > 24 ? <span>...</span> : <></>}</h3>
                                        </div>
                                        <div className="my-3 ">
                                            <button
                                                className="w-1/8 bg-primary1 font-averta font-semibold text-white rounded-lg text-sm hover:bg-primary2"
                                            >
                                                <NavLink to={`/ulasan/${bukuUlasan.buku.idBuku}`} className="btn-green w-32"> Beri Ulasan </NavLink>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </Slider>
                        </div>
                        }
                    </div>
                </div>
            </>
        )
    }

}

export default DashboardPengguna;
