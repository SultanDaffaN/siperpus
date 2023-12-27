import React, { Component } from "react";
import Popup from "../components/popup";
import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import EventBus from "../common/EventBus";
import { NavLink } from "react-router-dom";
import AuthService from "../services/auth-service";
import { Navigate } from "react-router-dom";

class FormPeminjaman extends Component {
    constructor(props) {
    super(props);
    this.loadDataPengguna = this.loadDataPengguna.bind(this);
    this.loadDataBuku = this.loadDataBuku.bind(this);
    this.onChangeJudul = this.onChangeJudul.bind(this);
    this.onChangePeminjam = this.onChangePeminjam.bind(this);
    this.onChoiceJudul = this.onChoiceJudul.bind(this);
    this.onSelectedBook = this.onSelectedBook.bind(this);
    this.onChoicePeminjam = this.onChoicePeminjam.bind(this);
    this.onChangeTanggal = this.onChangeTanggal.bind(this);
    this.changeFormatDate = this.changeFormatDate.bind(this);
    this.deleteItemBookSelected = this.deleteItemBookSelected.bind(this);
    this.handlePeminjaman = this.handlePeminjaman.bind(this);
    this.handleXSuccess = this.handleXSuccess.bind(this);
    this.checkEmptyInput = this.checkEmptyInput.bind(this);
    this.deleteItemBookSelected = this.deleteItemBookSelected.bind(this);
    this.handleXWarning = this.handleXWarning.bind(this);
    this.checkAuthorize = this.checkAuthorize.bind(this);
    this.onKeyDownSelect = this.onKeyDownSelect.bind(this);
    this.onKeyDownSelect2 = this.onKeyDownSelect2.bind(this);
    

      this.state = {
        judul:"",
        peminjam:"",
        tanggal:"",
        selected: false,
        selected2: false,
        selectedBook: [],
        selectedPeminjam: "",
        dataPengguna:[],
        dataBuku:[],
        successful: false,
        message: "",
        kosong: {},
        errors: {},
        pesan: "created",
        tanggal: new Date().toLocaleDateString(),
        bukuAvailable: true,
        noDataBuku: false,
        authorize: true,
        bukuSudahTerpilih: false,
        indexSelect: 0,
        indexSelect2: 5,
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
            this.loadDataPengguna();
            this.loadDataBuku();
        }
    }

    onChangeJudul(e) {
        this.setState({
          judul: e.target.value,
          selected: false,
          indexSelect: 0
        });
        this.loadDataBuku();
    }

    onChangeTanggal(e){
        const date = this.changeFormatDate(e.target.value)
        this.setState({
            tanggal: date
        });
        
    }

    // fungsi ketika memilih pilihan buku
    onChoiceJudul(buku){
        this.setState({
            judul: buku.namaBuku,
            selected: true,
            dataBuku: [buku]
          });
        this.loadDataBuku();
    }

    // Funsi ketika key down memilih
    onKeyDownSelect(e){
        if (e.keyCode === 13 && this.state.dataBuku[0].namaBuku !== this.state.judul) {
            e.preventDefault();
            let namaBuku = document.getElementById(this.state.indexSelect).textContent;
            let buku;
            this.state.dataBuku.forEach(book => {
                if (book.namaBuku === namaBuku) {
                    buku = book;
                }
            });

            this.setState({
                judul: buku.namaBuku,
                selected: true,
                indexSelect: 0,
                dataBuku: [buku]
            });
        }

        let batasBawah = this.state.dataBuku.length < 5 ? this.state.dataBuku.length : 5; 
        if (e.keyCode === 40 && this.state.indexSelect < batasBawah - 1) {
            this.setState( prevState => ({
                indexSelect: prevState.indexSelect + 1
              }))
        }

        else if (e.keyCode === 38 && this.state.indexSelect > 0){
            this.setState( prevState => ({
                indexSelect: prevState.indexSelect - 1
              }))
        }
    }

    onKeyDownSelect2(e){
        if (e.keyCode === 13 && this.state.dataPengguna.length !== 0) {
            e.preventDefault();
            let namaPeminjam = document.getElementById(this.state.indexSelect2).textContent;
            let usernamePeminjam;
            this.state.dataPengguna.forEach(pengguna => {
                if (pengguna.name === namaPeminjam) {
                    usernamePeminjam = pengguna.username;
                }
            });

            this.setState({
                indexSelect2: 5,
                dataPengguna: []
            })
            this.onChoicePeminjam(namaPeminjam, usernamePeminjam);
        }

        let batasBawah = this.state.dataPengguna.length < 4 ? this.state.dataPengguna.length : 4;
        if (e.keyCode === 40 && this.state.indexSelect2 < batasBawah + 4) {
            this.setState( prevState => ({
                indexSelect2: prevState.indexSelect2 + 1
              }))
        }

        else if (e.keyCode === 38 && this.state.indexSelect2 > 5){
            this.setState( prevState => ({
                indexSelect2: prevState.indexSelect2 - 1
              }))
        }
    }

    // fungsi ketika klik Pilih button
    onSelectedBook(e, buku) {
        e.preventDefault();

        let selectedBook = this.state.selectedBook;
        if (this.state.judul !== ""){
            if (this.state.dataBuku.length > 0) { 
                if (buku.statusBuku === "available"){
                    if(selectedBook.some(book => book.idBuku === buku.idBuku)){
                       this.setState({
                           bukuSudahTerpilih: true
                       }) 
                    }

                    else{
                        selectedBook.push(buku);
                    }
            
                    this.setState({
                        selectedBook: selectedBook,
                        judul: "",
                    });
            
                    this.setState(prevState => ({
                        kosong: {                  
                            ...prevState.kosong,    
                            successAddBook: ""      
                        }
                    }));
                }
        
                else {
                    this.setState({
                        bukuAvailable: false,
                        judul: ""
                    });
                }
            } 

            else {
                this.setState({
                    noDataBuku: true
                });
            }
        }
        
    }

    deleteItemBookSelected(e, idBuku){
        e.preventDefault();
        let newSelectedBook = this.state.selectedBook;

        newSelectedBook = newSelectedBook.filter(function( buku ) {
            return buku.idBuku !== idBuku;
        });

        this.setState({
            selectedBook: newSelectedBook
        });
    }

    onChangePeminjam(e) {
        this.setState({
          peminjam: e.target.value,
          selected2: false
        });
        this.loadDataPengguna();
    }

    // fungsi ketika memilih pilihan peminjam
    onChoicePeminjam(namaPeminjam, usernamePeminjam){
        this.setState({
            peminjam: namaPeminjam,
            selected2: true,
            selectedPeminjam: usernamePeminjam
          });
    }

    changeFormatDate(dateInput){
        let date = new Date(dateInput)
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

    checkEmptyInput(){
        let kosong = {};
        const isiDulu = "This field is required";
        if (this.state.selectedBook.length === 0){
          kosong["successAddBook"] = isiDulu;
        }
        if (this.state.peminjam === ""){
          kosong["peminjam"] = isiDulu;
        }
    
        if (Object.keys(kosong).length === 0){
          return true;
        }
    
        this.setState({ kosong: kosong })
        return false;
    }

    handlePeminjaman(e){
        e.preventDefault()
        let listSelectedBook = this.state.selectedBook.map(buku => buku.idBuku); 

        if (this.checkEmptyInput()) {
            this.setState({ kosong: {} })
        
            listSelectedBook.forEach(idBuku => {
                const data = {
                    username: this.state.selectedPeminjam,
                    tgl_peminjaman: this.state.tanggal,
                    idBuku: idBuku
                };
                
            APIConfig.post("/peminjaman", data).then(
                response => {
                    this.setState({
                        judul: "",
                        tanggal: new Date().toLocaleDateString(),
                        peminjam: "",
                        selectedBook:[],
                        success: true,
                        pesan: response.data.message
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
                        if (error.response && error.response.status === 401) {
                            EventBus.dispatch("logout");
                        }
                    }
                );
    
            });
        
        }
        
    }

    handleXSuccess() {
        setTimeout(() => {
          this.setState({ 
                success: false,
                pesan: "created"});
        }, 3000);
      }

    handleXWarning() {
        setTimeout(() => {
            this.setState({ 
                bukuAvailable: true,
                noDataBuku: false,
                bukuSudahTerpilih: false,
                judul: ""
            });
        }, 3000);
    }

    loadDataPengguna() {
        APIConfig.get("/users/pengguna").then(
            response => {
                if (this.state.peminjam === "") {
                    this.setState({ dataPengguna: response.data.result });
                }
                else {
                    const resultValue = response.data.result.filter((pengguna) =>
                                                                    pengguna.name.toLowerCase().includes(this.state.peminjam.toLowerCase()));
                    
                    this.setState({ dataPengguna: resultValue });
                }

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
          
    }

    loadDataBuku() {
        APIConfig.get("/books").then(
            response => {
                if (this.state.judul === "") {
                    this.setState({ dataBuku: response.data.result });
                }
                else {
                    const resultValue = response.data.result.filter((buku) =>
                                                                    buku.namaBuku.toLowerCase().includes(this.state.judul.toLowerCase()));
                    
                    this.setState({ dataBuku: resultValue });
                }

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
        
    }
  
    render() {
      return (
        <>
            {/* Check Role  */}
            {this.state.authorize ? <></> : <Navigate to={"/forbidden"}/>}

            <header className="bg-white" align="center">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Form Peminjaman</h1>
                </div>
            </header>
                <main>
                    <div>
                        <form onSubmit={this.handlePeminjaman} method="POST">
                            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">

                                    {/* 1.Judul Buku Section */}
                                    <div className="col-span-6 sm:col-span-3 relative">
                                        <label htmlFor="judul" className="block text-sm font-medium text-gray-700" >
                                            Judul Buku
                                        </label>
                                        <div className="flex">
                                            <div className="relative w-full">
                                                <input
                                                    type="text"
                                                    name="judul"
                                                    id="judul"
                                                    onKeyDown={this.onKeyDownSelect}
                                                    onChange={this.onChangeJudul}
                                                    value={this.state.judul}
                                                    autoComplete="off"
                                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />

                                                {/* Pilihan-pilihan Buku */}
                                                {this.state.judul !== "" && !this.state.selected ? 
                                                <div className="absolute w-full top-10 z-50 bg-white rounded-b-lg border-2 border-gray-200">
                                                {this.state.dataBuku.slice(0, 5).map((buku, index) => buku.statusBuku === "available" ? 
                                                                                                <li className={`cursor-pointer list-none p-2 border-b-2 border-l-4 border-l-white hover:border-l-4 hover:border-gray-100 hover:bg-gray-100 ${this.state.indexSelect === index ? "border-l-4 border-l-pGreen2 bg-gray-100" : null}`}
                                                                                                    onClick={() => this.onChoiceJudul(buku)}  
                                                                                                    key={buku.idBuku}
                                                                                                ><div id={index}>{buku.namaBuku}</div></li>:
                                                                                                
                                                                                                <li className={`flex justify-between cursor-pointer list-none p-2 border-b-2 border-l-4 border-l-white  hover:border-l-4 hover:border-gray-100 hover:bg-gray-100 ${this.state.indexSelect === index ? "border-l-4 border-l-pGreen2 bg-gray-100" : null}`} 
                                                                                                    onClick={() => this.onChoiceJudul(buku)}  
                                                                                                    key={buku.idBuku}
                                                                                                ><div id={index}>{buku.namaBuku}</div> <div className="text-iRed3">Tidak Tersedia</div></li>)
                                                }
                                                </div>
                                                : <></>}
                                            </div>


                
                                            <button className="ml-3 border border-gray-300 w-11 h-10 rounded-full shadow-lg" onClick={(e) => this.onSelectedBook(e, this.state.dataBuku[0])}>+</button>

                                        </div>

                                        {/* Buku terpilih */}
                                        {this.state.selectedBook.length === 0 ? <></>
                                        :
                                        <div className="flex flex-wrap">
                                            {this.state.selectedBook.map((book) =>
                                                                    // Satuan Buku terpilih
                                                                    <div key={book.idBuku} className="flex border-2 border-gray-200 rounded-full mt-3 ml-2">
                                                                        <div className="text-sm px-2">{book.namaBuku}</div>
                                                                        <svg className="fill-current h-6 w-6 text-red-500 mr-1" 
                                                                            role="button" xmlns="http://www.w3.org/2000/svg" 
                                                                            viewBox="0 0 20 20"
                                                                            onClick={(e) => this.deleteItemBookSelected(e, book.idBuku)}
                                                                            >
                                                                            <title>Delete</title>
                                                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                                                                        </svg>
                                                                    </div>
                                                                    )}
                                        </div>
                                        }
                                        <span className="text-red-600">{this.state.kosong["successAddBook"]}</span>
                                    </div>
                                    
                                    {/* 2.Peminjam Section */}
                                    <div className="col-span-6 sm:col-span-3 relative">
                                        <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">
                                            Nama Peminjam 
                                        </label>
                                        <input
                                            type="text"
                                            name="peminjam"
                                            id="peminjam"
                                            value={this.state.peminjam}
                                            onChange={this.onChangePeminjam}
                                            onKeyDown={this.onKeyDownSelect2}
                                            autoComplete="off"
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />

                                        {/* Pilihan-pilihan Peminjam */}
                                        {this.state.peminjam !== "" && !this.state.selected2 ? 
                                        <div className="absolute w-full z-50 bg-white rounded-b-lg border-x-2 border-gray-200 ">    
                                            {this.state.dataPengguna.slice(0, 4).map((peminjam, index) => <li className={`cursor-pointer list-none p-2 border-b-2 border-l-4 border-l-white hover:border-l-4 hover:border-gray-100 hover:bg-gray-100 ${this.state.indexSelect2 === index + 5 ? "border-l-4 border-l-pGreen2 bg-gray-100" : null}`}
                                                                                            onClick={() => this.onChoicePeminjam(peminjam.name, peminjam.username)}  
                                                                                            key={peminjam.id}
                                                                                            id={index + 5}
                                                                                            >{peminjam.name}</li>)
                                            }
                                        </div>
                                            : <></>}
                                        <span className="text-red-600">{this.state.kosong["peminjam"]}</span>
                                    </div>

                                    {/* 3.Tanggal Peminjaman Section */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                            Tanggal Peminjaman
                                        </label>
                                        <input
                                            type="date"
                                            name="tanggal"
                                            id="tanggal"
                                            onChange={this.onChangeTanggal}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Tombol Kembali dan Pinjamkan */}
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 pb-8">
                                    <div className="flex justify-end gap-6">
                                        <NavLink to={"/"}>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-end py-2 px-4 border border-pGreen1 shadow-sm text-sm font-medium rounded-md text-pGreen1 bg-white hover:border-transparent hover:bg-pGreen1 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >   Kembali
                                            </button>
                                        </NavLink>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-end py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pGreen1 hover:outline-pGreen3 hover:bg-pGreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >Pinjamkan
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* Popup Sukses */}
                    {this.state.success ? 
                    <>
                        <Popup type="success" pesan="Peminjaman berhasil disimpan!" />
                        {this.handleXSuccess()}
                    </>
                    :<></>}

                    {/* Popup Gagal */}
                    {this.state.pesan !== "created" ?
                    <>
                        <Popup type="danger" pesan={this.state.pesan} />
                        {this.handleXSuccess()}
                    </>
                    :<></>}

                    {/* Popup Buku Tidak Tersedia */}
                    {!this.state.bukuAvailable ?
                    <>
                        <Popup type="warning" pesan="Buku sedang Tidak Tersedia!" />
                        {this.handleXWarning()}
                    </>
                    :<></>}

                    {/* Popup Buku Sudah terpilih */}
                    {this.state.bukuSudahTerpilih ?
                    <>
                        <Popup type="warning" pesan="Buku Sudah Terpilih!" />
                        {this.handleXWarning()}
                    </>
                    :<></>}

                    {/* Popup Buku Tidak Tersedia */}
                    {this.state.noDataBuku ?
                    <>
                        <Popup type="warning" pesan="Buku tidak ada dalam sistem perpustakaan!" />
                        {this.handleXWarning()}
                    </>
                    :<></>}
                {/* <!-- /End replace --> */}
            </main>
        </>
      );
    }
  }
  
export default FormPeminjaman;

