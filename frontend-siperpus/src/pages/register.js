import React, { Component } from "react";
import Popup from "../components/popup";


import AuthService from "../services/auth-service";


export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.onChangeNisn = this.onChangeNisn.bind(this);
    this.onChangeNama = this.onChangeNama.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.checkEmptyInput = this.checkEmptyInput.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleXWarning = this.handleXWarning.bind(this);
    this.handleXSuccess = this.handleXSuccess.bind(this);
    this.handleKeyDownEnter = this.handleKeyDownEnter.bind(this);
  
    this.state = {
      role: ["pengguna"],
      nisn: "",
      nama: "",
      username: "",
      email: "",
      password: "",
      successful: false,
      message: "",
      kosong: {},
      errors: {},
    };
  }

  // Fungsi untuk menyimpan role user ke state
  onChangeRole(e) {
    this.setState({
      role: [e.target.value]
    });
  }

  // Fungsi untuk menyimpan nisn/nip user ke state
  onChangeNisn(e) {
    this.setState({
      nisn: e.target.value
    });
  }

  // Fungsi untuk menyimpan nama user ke state
  onChangeNama(e) {
    this.setState({
      nama: e.target.value
    });
  }

  // Fungsi untuk menyimpan username user ke state
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  // Fungsi untuk menyimpan email user ke state
  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  // Fungsi untuk menyimpan password user ke state
  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  // Fungsi untuk mengecek empty input
  checkEmptyInput(){
    let kosong = {};
    const pesan = "This field is required";
    if (this.state.nisn === ""){
      kosong["nisn"] = pesan;
    }
    if (this.state.nama === ""){
      kosong["nama"] = pesan;
    }
    if (this.state.username === ""){
      kosong["username"] = pesan;
    }
    if (this.state.email === ""){
      kosong["email"] = pesan;
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

  // Fungsi untuk mengecek validasi email dan nisn/nip
  handleValidation() {
    let email = this.state.email;
    let errors = {};
    let formIsValid = true;

    // Email
    if (typeof email !== "undefined") {
      let lastAtPos = email.lastIndexOf("@");
      let lastDotPos = email.lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          email.indexOf("@@") === -1 &&
          lastDotPos > 2 &&
          email.length - lastDotPos > 2
        )
      ) {
        errors["email"] = "Email is not valid";
        formIsValid = false;
      }
    }

    // NISN
    if (this.state.nisn.match(/^[0-9]+$/) === null){
      errors["nisn"] = "NISN is not valid";
      formIsValid = false;
    }

    this.setState({  
      errors: errors
    });
    return formIsValid;
  }

  // Fungsi untuk menghilangkan popup warning
  handleXWarning(type) {
    let newErrors = this.state.errors;
    newErrors[type] = undefined;
    setTimeout(() => {
      this.setState({ errors: newErrors });
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

  // Fungsi jika user menekan enter di input
  handleKeyDownEnter(e){
    if (e.key === "Enter") {
      this.handleRegister(e);
    }
  }

  // Fungsi untuk handle Register
  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
      kosong: {}
    });

    // Cek Empty Input dan Validation
    if (this.checkEmptyInput() && this.handleValidation()) {

      // Post data ke Backend
      AuthService.register(
        this.state.nama,
        this.state.nisn,
        this.state.username,
        this.state.email,
        this.state.role,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true,
            nisn: "",
            nama: "",
            username: "",
            email: "",
            password: ""
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          
          // Meletekkan Error message ke state
          let errors = this.state.errors;
          if (resMessage === "Request failed with status code 400") {
            errors["system"] = "NISN/NIP can't be more than 20 digits"
          }

          else {
            errors["system"] = resMessage;
          }

          this.setState({
            successful: false,
            error: errors
          });
        }
      );
    }
  }

  render() {
    return (
      <div className="flex items-center">
        <div className="w-full">
          <div className="bg-white p-6 rounded-3xl  md:w-3/4 mx-auto lg:w-1/2">

            {/* Judul */}
            <h2 className="text-3xl text-center mb-10 mt-5 font-avertaBlack">REGISTER</h2>
            <form 
                ref={c => {
                  this.form = c;
                }}>
              
              {/* Role */}
              <div className="mb-5">
                <label htmlFor="role" className="block mb-1 font-avertaSemiBold text-black">Role</label>
                <select id="role" name="role" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={this.onChangeRole}>
                    <option  disabled selected>--Pilih salah satu--</option>
                    <option value="staff">Staff Perpus</option>
                    <option value="pengguna">Guru</option>
                    <option value="pengguna">Siswa</option>
                </select>
              </div>
              
              {/* NISN/NIP */}
              <div className="mb-5">
                <label htmlFor="nisn" className="block mb-1  font-avertaSemiBold text-black">NIS/NIP</label>
                <input 
                    type="text" 
                    className="border border-gray-300 p-2 w-full rounded-md mb- shadow-lg" 
                    name="username"
                    value={this.state.nisn}
                    onChange={this.onChangeNisn}
                    onKeyDown={this.handleKeyDownEnter}
                  />
                  {/* Field is Required */}
                  <span className="text-red-600">{this.state.kosong["nisn"]}</span>
              </div>

              {/* Nama */}
              <div className="mb-5">
                <label htmlFor="username" className="block mb-1 font-avertaSemiBold text-black">Nama</label>
                <input 
                    type="text" 
                    className="border border-gray-300 p-2 w-full rounded-md mb- shadow-lg" 
                    name="username"
                    value={this.state.nama}
                    onChange={this.onChangeNama}
                    onKeyDown={this.handleKeyDownEnter}
                  />
                  {/* Field is Required */}
                  <span className="text-red-600">{this.state.kosong["nama"]}</span>

              </div>

              {/* Username */}
              <div className="mb-5">
                <label htmlFor="username" className="block mb-1 font-avertaSemiBold text-black">Username</label>
                <input 
                    type="text" 
                    className="border border-gray-300 p-2 w-full rounded-md mb- shadow-lg" 
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    onKeyDown={this.handleKeyDownEnter}
                  />
                  {/* Field is Required */}
                  <span className="text-red-600">{this.state.kosong["username"]}</span>
              </div>

              {/* Email */}
              <div className="mb-5">
                <label htmlFor="email" className="block mb-1 font-avertaSemiBold text-black">Email</label>
                <input 
                    type="text" 
                    className="border border-gray-300 p-2 w-full rounded-md mb- shadow-lg" 
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    onKeyDown={this.handleKeyDownEnter}
                  />
                  {/* Field is Required */}
                  <span className="text-red-600">{this.state.kosong["email"]}</span>
              </div>

              {/* Password */}
              <div className="mb-5">
                <label htmlFor="password" className="block mb-1 font-avertaSemiBold text-black">Password</label>
                <input 
                    type="password"
                    className="border border-gray-300 p-2 w-full rounded-md mb- shadow-lg" 
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    onKeyDown={this.handleKeyDownEnter}
                />
                  {/* Field is Required */}
                  <span className="text-red-600">{this.state.kosong["password"]}</span>
              </div>
            </form>
          </div>

          {/* Tombol Register */}
          <div className="mt-5 text-center mb-8">
              <button 
                onClick={this.handleRegister}
                className="btn-green"
              >Register</button>
          </div>

          {/* Popup Successful Registered User */}
          {this.state.successful ? 
          <>
            <Popup type="success" pesan={this.state.message} />
            {this.handleXSuccess()}
          </>
          :<></>}

          {/* Popup Warning Email Invalid */}
          {this.state.errors["email"] === undefined ? (<></>):
            <>
              <Popup type="warning" pesan={this.state.errors["email"]}/>
              {this.handleXWarning("email")}
            </>
          }

          {/* Popup Warning NISN Invalid */}
          {this.state.errors["nisn"] === undefined ? (<></>):
            <>
              <Popup type="warning" pesan={this.state.errors["nisn"]}/>
              {this.handleXWarning("nisn")}
            </>
          }

          {/* Popup Warning from Backend */}
          {this.state.errors["system"] === undefined ? (<></>) :
            <>
              <Popup type="warning" pesan={this.state.errors["system"]} />
              {this.handleXWarning("system")}
            </>
          }

        </div>
      </div>
    );
  }
}
