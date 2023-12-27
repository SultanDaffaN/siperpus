import Book from "../components/book";
import React, { Component } from "react";
import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import Popup from "../components/popup";
import EventBus from "../common/EventBus";
import { useParams, NavLink } from "react-router-dom";
import { useState } from 'react'
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth-service";
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "../components/progress_bar";


function withRouter(Component) {
    function ComponentWithRouter(props) {
        let params = useParams()
        return <Component {...props} params={params} />
    }
    return ComponentWithRouter
  }



class FormUbahBuku extends Component {
    constructor(props){
        super(props);
        this.onChangeJudul = this.onChangeJudul.bind(this);
        this.onChangeTahun = this.onChangeTahun.bind(this);
        this.onChangePenulis = this.onChangePenulis.bind(this);
        this.onChangePenerbit = this.onChangePenerbit.bind(this);
        this.onChangeKategori = this.onChangeKategori.bind(this);
        this.onChangeDeskripsi = this.onChangeDeskripsi.bind(this);
        this.onChangeStok = this.onChangeStok.bind(this);
        this.handleEditSubmitItem = this.handleEditSubmitItem.bind(this);
        this.checkEmptyInput = this.checkEmptyInput.bind(this);
        this.loadDetailBuku = this.loadDetailBuku.bind(this);
        this.handleXSuccess = this.handleXSuccess.bind(this);
        this.checkAuthorize = this.checkAuthorize.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDeleteGambar = this.onDeleteGambar.bind(this);

        this.state = {
            books: [],
            loading: true,
            message: "",
            judul: "",
            tahun: "",
            penulis:"",
            penerbit:"",
            kategori:"",
            deskripsi:"",
            gambar:"",
            status:"",
            stok: "",
            progress: 0,
            kosong:{},
            successfulUpdate: false,
            pindah: false,
            authorize: true
        };
    }

    handleXSuccess() {
        setTimeout(() => {
          this.setState({ successfulUpdate: false,
                          message: ""
                        });
        }, 3000);
        setTimeout(() => {
            this.setState({ pindah: true,
                          });
          }, 4000);
      }

    onChangeJudul(e){
        this.setState({
            judul: e.target.value
        });
    }

    onChangeTahun(e){
        this.setState({
            tahun: e.target.value
        });
    }

    onChangePenulis(e){
        this.setState({
            penulis: e.target.value
        });
    }

    onChangePenerbit(e){
        this.setState({
            penerbit: e.target.value
        });
    }

    onChangeKategori(e) {
        this.setState({
            kategori: e.target.value
        });
         
    }

    onChangeDeskripsi(e) {
        this.setState({
            deskripsi: e.target.value
        });
         
    }

    onChangeStok(e) {
        this.setState({
            stok: e.target.value
        });
         console.log(this.state.stok)
    }

    onDrop = acceptedFiles => {
        this.setState({
            colorDrag: "border-gray-300"
        });

        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];

          if (!file) return;
          const sotrageRef = ref(storage, `files/${file.name}`);
          const uploadTask = uploadBytesResumable(sotrageRef, file);

          uploadTask.on(
              "state_changed",
              (snapshot) => {
              const prog = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  this.setState({gambar: downloadURL})
              });
              this.setState({progress: prog})
              },
              (error) => console.log(error)
          );
        }
      }

    onDragEnter(){
        this.setState({
            colorDrag: "border-tGreen"
        })
    }

    onDragLeave(){
        this.setState({
            colorDrag: "border-gray-300"
        })
    }

    onDeleteGambar(e){
        e.stopPropagation();
        this.setState({
            gambar: "",
            progress: 0
        });
    }

    handleClick(event){
        event.preventDefault();
    }

    checkEmptyInput(){
        let kosong = {};
        const pesan = "This field is required";
        if (this.state.judul === ""){
          kosong["judul"] = pesan;
        }
        if (this.state.tahun === ""){
          kosong["tahun"] = pesan;
        }
        if (this.state.penulis === ""){
          kosong["penulis"] = pesan;
        }
        if (this.state.penerbit === ""){
          kosong["penerbit"] = pesan;
        }
        if (this.state.kategori === ""){
          kosong["kategori"] = pesan;
        }
        if (this.state.deskripsi === ""){
            kosong["deskripsi"] = pesan;
          }
          if (this.state.stok === ""){
            kosong["stok"] = pesan;
          }
        if (this.state.gambar === ""){
            kosong["gambar"] = pesan;
          }
    
        if (Object.keys(kosong).length === 0){
          return true;
        }
    
        this.setState({ kosong: kosong })
        return false;
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
            this.loadDetailBuku();
        }
    }

    async loadDetailBuku(){
        try{
            const { data } = await APIConfig.get(`/books/${this.props.params.idBuku}`);
            this.setState({ 
                judul: data.result.namaBuku,
                tahun: data.result.tahunBuku,
                penulis: data.result.penulisBuku,
                penerbit: data.result.penerbitBuku,
                kategori: data.result.kategoriBuku,
                deskripsi: data.result.deskripsi,
                status: data.result.statusBuku,
                gambar: data.result.gambarBuku,
                stok: data.result.stok,
                progress:0,
                successful:true,
             },() => console.log(this.state.gambar));
        }
        catch (error){
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }


    handleEditSubmitItem(event) {
        event.preventDefault();
        const data = {
            namaBuku: this.state.judul,
            tahunBuku: parseInt(this.state.tahun),
            penulisBuku: this.state.penulis,
            penerbitBuku: this.state.penerbit,
            kategoriBuku: this.state.kategori,
            gambarBuku: this.state.gambar,
            statusBuku: this.state.status,
            deskripsi: this.state.deskripsi,
            stok: parseInt(this.state.stok),
        };
        console.log(data);
        APIConfig.put(`/books/${this.props.params.idBuku}`, data).then(
            response => {
              this.setState({
                successfulUpdate:true,
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
                  successfulUpdate:false
              });
      
      
              if (error.response && error.response.status === 401) {
                EventBus.dispatch("logout");
              }
      
            }
          );
        }
    


    render() {
        return(
            <>
                {/* Check Role  */}
                {this.state.authorize ? <></> : <Navigate to={"/forbidden"}/>}
                
                <header className="bg-white" align="center">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900 py-4">Form Ubah Buku</h1>
                    </div>
                </header>
                <main>
                    {/* <!-- Replace with your content --> */}
                    <div>
                        <form onSubmit={this.handleEditSubmitItem} method="POST">
                            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="judul" className="block text-sm font-medium text-gray-700">
                                            Judul Buku
                                        </label>
                                        <input
                                            type="text"
                                            name="judul"
                                            id="judul"
                                            className="order border-gray-300 p-2 w-full rounded-md mb- shadow-lg"
                                            value={this.state.judul}
                                            onChange={this.onChangeJudul}
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">
                                            Tahun Terbit
                                        </label>
                                        <input
                                            type="integer"
                                            name="tahun"
                                            id="tahun"
                                            className="order border-gray-300 p-2 w-full rounded-md mb- shadow-lg"
                                            value={this.state.tahun}
                                            onChange={this.onChangeTahun}
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                            Penulis
                                        </label>
                                        <input
                                            type="text"
                                            name="penulis"
                                            id="penulis"
                                            className="order border-gray-300 p-2 w-full rounded-md mb- shadow-lg"
                                            value={this.state.penulis}
                                            onChange={this.onChangePenulis}
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="penerbit" className="block text-sm font-medium text-gray-700">
                                            Penerbit
                                        </label>
                                        <input
                                            type="text"
                                            name="penerbit"
                                            id="penerbit"
                                            //autoComplete="given-name"
                                            className="order border-gray-300 p-2 w-full rounded-md mb- shadow-lg"
                                            value={this.state.penerbit}
                                            onChange={this.onChangePenerbit}
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                            Kategori
                                        </label>
                                        <select
                                            id="kategori"
                                            name="kategori"
                                            //autoComplete="country-name"
                                            className="order border-gray-300 p-2 w-full rounded-md mb- shadow-lg"
                                            value={this.state.kategori}
                                            onChange={this.onChangeKategori}
                                        >
                                            <option>Novel</option>
                                            <option>Fiksi</option>
                                            <option>Biologi</option>
                                        </select>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                                            Deskripsi
                                        </label>
                                        <input
                                            type="text"
                                            name="deskripsi"
                                            id="deskripsi"
                                            className="order border-gray-300 p-2 w-full rounded-md mb- shadow-lg"
                                            value={this.state.deskripsi}
                                            onChange={this.onChangeDeskripsi}
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="stok" className="block text-sm font-medium text-gray-700">
                                            Stok
                                        </label>
                                        <input
                                            type="integer"
                                            name="stok"
                                            id="stok"
                                            className="order border-gray-300 p-2 w-full rounded-md mb- shadow-lg"
                                            value={this.state.stok}
                                            onChange={this.onChangeStok}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Gambar</label>
                                        <Dropzone
                                            onDrop={this.onDrop}
                                            onDragEnter={this.onDragEnter}
                                            onDragLeave={this.onDragLeave}
                                            accept="image/png,image/jpeg,image/gif,image/jpg"
                                            minSize={1}
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <div {...getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${this.state.colorDrag}`}>
                                                    <input {...getInputProps()} />
                                                    <div  className="space-y-1 text-center">
                                                        {this.state.progress === 100 || this.state.gambar !== "" ? 
                                                        <>
                                                            <div onClick={this.onDeleteGambar} className="relative cursor-pointer">
                                                                <div className="absolute rounded-full -top-3 -right-4 z-99 bg-[#fbfafb] px-3 py-1 border-2 border-[#f1f1f1] shadow-2xl text-iRed3 mb-1">
                                                                    <FontAwesomeIcon icon={faXmark}/>
                                                                </div>
                                                                <img src={this.state.gambar} style={{ height: "112px" }} alt="preview" />
                                                            </div>
                                                            </>
                                                            : 
                                                            <>
                                                                <svg
                                                                className="mx-auto h-12 w-12 text-gray-400"
                                                                stroke="currentColor"
                                                                fill="none"
                                                                viewBox="0 0 48 48"
                                                                aria-hidden="true"
                                                                >
                                                                    <path
                                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <div className="flex text-sm text-gray-600">
                                                                    <label
                                                                        htmlFor="file-upload"
                                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary1 hover:text-primary1 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                                    >
                                                                        <span className="text-tGreen">Upload a file</span>
                                                                    </label>
                                                                    <p className="pl-1">or drag and drop</p>
                                                                </div>
                                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB
                                                                </p>
                                                            
                                                                {this.state.progress === 0 ?
                                                                    <h5 className="pl-1 mt-2 text-xs text-gray-600">Upload {this.state.progress}%</h5>
                                                                    :
                                                                    <div className="flex justify-center">
                                                                        <ProgressBar bgcolor="#539275" progress={this.state.progress}  height={10} />
                                                                    </div>
                                                                }
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                        <span className="text-red-600">{this.state.kosong["gambar"]}</span>
                                    </div>
                                </div>
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <div className="flex justify-end gap-6">
                                    
                                   
                                    <NavLink to={`/buku/${this.props.params.idBuku}`}>
                                        <button
                                            className="btn-outline-green"
                                        >Kembali
                                        </button>
                                        </NavLink>
                                    
                                        <button
                                            type="submit"
                                            className="btn-green"
                                            onClick={this.handleSubmitEditItem}
                                        >Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {this.state.successfulUpdate ? 
                    <>
                        <Popup type="success" pesan="Book successfully updated" />
                        {this.handleXSuccess()}
                    </>
                    :<></>}
                    {this.state.pindah ? <Navigate to={`/buku/${this.props.params.idBuku}`}/> : <></>}
                    {/* <!-- /End replace --> */}
                </main>
            </>
        );
    };
}
const UbahBukuWithParam = withRouter(FormUbahBuku);

export default UbahBukuWithParam;