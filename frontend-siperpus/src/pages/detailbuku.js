import Book from "../components/book";
import React, { Component } from "react";
import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import {position} from "tailwindcss/lib/util/dataTypes";
import searchIcon from "../pictures/searchIcon.png";
import {Link, NavLink, useHistory} from "react-router-dom";
import AuthService from "../services/auth-service";
import { useParams } from "react-router-dom";
import log from "tailwindcss/lib/util/log";
import Bookdetail from "../components/bookdetail";
import EventBus from "../common/EventBus";
import Popup from "../components/popup";
import ConfDelPopUp from "../components/confDel-popup";
import { Navigate } from "react-router-dom";
import profileImg from "../pictures/Profile Logo.png";
import Slider from 'react-slick';

// Fungsi implementasi withRouter untuk react-router 6 diambil dari salah satu jawaban di:
// https://stackoverflow.com/questions/58548767/react-router-dom-useparams-inside-class-component

function withRouter(Component) {
    function ComponentWithRouter(props) {
        let params = useParams()
        return <Component {...props} params={params} />
    }
    return ComponentWithRouter
}

class Detailbuku extends Component{
    constructor(props){
        super(props);
        this.handleXSuccess = this.handleXSuccess.bind(this);
        this.deleteBuku = this.deleteBuku.bind(this);
        this.handleConfirmPopupAction = this.handleConfirmPopupAction.bind(this);
        this.handleShowPopupConf = this.handleShowPopupConf.bind(this);
        this.handleReservasi = this.handleReservasi.bind(this);
        this.successReserve = this.successReserve.bind(this);
        this.state = {
            book:[],
            namaBuku:"",
            gambarBuku:"",
            penulisBuku:"",
            penerbitBuku:"",
            kategoriBuku:"",
            tahunBuku:0,
            showStaffBoard: false,
            showKepalaBoard: false,
            showPenggunaBoard: false,
            currentUser: {},
            statusBuku:"",
            warnaStatus:"",
            successfulDelete: false,
            confirmDelete: false,
            idBuku:"",
            pindah: false,
            loading: true
        };
    }

    async loadDetailBuku(){
        try{
            const { data } = await APIConfig.get(`/books/${this.props.params.idBuku}`);
            this.setState({book:data.result}, () => console.log(this.state.book));
            //this.setState({penulisBuku:this.state.book.penulisBuku}, () => console.log(this.state.penulisBuku));
            this.setState({ loading: false });
        }
        catch (error){
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    // Fungsi untuk memunculkan popup
    handleShowPopupConf(id){
        this.setState({
            confirmDelete: true,
            idBuku: id
        });
    }

    // Fungsi ketika user melakukan suatu action pada Popup confirmation
    handleConfirmPopupAction(action){
        this.setState({
            confirmDelete: false
        });

        // console.log(action)

        if (action) {
            this.deleteBuku();
        }
    }

    deleteBuku(event) {
        APIConfig.delete(`/books/${this.props.params.idBuku}`).then(
            response => {
                //this.loadDataBuku();
                this.setState({
                    // judul: "",
                    // tahun: "",
                    // penulis: "",
                    // penerbit: "",
                    // kategori: "",
                    // gambar: "",
                    message: response.data,
                    successfulDelete: true
                });
                // console.log(response);
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


                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }

            }
        );
        //this.loadDataBuku();
    }

    handleReservasi(event) {
        event.preventDefault();
        const data = {
            idBuku: this.state.idBuku,
        };
        // console.log(data);

        APIConfig.post(`/reservasi`, data).then(
            response => {
                this.setState({
                    idBuku: "",
                    successful:true,
                });
                console.log(response);
            },
            error => {
                this.setState({
                    message:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                    successful:false
                });

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }

            }
        );
    }

    handleXSuccess() {
        setTimeout(() => {
            this.setState({
                successfulDelete: false,
                message: ""
            });
        }, 3000);
        setTimeout(() => {
            this.setState({
                pindah: true,
            });
        }, 4000);
    }

    successReserve() {
        setTimeout(() => {
            this.setState({
                successful: false,
                message: ""
            });
        }, 3000);

        this.loadDetailBuku();
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        this.setState({idBuku:this.props.params.idBuku});

        if (user) {
            this.setState({
                    currentUser: user,
                    showStaffBoard: user.roles.includes("ROLE_STAFF"),
                    showKepalaBoard: user.roles.includes("ROLE_KEPALA"),
                    showPenggunaBoard: user.roles.includes("ROLE_PENGGUNA"),
                },
                console.log(this.state.currentUser)
            );
        }

        this.loadDetailBuku();
    }



    render() {

        {/* CSS  untuk buku available */}
        const color_1  = "bg-[#53BEB3] mt-6 p-2 text-white w-24 border rounded-lg font-semibold uppercase";

        {/* CSS  untuk buku non-available */}
        const color_2  = "bg-[#FF5353] mt-6 p-2 text-white w-24 border rounded-lg font-semibold uppercase";

        {/* CSS  untuk role non-staff */}
        const cssdivgambarbuku1 = "xl:w-64 mt-12 flex justify-end place-self-center";

        {/* CSS  untuk role staff */}
        const cssdivgambarbuku2 = "xl:w-64 mt-0 flex justify-end place-self-center";

        const tombol =
            <>
                <div className="mt-6 md:mt-0">
                    <NavLink to={`/buku/ubah/${this.props.params.idBuku}`}>
                        <button
                            type="submit"
                            className="btn-green mx-4"
                        >Ubah
                        </button>
                    </NavLink>
                    {this.state.showStaffBoard &&

                    <button
                        className="btn-red"
                        onClick={() => this.handleShowPopupConf(this.props.params.idBuku)}
                    >Hapus
                    </button>

                    }
                </div>
                <br/>
            </>;
        const settings = {
            dots: true,
            autoplay: true,
            infinite: 6,
            slidesToShow: Math.min(3, this.state.book.listUlasan?.length),
            slidesToScroll: 1
        };
        
        // const tombol_reserve = 
        // <>
        //     <div className="mt-6 md:mt-0">
        //         <NavLink to={`/buku/ubah/${this.props.params.idBuku}`}>
        //         <button
        //             type="submit"
        //             className="btn-green mx-4"
        //         >Ubah
        //         </button>
        //         </NavLink>
        //         {this.state.showStaffBoard &&

        //         <button
        //             className="btn-red"
        //             onClick={() => this.handleShowPopupConf(this.props.params.idBuku)}
        //         >Hapus
        //         </button>

        //         }
        //     </div>
        //         <br/>
        //     </>;

        return (
            <>
                <main>
                    {this.state.loading ?

                        <div className="flex h-screen">
                            <div className="m-auto">
                                <Loading />
                            </div>
                        </div> :
                        <div className="container mx-auto">
                            <h2 className=" mt-10 ourFont font-bold text-3xl text-center">{this.state.book.namaBuku}</h2>
                            <Bookdetail
                                //nama={this.state.book.namaBuku}
                                gambar = {this.state.book.gambarBuku}
                                id={this.state.book.idBuku}
                                penulis={this.state.book.penulisBuku}
                                penerbit={this.state.book.penerbitBuku}
                                kategori={this.state.book.kategoriBuku}
                                tahun={this.state.book.tahunBuku}
                                jml_tersedia={this.state.book.jml_tersedia}
                                deskripsi={this.state.book.deskripsi}
                                status={this.state.book.statusBuku}
                                warnastatus={this.state.book.statusBuku === "available"? color_1: color_2 }
                                tombolubah={this.state.showStaffBoard ? tombol: null}
                                cssdivgambarbuku={this.state.showStaffBoard ? cssdivgambarbuku1: cssdivgambarbuku2}
                                jmlReservasi={this.state.book.listReservasi?.length}

                            />

                            {this.state.showStaffBoard &&
                            <div className="flex-col">
                                <div className="mt-20 ml-48 font-bold text-lg">
                                    Daftar Antrian Peminjaman:
                                </div>
                                <div className="ml-48 mb-20">
                                    {this.state.book.listReservasi?.map((reservasi, no) =>
                                        <p>{no + 1}. {reservasi.user.name}</p>
                                    )}
                                </div>
                            </div>
                        }

                         {this.state.showPenggunaBoard &&
                            <div className=" my-2 sm:mx-6 sm:px-6 lg:mx-8">
                                <div className="mt-20 ml-48 font-bold text-lg">
                                    Ulasan Buku
                                </div>
                                <div className="lg:ml-44 mr-20 mb-20 gap-4 pt-4">
                                {/* {this.state.book.listUlasan.length >= 3 &&  */}
                                <Slider {...settings}>
                                    {this.state.book.listUlasan?.map((ulasan) => 
                                        <div className="p-6 flex flex-col bg-[#E6EFED] m-4 rounded">
                                            <div className="gap-4 grid grid-flow-col auto-cols-max">
                                                <div>
                                                <img src={profileImg} className="h-8"/>
                                                </div>
                                                <div>
                                                    <strong>{ulasan.user.name}</strong>
                                                    <br></br>
                                                    {ulasan.user.username}
                                                </div>
                                                </div>
                                                
                                                <div></div>
                                                {/* <div className="col-span-2">{ulasan.user.username}</div> */}
                                            <br></br>
                                            {ulasan.isiUlasan}
                                        </div>
                                    )}
                                    </Slider>
                                    {/* } */}
                                </div>
                            </div>
                        }

                        
                        

                            <div className="bg-gray-50 text-right sm:px-6">
                                <div className="flex justify-end gap-6">

                                    <Link to="/buku">
                                        <button
                                            className="btn-outline-green"
                                        >Kembali
                                        </button>
                                    </Link>


                                    {this.state.showPenggunaBoard && this.state.book.listReservasi?.length >= 0 && this.state.book.statusBuku === "Dipinjam" &&
                                    <div>
                                        {this.state.book.listReservasi?.find(reservasi => reservasi.user.name === this.state.currentUser.name) ?

                                            <div>
                                                <button
                                                    type="submit"
                                                    className="btn-gray"
                                                    disabled
                                                > Reservasi
                                                </button>
                                            </div>:

                                            <div>
                                                <button
                                                    type="submit"
                                                    className="btn-green"
                                                    onClick={this.handleReservasi}
                                                > Reservasi
                                                </button>
                                            </div>
                                        }

                                    </div>
                                    }


                                    {/* {this.state.showStaffBoard &&
                                <button
                                    className="btn-red"
                                    onClick={this.deleteBuku}
                                > Hapus
                                </button>

                                } */}
                                </div>
                            </div>


                            <br/>
                            <br/>
                            <br/>

                            {this.state.successful ?
                                <>
                                    <Popup type="success" pesan="Reservation successfully added" />
                                    {this.successReserve()}
                                </>
                                :<></>}

                            {this.state.successfulDelete ?
                                <>
                                    <Popup type="success" pesan="Book successfully deleted" />
                                    {this.handleXSuccess()}
                                </>
                                :<></>}

                            {/* Confirmation Pop Up */}
                            {this.state.confirmDelete && <ConfDelPopUp onConfirmChange={this.handleConfirmPopupAction}
                                                                       id={this.props.params.idBuku}
                                                                       judul="Hapus Buku"
                                                                       deskripsi="Apakah anda yakin ingin menghapus buku ini? Data yang anda hapus akan secara permanent dihapus dari database."/>}

                            {this.state.pindah ? <Navigate to={"/buku"}/> : <></>}
                        </div>
                    }
                </main>

            </>

        );
    }
}

const DetailBukuWithParam = withRouter(Detailbuku);

export default DetailBukuWithParam;
