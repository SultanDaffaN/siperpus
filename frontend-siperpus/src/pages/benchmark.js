import React, { Component } from "react";

import APIConfig from "../api/APIConfig";
import AuthService from "../services/auth-service";

export default class Benchmark extends Component {
  constructor(props) {
    super(props);
    this.checkAuthorize = this.checkAuthorize.bind(this);
    this.getBooksData = this.getBooksData.bind(this);
    this.postBooksData = this.postBooksData.bind(this);
    this.putBooksData = this.putBooksData.bind(this);
    this.deleteBooksData = this.deleteBooksData.bind(this);
   

    this.state = {
      // State untuk ambil Current User
      user: {},

      // State  untuk Pembeda authorization 
      pengguna: false,
      staffPerpus: false,
      kepalaPerpus: false,

      // State ambil Data Response
      data: "",

      // State ambil Error message
      message: ""
      
    };
  }

  // Fungsi untuk Check Authorize Role
  checkAuthorize(){
    const user = AuthService.getCurrentUser();
    
    this.setState({
        user: user
    });

    if (user !== null) {
      if (user.roles.includes("ROLE_KEPALA")) {
        this.setState({
          kepalaPerpus: true
        });
      }
  
      if (user.roles.includes("ROLE_STAFF")) {
        this.setState({
          staffPerpus: true
        });
      }
  
      if (user.roles.includes("ROLE_PENGGUNA")) {
        this.setState({
          pengguna: true
        });
      }

    }

  }

  componentDidMount() {
    this.checkAuthorize();
  }

  // Fungsi untuk Get Data (books)
  getBooksData() {
    // GET data dari Backend
    APIConfig.get("/books").then(
        // Pengembalian Response Data jika berhasil
        response => {
          this.setState({
            data: response.data
          });

          console.log(this.state.data)
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
  
          console.log(this.state.message)
        }
      );
  }

  // Fungsi untuk Post Data (books)
  postBooksData(e) {
    // Prevent Default agar page tidak reload dan pindah ke halaman lain
    e.preventDefault();

    // Data yang akan dimasukkan ke Request Body
    const data = {
      namaBuku: "The Middle Stories",
      tahunBuku: 2004,
      penulisBuku: "Sheila Heti",
      penerbitBuku: "House of Anansi Press",
      kategoriBuku: "Novel",
      gambarBuku: "http://images.amazon.com/images/P/0887841740.01.LZZZZZZZ.jpg",
      statusBuku: "available"
    };

    // POST data ke Backend
    APIConfig.post("/books", data).then(
        // Pengembalian Response Data jika berhasil
        response => {
          this.setState({
            data: response.data
          });

          console.log(this.state.data)
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
  
          console.log(this.state.message)
        }
      );
  }

  // Fungsi untuk Put Data (books)
  putBooksData(e) {
    // Prevent Default agar page tidak reload dan pindah ke halaman lain
    e.preventDefault();

    // Data yang akan dimasukkan ke Request Body
    const data = {
      namaBuku: "The Middle Stories",
      tahunBuku: 2004,
      penulisBuku: "Sheila Heti",
      penerbitBuku: "House of Anansi Press",
      kategoriBuku: "Fiksi",
      gambarBuku: "http://images.amazon.com/images/P/0887841740.01.LZZZZZZZ.jpg",
      statusBuku: "available"
    };

    // Id tertentu yang ingin diedit datanya
    const id = 25 // 25 adalah id buku "The Middle Stories"

    // PUT data ke Backend
    APIConfig.put(`/books/${id}`, data).then(
        // Pengembalian Response Data jika berhasil
        response => {
          this.setState({
            data: response.data
          });

          console.log(this.state.data)
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
  
          console.log(this.state.message)
        }
      );
  }

  // Fungsi untuk Delete Data (books)
  deleteBooksData() {
    // Id tertentu yang ingin diedit datanya
    const id = 25 // 25 adalah id buku "The Middle Stories"

    // DELETE data dari Backend
    APIConfig.delete(`/books/${id}`).then(
        // Pengembalian Response Data jika berhasil
        response => {
          this.setState({
            data: response.data
          });

          console.log(this.state.data)
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
  
          console.log(this.state.message)
        }
      );
  }


  render() {
    // Success Role 
    const successRole = <div className="p-2 bg-pGreen1 text-white inline-block rounded-md">Success Access</div>
    return (
      <>
      <div className="p-6">
        {/* 1. Authorization */}
        <div>
          <h1 className="font-avertaBold text-2xl border-b-2 border-black">Authorization</h1>
          {this.state.user !== null ? 
          <div>
              {/* Get Current User */}
              <h2 className="font-avertaBold text-xl mt-3">Get Current User :</h2>
              <h3 className="font-avertaSemiBold">Username: <span className="font-averta">{this.state.user.username}</span></h3>
              <h3 className="font-avertaSemiBold">Email: <span className="font-averta">{this.state.user.email}</span></h3>
              <h3 className="font-avertaSemiBold">Name: <span className="font-averta">{this.state.user.name}</span></h3>
              <h3 className="font-avertaSemiBold">NISN: <span className="font-averta">{this.state.user.nisn}</span></h3>
          </div>
          : <></>}

          {/* Access Resource Based on Role */}
          <h2 className="font-avertaBold text-xl mt-3">Access Resource Based on Role :</h2>
          {/* Public */}
          <div className="flex items-center mt-3">
            <h2 className="font-avertaSemiBold text-md my-1 mr-5">Public: </h2>
            {successRole}
          </div>

          {/* Kepala Perpus */}
          <div className="flex items-center mt-3">
            <h2 className="font-avertaSemiBold text-md my-1 mr-5">Kepala Perpus: </h2>
            {this.state.kepalaPerpus ? successRole : <></>}
          </div>

          {/* Staff Perpus */}
          <div className="flex items-center mt-3">
            <h2 className="font-avertaSemiBold text-md my-1 mr-5">Staff Perpus: </h2>
            {this.state.staffPerpus ? successRole : <></>}
          </div>

          {/* Pengguna */}
          <div className="flex items-center mt-3">
            <h2 className="font-avertaSemiBold text-md my-1 mr-5">Pengguna: </h2>
            {this.state.pengguna ? successRole : <></>}
          </div>
        </div>

        {/* 2. API Config */}
        <div>
          <h1 className="font-avertaBold text-2xl border-b-2 border-black mt-8">API Config (Open the Console to see the Output)</h1>
          
          {/* GET */}
          <div className="flex items-center mt-3">
            <h2 className="font-avertaBold text-xl mr-5">GET :</h2> 
            <button onClick={this.getBooksData} className="p-1 bg-blue-600 hover:bg-blue-800 text-white inline-block rounded-md w-20">GET</button>
          </div>

          {/* POST */}
          <div className="flex items-center mt-3">
            <h2 className="font-avertaBold text-xl mr-5">POST :</h2> 
            <button onClick={this.postBooksData} className="p-1 bg-green-600 hover:bg-green-800 text-white inline-block rounded-md w-20">POST</button>
          </div>

          {/* PUT */}
          <div className="flex items-center mt-3">
            <h2 className="font-avertaBold text-xl mr-5">PUT :</h2> 
            <button onClick={this.putBooksData} className="p-1 bg-yellow-600 hover:bg-yellow-800 text-white inline-block rounded-md w-20">PUT</button>
          </div>

          {/* DELETE */}
          <div className="flex items-center mt-3">
            <h2 className="font-avertaBold text-xl mr-5">DELETE :</h2> 
            <button onClick={this.deleteBooksData} className="p-1 bg-red-600 hover:bg-red-800 text-white inline-block rounded-md w-20">DELETE</button>
          </div>
        </div>

        {/* 3. Buttons */}
        <div>
          <h1 className="font-avertaBold text-2xl border-b-2 border-black mt-8">Buttons</h1>
          
          {/* Green */}
          <h2 className="font-avertaBold text-xl mr-5 mt-3">Green :</h2> 
          <div className="flex items-center mt-3">
            <button className="btn-green">Button</button>
            <button className="btn-outline-green ml-8">Button</button>
          </div>

          {/* Blue */}
          <h2 className="font-avertaBold text-xl mr-5 mt-3">Blue :</h2> 
          <div className="flex items-center mt-3">
            <button className="btn-blue">Button</button>
            <button className="btn-outline-blue ml-8">Button</button>
          </div>

          {/* Red */}
          <h2 className="font-avertaBold text-xl mr-5 mt-3">Red :</h2> 
          <div className="flex items-center mt-3">
            <button className="btn-red">Button</button>
            <button className="btn-outline-red ml-8">Button</button>
          </div>

          {/* Yellow */}
          <h2 className="font-avertaBold text-xl mr-5 mt-3">Yellow :</h2> 
          <div className="flex items-center mt-3">
            <button className="btn-yellow">Button</button>
            <button className="btn-outline-yellow ml-8">Button</button>
          </div>

          {/* Gray */}
          <h2 className="font-avertaBold text-xl mr-5 mt-3">Gray :</h2> 
          <div className="flex items-center mt-3">
            <button className="btn-gray">Button</button>
            <button className="btn-outline-gray ml-8">Button</button>
          </div>

         
        </div>

      </div>
      </>
    );
  }
}
