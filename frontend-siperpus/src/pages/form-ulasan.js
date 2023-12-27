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

// Fungsi implementasi withRouter untuk react-router 6 diambil dari salah satu jawaban di:
// https://stackoverflow.com/questions/58548767/react-router-dom-useparams-inside-class-component

function withRouter(Component) {
    function ComponentWithRouter(props) {
        let params = useParams()
        return <Component {...props} params={params} />
    }
    return ComponentWithRouter
}

class FormUlasan extends Component{
    constructor(props){
        super(props);
        this.handleXSuccess = this.handleXSuccess.bind(this);
        this.handlePostUlasan = this.handlePostUlasan.bind(this);
        this.onChangeUlasan = this.onChangeUlasan.bind(this);
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
                idBuku:"",
                pindah: false,
                loading: true,
                ulasan:"",
                kosong: {},
                successful:false
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


    handleXSuccess() {
        setTimeout(() => {
            this.setState({ 
                successful: true,
                message: ""
            });
        }, 3000);
        setTimeout(() => {
            this.setState({ pindah: true,
                          });
        }, 4000);
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

    // Cek apakah input form kosong
    checkEmptyInput(){
        let kosong = {};
        const pesan = "This field is required";
        if (this.state.ulasan === ""){
            kosong["ulasan"] = pesan;
        }

        if (Object.keys(kosong).length === 0){
            return true;
        }

        this.setState({ kosong: kosong })
        return false;
    }

    // POST Ulasan
    handlePostUlasan(e) {
        e.preventDefault();
        const data = {
            isiUlasan: this.state.ulasan
        };

        console.log(data);
        if (this.checkEmptyInput()) {
            this.setState({ kosong: {} })
            APIConfig.post(`/ulasan/${this.props.params.idBuku}`, data).then(
                response => {
                    this.setState({
                        ulasan:"",
                        successful:true,
                    });
                    console.log(this.state.ulasan);
                    console.log(this.props.params.idBuku);
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

                }
            );
        }
    }

    onChangeUlasan(e){
        this.setState({
            ulasan: e.target.value
        });
    }


    render() {
        const color_1  = "bg-[#53BEB3] mt-6 p-2 text-white w-24 border rounded-lg font-semibold uppercase";
        const color_2  = "bg-[#FF5353] mt-6 p-2 text-white w-24 border rounded-lg font-semibold uppercase";

        const cssdivgambarbuku1 = "xl:w-64 mt-12 flex justify-end place-self-center";
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
                        <h2 className=" mt-10 ourFont font-bold text-3xl text-center">Ulasan</h2>
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
                        cssdivgambarbuku={this.state.showStaffBoard ? cssdivgambarbuku1: cssdivgambarbuku2}
                    />

                        {/* Form Ulasan Buku */}
                        <form onSubmit={this.handlePostUlasan} method="POST">
                            {/* Body form */}
                            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">

                                {/* Isi Ulasan  */}
                                <div className="col-span-6 sm:col-span-3 mt-3">
                                    <label className="block text-lg font-bold text-gray-700">
                                        Ulasan
                                    </label>
                                    <textarea
                                        type="textarea"
                                        name="ulasan"
                                        className="order border-gray-300 p-2 w-full h-48 rounded-md mb- shadow-lg vertical-align: top"
                                        value={this.state.ulasan}
                                        onChange={this.onChangeUlasan}
                                    />
                                    <span className="text-red-600">{this.state.kosong["ulasan"]}</span>
                                </div>


                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <div className="flex justify-end gap-6">
                                        <NavLink to="/dashboard">
                                            <button
                                                type="submit"
                                                className="btn-outline-green"
                                            >Kembali
                                            </button>
                                        </NavLink>
                                        <button
                                            type="submit"
                                            className="btn-green"
                                            onClick={this.handlePostUlasan}
                                        > Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        {/* Popup jika sukses */}
                        {this.state.successful ?
                            <>
                                <Popup type="success" pesan="Ulasan berhasil ditambahkan!" />
                                {this.handleXSuccess()}
                            </>
                            :<></>}
                        {this.state.pindah ? <Navigate to={"/buku"}/> : <></>}
                        {/* <!-- /End replace --> */}

                    </div>
                    
                }
                </main>

            </>

        );
    }
}

const FormUlasanWithParam = withRouter(FormUlasan);

export default FormUlasanWithParam;