import React, { Component } from "react";
import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import AuthService from "../services/auth-service";
import EventBus from "../common/EventBus";
import {Navigate, NavLink, useNavigate, useParams} from "react-router-dom";
import Popup from "../components/popup";


class CreatePengumuman extends Component{
    constructor(props){
        super(props);
        this.onChangeIsi = this.onChangeIsi.bind(this);
        this.onChangeSubjek = this.onChangeSubjek.bind(this);
        this.handlePostPengumuman = this.handlePostPengumuman.bind(this);
        this.handleXSuccess = this.handleXSuccess.bind(this);
        this.getAccurateDateToday = this.getAccurateDateToday.bind(this);
        this.state = {
            showStaffBoard: false,
            showKepalaBoard: false,
            showPenggunaBoard: false,
            authorize:true,
            loading: true,
            message:"",
            pengumumanData:[],
            kosong:{},

            subjek:"",
            tanggal: this.getAccurateDateToday(),
            isi:"",
            userKepala:"",

            data:"",
            successful: false,
            success:false
        };
    }

    componentDidMount() {
        console.log(this.state.tanggal);
        this.checkAuthorize();
    }

    getAccurateDateToday() {
        // Format tanggal di db: yyyy-mm-dd

        let date = (new Date().getDate()).toString();
        let month =  (new Date().getMonth() +1).toString(); //dapetin bulan berupa index+1
        let year = (new Date().getFullYear()).toString();

        if (month < 10 && date<10) {
            return (year + "-0" + month + "-0" + date );
        }
        else if (month < 10 && date>9){
            return (year + "-0" + month + "-" + date );
        }
        else if (month > 10 && date<10){
            return (year + "-" + month + "-0" + date);
        }
        else{
            return (year + "-" + month + "-" + date );
        }
    }

    checkAuthorize(){
        const userr = AuthService.getCurrentUser();

        if (userr === null || !userr.roles.includes("ROLE_KEPALA")) {

            this.setState({authorize:false}, () => console.log(this.state.authorize));
            this.setState({userKepala:userr}, () => console.log(this.state.userKepala));
        } else{
            this.setState({userKepala:userr}, () => console.log(this.state.userKepala));
        }


    }

    handleXSuccess() {
        setTimeout(() => {
            this.setState({ successful: false,
                message: ""
            });
        }, 3000);

    }

    onChangeIsi(e){
        this.setState({
            isi: e.target.value
        });
    }

    onChangeSubjek(e){
        this.setState({
            subjek: e.target.value
        });
    }

    // Cek apakah input form kosong
    checkEmptyInput(){
        let kosong = {};
        const pesan = "This field is required";
        if (this.state.isi === ""){
            kosong["isi"] = pesan;
        }
        if (this.state.subjek === ""){
            kosong["subjek"] = pesan;
        }

        if (Object.keys(kosong).length === 0){
            return true;
        }

        this.setState({ kosong: kosong })
        return false;
    }

    // POST pengumuman baru
    handlePostPengumuman(e) {
        e.preventDefault();
        const data = {
            isiPengumuman: this.state.isi,
            subjekPengumuman: this.state.subjek,
            tglPengumuman: this.state.tanggal,
            user:this.state.userKepala

        };
        console.log(data);
        if (this.checkEmptyInput()) {
            this.setState({ kosong: {} })
            APIConfig.post(`/pengumuman`, data).then(
                response => {
                    this.setState({
                        isi: "",
                        subjek:"",
                        userKepala:"",
                        tanggal:new Date().toISOString().slice(0, 10),
                        successful:true,
                        success:true
                    });
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

    // Delete pengumuman
    deletePengguna(id) {
        APIConfig.delete(`/users/${id}`).then(
            response => {
                this.loadDataPengguna();
                this.setState({
                    message: response.data,
                    success: true
                });
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
        this.loadDataPengguna();
    }

    render(){
        return(
            <>
                {/* Check Role  */}
                {this.state.authorize ? <></> : <Navigate to={"/forbidden"}/>}

                <header className="bg-white" align="center">
                    <div className="text-center text-2xl max-w-xl mb-5 mb:10 sm:py-6 md:py-6 lg:py-6 mx-auto">
                        <p><b>Pengumuman Baru</b></p>
                    </div>
                </header>

                <form onSubmit={this.handlePostPengumuman} method="POST">
                    {/* Info user yang membuat pengumuman (hidden)  */}
                    <input
                        type="hidden"
                        name="userKepala"
                        id="userKepala"
                        value={this.state.userKepala}
                    />

                    {/* Tanggal hari ini (hidden) */}
                    <input
                        type="hidden"
                        value={this.state.tanggal}
                    />

                    {/* Body form */}
                    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">

                        {/* Subjek pengumuman */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="subjek" className="block text-sm font-medium text-gray-700">
                                Subjek
                            </label>
                            <input
                                type="text"
                                name="subjek"
                                id="subjek"
                                className="order border-gray-300 p-2 w-full rounded-md mb- shadow-lg"
                                value={this.state.subjek}
                                onChange={this.onChangeSubjek}
                            />
                            <span className="text-red-600">{this.state.kosong["subjek"]}</span>
                        </div>

                        {/* Isi pengumuman  */}
                        <div className="col-span-6 sm:col-span-3 mt-3">
                            <label htmlFor="isi" className="block text-sm font-medium text-gray-700">
                                Isi
                            </label>
                            <textarea
                                type="textarea"
                                name="isi"
                                id="isi"
                                className="order border-gray-300 p-2 w-full h-48 rounded-md mb- shadow-lg vertical-align: top"
                                value={this.state.isi}
                                onChange={this.onChangeIsi}
                            />
                            <span className="text-red-600">{this.state.kosong["isi"]}</span>
                        </div>


                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <div className="flex justify-end gap-6">
                                <NavLink to="/pengumuman">
                                    <button
                                        type="submit"
                                        className="btn-outline-green"
                                    >Kembali
                                    </button>
                                </NavLink>
                                <button
                                    type="submit"
                                    className="btn-green"
                                    onClick={this.handlePostPengumuman}
                                >Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Popup jika sukses */}
                {this.state.successful ?
                    <>
                        <Popup type="success" pesan="Pengumuman berhasil ditambahkan!" />
                        {this.handleXSuccess()}
                    </>
                    :<></>}


            </>
        )
    }











}

export default CreatePengumuman;
