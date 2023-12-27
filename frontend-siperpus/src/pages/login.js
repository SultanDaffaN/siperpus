import React, { Component } from "react";
import { useNavigate } from 'react-router-dom';
import Popup from "../components/popup";

import AuthService from "../services/auth-service";

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleXWarning = this.handleXWarning.bind(this);
    this.checkEmptyInput = this.checkEmptyInput.bind(this);
    this.handleKeyDownEnter = this.handleKeyDownEnter.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",
      kosong: {}
    };
  }

  // Fungsi untuk menyimpan nama user ke state
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
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

  // Fungsi jika user menekan enter di input
  handleKeyDownEnter(e){
    if (e.key === "Enter") {
      this.handleLogin(e);
    }
  }

  // Fungsi untuk handle login
  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true,
      kosong: {}
    });

    // Cek Empty Input
    if (this.checkEmptyInput()) {

      // POST data ke Backend
      AuthService.login(this.state.username, this.state.password).then(
        () => {
          this.props.navigate('/');
          window.location.reload();
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
            failed: true
          });
        }
      );
    }
  }

  // Fungsi untuk menghilangkan popup warning
  handleXWarning() {
    setTimeout(() => {
      this.setState({ message: "" });
    }, 3000);
  }

  render() {
    return (
      <div className="min-h-screen flex items-center">
        <div className="w-full">
          <div className="bg-white p-6 rounded-3xl  md:w-3/4 mx-auto lg:w-1/2">

            {/* Judul */}
            <h2 className="font-avertaBlack text-3xl text-center mb-10">LOGIN</h2>
            <form 
                ref={c => {
                  this.form = c;
                }}>
                
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
                    required="required"
                />
                  {/* Field is Required */}
                  <span className="text-red-600">{this.state.kosong["password"]}</span>
              </div>
            </form>
          </div>
          
          {/* Tombol Login */}
          <div className="mt-5 text-center">
              <button 
                onClick={this.handleLogin}
                className="btn-green"
              >Login</button>
          </div>
          
          {/* Popup Warning User Not Found or Username and Password dont match */}
          {this.state.message === "Request failed with status code 500" ? 
            <>
              <Popup type="warning" pesan="username pengguna tidak ada dalam sistem!" />
              {this.handleXWarning()}
            </> :
            <></>
          }

          {/* Popup Warning from Backend */}
          {this.state.message === "Bad credentials" ?  
            <>
              <Popup type="warning" pesan="Password yang anda masukkan tidak tepat!" />
              {this.handleXWarning()}
            </> :
            <></>
          }
        </div>
      </div>
    );
  }
}

function WithNavigate(props) {
  let navigate = useNavigate();
  return <Login {...props} navigate={navigate} />
}

export default WithNavigate;