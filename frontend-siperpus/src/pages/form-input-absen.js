import React, {Component} from "react";
import APIConfig from "../api/APIConfig";
import Popup from "../components/popup";
import AuthService from "../services/auth-service";
import EventBus from "../common/EventBus";
import {Navigate} from "react-router-dom";

class FormInputAbsen extends Component{
    constructor(props) {
        super(props);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.handleKeyDownEnter = this.handleKeyDownEnter.bind(this);
        this.handleXWarning = this.handleXWarning.bind(this);
        this.handleXSuccess = this.handleXSuccess.bind(this);
        this.handleInputAbsen = this.handleInputAbsen.bind(this);
        this.checkEmptyInput = this.checkEmptyInput.bind(this);

        this.state = {
            username:"",
            loading:false,
            message: "",
            kosong:{},
            successful:false,
            authorize: true,
        }
    }

    componentDidMount() {
        this.checkAuthorize();
    }

    // Fungsi untuk Check Authorize Role
    checkAuthorize(){
        const user = AuthService.getCurrentUser();

        if (user === null || !user.roles.includes("ROLE_PENGUNJUNG")) {
            this.setState({
                authorize: false
            });
        }
    }

    // Menyimpan input username ke state
    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    // Fungsi jika user menekan enter di input
    handleKeyDownEnter(event){
        if (event.key === "Enter") {
            this.handleInputAbsen(event);
        }
    }

    // Fungsi untuk menghilangkan popup warning
    handleXWarning() {
        setTimeout(() => {
            this.setState({ message: "" });
        }, 3000);
    }

    // Fungsi untuk menghilangkan popup success
    handleXSuccess() {
        setTimeout(() => {
            this.setState({ successful: false,
                message: ""
            });
        }, 3000);
    }

    // POST data input absen
    handleInputAbsen(event){
        event.preventDefault();

        this.setState({
            message: "",
            loading: true,
            kosong: {}
        });

        const data = {
            username: this.state.username
        };

        // Cek Empty Input
        if (this.checkEmptyInput()) {

            // POST data ke Backend
            APIConfig.post("/absen", data).then(
                response => {
                    this.setState({
                        username: "",
                        message: response.data.message,
                        successful:true,
                    });

                    console.log(this.state.message)

                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage,
                        successful: false,
                    });
                    console.log(this.state.message)
                }
            );
        }
    }

    // Mengecek empty input (false if empty)
    checkEmptyInput(){
        let kosong = {};
        const pesan = "This field is required";

        if (this.state.username === ""){
            kosong["username"] = pesan;
        }
        if (this.state.password === ""){
            kosong["password"] = pesan;
        }


        if (Object.keys(kosong).length === 0){
            return true;
        }

        this.setState({ kosong: kosong })
        return false;
    }


    render() {
        return (
            <>
                {/* Check Role  */}
                {this.state.authorize ? <></> : <Navigate to={"/forbidden"}/>}

                <header>
                </header>
                <main>
                    <div className="mt-40 flex items-center">
                        <div className="w-full">
                            <div className="bg-white p-6 rounded-3xl md:w-3/4 mx-auto lg:w-1/2">

                                {/* Judul */}
                                <h2 className="font-avertaBold text-2xl mr-5 text-center mb-8">Absensi Perpustakaan</h2>
                                <form>

                                    {/* Username */}
                                    <div className="mb-5">
                                        <label htmlFor="username" className="block mb-1 font-avertaSemiBold text-black">Username</label>
                                        <input
                                            type="text"
                                            className="border border-gray-300 p-2 w-full rounded-md mb- shadow-lg"
                                            name="username"
                                            value={this.state.username}
                                            onKeyDown={this.handleKeyDownEnter}
                                            onChange={this.onChangeUsername}
                                        />
                                        {/* Field is Required */}
                                        <span className="text-red-600">{this.state.kosong["username"]}</span>
                                    </div>
                                </form>
                            </div>

                            {/* Tombol Absen */}
                            <div className="mt-5 text-center">
                                <button
                                    onClick={this.handleInputAbsen}
                                    className="btn-green"
                                >Absen</button>
                            </div>

                            {/* Popup Warning User Not Found */}
                            {this.state.message !== ""?
                                <>
                                {this.state.message !== "created"?
                                    <>
                                        {this.state.message === "Request failed with status code 400" ?
                                            <Popup type="warning" pesan="User not found"/>
                                            :<Popup type="warning" pesan={this.state.message}/>}
                                        {this.handleXWarning()}
                                    </>: <></>}
                                </>
                                : <></>}

                        </div>
                    </div>
                    {this.state.message === "created"?
                        <>
                            {this.state.successful ?
                                <>
                                    <Popup type="success" pesan="Absensi Berhasil, Selamat Datang di Perpustakaan!" />
                                    {this.handleXSuccess()}
                                </>
                                :<></>}
                        </>:<></>}
                </main>
            </>
        );
    }

}

export default FormInputAbsen;