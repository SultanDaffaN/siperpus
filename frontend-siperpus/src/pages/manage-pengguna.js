import React, { Component } from "react";

import EventBus from "../common/EventBus";
import ListUser from "../components/listUser";
import Popup from "../components/popup";
import APIConfig from "../api/APIConfig";
import AuthService from "../services/auth-service";
import { Navigate } from "react-router-dom";
import ConfDelPopUp from "../components/confDel-popup";
import Loading from "../components/loading";
import searchIcon from "../pictures/searchIcon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownShortWide, faArrowUpShortWide, faCoffee } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { SearchIcon } from "@heroicons/react/outline";

export default class ManagePengguna extends Component {
  constructor(props) {
    super(props);
    this.changeStatus = this.changeStatus.bind(this);
    this.loadDataPengguna = this.loadDataPengguna.bind(this);
    this.filterPengguna = this.filterPengguna.bind(this);
    this.handleXSuccess = this.handleXSuccess.bind(this);
    this.activatePengguna = this.activatePengguna.bind(this);
    this.deletePengguna = this.deletePengguna.bind(this);
    this.checkAuthorize = this.checkAuthorize.bind(this);
    this.handleConfirmPopupAction = this.handleConfirmPopupAction.bind(this);
    this.handleShowPopupConf = this.handleShowPopupConf.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSortByName = this.handleSortByName.bind(this);
    this.handlePage = this.handlePage.bind(this);

    this.state = {
      message: "",
      data: [], 
      penggunaMenunggu: [],
      penggunaAktif: [],
      tipe: "menunggu",
      success: false,
      idUser: "",
      authorize: true,
      confirmDelete: false,
      loading: true,
      searchResult: [],
      sortName: true,
      showSortName: false,
      perPage:6,
      countPage:0,
      offsetPage:0,
      currentPage:0,
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
      this.changeStatus("menunggu");
    }
  }

  // Fungsi untuk Aktivasi Pengguna
  activatePengguna(id) {
    const data = {
      status: "Aktif"
    }

    // PUT data ke Backend
    APIConfig.put(`/users/activate/${id}`, data).then(
      response => {
        this.loadDataPengguna();
        this.setState({
          message: response.data.message,
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
  }

  // Fungsi untuk memunculkan popup
  handleShowPopupConf(id){
    this.setState({
      confirmDelete: true,
      idUser: id
    });
  }

  // Fungsi ketika user melakukan suatu action pada Popup confirmation
  handleConfirmPopupAction(action, id){
    this.setState({
      confirmDelete: false
    });

    if (action) {
      this.deletePengguna(id);
    }
  }

  // Fungsi untuk delete pengguna
  deletePengguna(id) {

    // DELETE pengguna ke Backend
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

  // Fungsi untuk memilih tipe pengguna (Aktif atau Menunggu)
  changeStatus(type) {
    let menunggu = document.getElementById("menunggu");
    let aktif = document.getElementById("aktif");

    if (type === "menunggu") {
      this.setState({ 
        tipe: "menunggu" ,
        countPage: Math.ceil(this.state.penggunaMenunggu.length / this.state.perPage)
      })

      menunggu.classList.add("bg-pGreen1")
      menunggu.classList.remove("bg-white")
      aktif.classList.add("bg-white")
      aktif.classList.remove("bg-pGreen1")

    }

    else {
      this.setState({ 
        tipe: "aktif",
        countPage: Math.ceil(this.state.penggunaAktif.length / this.state.perPage)
      });

      aktif.classList.add("bg-pGreen1")
      aktif.classList.remove("bg-white")
      menunggu.classList.add("bg-white")
      menunggu.classList.remove("bg-pGreen1")

    }
  }

  // Fungsi untuk filter status pengguna (Aktif atau Menunggu)
  filterPengguna() {
      let penggunaMenunggu = []
      let penggunaAktif = []
      this.state.searchResult.forEach(function (item){
        if (item.status === "Menunggu") {
            penggunaMenunggu.push(item);
        } 
        
        else {
            penggunaAktif.push(item);
        }
      });

      this.setState({
        penggunaMenunggu: penggunaMenunggu,
        penggunaAktif: penggunaAktif,
        loading: false,
      }, () => {
        if (this.state.tipe === 'menunggu') {
          this.setState({
            countPage: Math.ceil(this.state.penggunaMenunggu.length / this.state.perPage),
            currentPage: 0,
            offsetPage: 0
          });
        }
  
        else {
          this.setState({
            countPage: Math.ceil(this.state.penggunaAktif.length / this.state.perPage),
            currentPage: 0,
            offsetPage: 0
          });
        }
      });
  }

  // Fungsi untuk load data pengguna dari Backend
  loadDataPengguna() {

    // GET data dari Backend
    APIConfig.get("/users/pengguna").then(
        response => {
          this.setState({
            data: response.data.result,
            searchResult: response.data.result,
            sortName: true,
            showSortName: false,
          });
          this.filterPengguna();
        },
        error => {
          this.setState({
             message:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          });
  
          if (error.response.status === 403 && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
  }

  // Fungsi untuk menghilangkan popup success
  handleXSuccess() {
    setTimeout(() => {
      this.setState({ success: false,});
    }, 3000);
  }

  // Handle Search Feature
  async handleSearch(event){
    event.preventDefault();

    let search = event.target.value

    // Search Filter
    let result;
    if (this.state.tipe === 'menunggu') {
      result = this.state.data.filter((user) => {
        return user.name.toLowerCase().indexOf(search.toLowerCase()) != -1})
    }
    else {
      result = this.state.data.filter((user) => {
        return user.name.toLowerCase().indexOf(search.toLowerCase()) != -1})
    }

    this.setState({
      searchResult: result
    }, () => this.filterPengguna());
  }

  // Handle Sort By Name
  handleSortByName(){
    let result = this.state.searchResult;

    // Sort By Name
    if (this.state.sortName) {
      result.sort((userA, userB) => (userA.name.toLowerCase() > userB.name.toLowerCase()) ? 1 : -1)
    }

    else {
      result.sort((userA, userB) => (userA.name.toLowerCase() > userB.name.toLowerCase()) ? -1 : 1)
    }
    
    this.setState({
      sortName: !this.state.sortName,
      showSortName: true,
      searchResult: result
    }, () => this.filterPengguna());
  }

  // Handle Paging
  handlePage(event){
    const newOffset = ((event.selected) * this.state.perPage);

    this.setState({ offsetPage : newOffset });
  }

  render() {
    return (
      <>
      {/* Check Role  */}
      {this.state.authorize ? <></> : <Navigate to={"/forbidden"}/>}

      <div className="m-10">
        {/* Judul */}
        <h2 className="ourFont font-bold text-3xl text-center">Pengelolaan Pengguna</h2>

        {/* Toggle untuk memilih data pengguna berdasarkan status */}
        <div className="grid grid-cols-2 mt-14 text-center">
          <div id="menunggu" className="w-28 p-2 md:w-1/4 rounded-l-md border-2 border-green-800 justify-self-end md:p-2 cursor-pointer bg-pGreen1" onClick={() => this.changeStatus("menunggu")}>Menunggu</div>
          <div id="aktif" className="w-28 p-2 md:w-1/4 rounded-r-md border-t-2 border-b-2 border-r-2 border-green-800 justify-self-start md:p-2 cursor-pointer" onClick={() => this.changeStatus("aktif")}>Aktif</div>
        </div> 

        {/* Search Bar */}
        <div class="flex justify-around border border-gray-300 bg-[#E6EFED] w-80 md:w-2/5 mx-auto h-10 rounded-xl mt-10">
            <input class="ml-2.5 mt-0.5 p-2 min-w-[90%] bg-[#E6EFED] rounded-xl focus:outline-none"
                    type="text"
                    placeholder="Cari Nama Pengguna"
                    onChange={this.handleSearch}
            ></input>
            <span className="self-center pr-5 lg:pr-2">
              <SearchIcon height={23}/>
            </span>
        </div>

        {/* Table Data Pengguna */}
        <div className="flex flex-col mt-14">
          <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                  <table className="min-w-full">
                      {/* Table Head */}
                      <thead>
                          <tr>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  <div className="flex">
                                    <p className="w-12">Nama</p>
                                    {!this.state.showSortName ? 
                                    <span onClick={this.handleSortByName} className="cursor-pointer ml-2 self-center text-gray-400">
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                    </span>
                                    :
                                    <span onClick={this.handleSortByName} className="cursor-pointer ml-2 self-center">
                                      {this.state.sortName ? 
                                      <FontAwesomeIcon icon={faArrowUpShortWide}/>
                                      :
                                      <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                      }
                                    </span>
                                    }
                                  </div>
                                </th>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  NIP</th>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  Email</th>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  Username</th>
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                  Status</th>
                              {this.state.tipe === "aktif" && 
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-center text-black ourFont border-b border-gray-500 bg-gray-50">
                                  Peminjaman Buku</th>
                              }
                              <th
                                  className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50 text-center">
                                  Action</th>
                          </tr>
                      </thead>
                      
                      {/* Table Body */}
                      <tbody className="bg-white">
                          {this.state.tipe === "menunggu" ? 
                            // Mapping pengguna dengan status Menunggu
                            this.state.penggunaMenunggu.slice(this.state.offsetPage, this.state.offsetPage + this.state.perPage).map((user) => 
                            <tr key={user.id}>
                              {/* Memanggil Component ListUser untuk pemetaan attribute pengguna */}
                              <ListUser
                                        nama={user.name}
                                        nip={user.nisn}
                                        email={user.email}
                                        username={user.username}
                                        status={user.status}
                              />
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <div className="flex items-center justify-center">

                                        {/* Tombol Aktivasi Pengguna */}
                                        <svg className="fill-current h-8 w-8 text-green-500" 
                                            role="button" xmlns="http://www.w3.org/2000/svg"  
                                            fill="currentColor" viewBox="0 0 16 16" 
                                            onClick={() => this.activatePengguna(user.id)}>
                                            <title>Activate</title>
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>

                                        {/* Tombol Delete Pengguna */}
                                        <svg className="fill-current h-6 w-6 text-red-500 ml-5" 
                                            role="button" xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 20 20"
                                            onClick={() => this.handleShowPopupConf(user.id)}>
                                            <title>Delete</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                                        </svg>
                                        
                                    </div>
                                </td>
                            </tr>
                            )
                          :
                            // Mapping pengguna dengan status Aktif
                            this.state.penggunaAktif.slice(this.state.offsetPage, this.state.offsetPage + this.state.perPage).map((user) => 
                              <tr key={user.id}>
                                {/* Memanggil Component ListUser untuk pemetaan attribute pengguna */}
                                <ListUser 
                                          id={user.id}
                                          nama={user.name}
                                          nip={user.nisn}
                                          email={user.email}
                                          username={user.username}
                                          status={user.status}
                                          tipe={this.state.tipe}
                                />
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <div className="flex items-center justify-center">
                                    
                                    {/* Tombol Delete Pengguna */}
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        className="w-6 h-6 text-red-400" 
                                        role="button" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor"
                                        onClick={() => this.handleShowPopupConf(user.id)}>
                                        <title>Delete</title>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </div>
                                </td>
                              </tr>
                        )}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Loading Data selama menunggu get Data */}
          {this.state.loading ?
          <div className="text-center self-center mt-16">
            <Loading />
          </div>
          : <></>}

          {/* Pengganti jika data pengguna dengan status Menunggu tidak ada */}
          {this.state.penggunaMenunggu.length === 0 && this.state.tipe === "menunggu" && !this.state.loading ? 
            <h2 className="ourFont font-bold text-3xl text-center mt-16">Tidak Ada Data Pengguna Menunggu</h2>
          : <></>}

          {/* Pengganti jika data pengguna dengan status Aktif tidak ada */}
          {this.state.penggunaAktif.length === 0 && this.state.tipe === "aktif" && !this.state.loading ? 
            <h2 className="ourFont font-bold text-3xl text-center mt-16">Tidak Ada Data Pengguna Aktif</h2>
          : <></>}
        </div>

        {/* React Paging */}
        {this.state.penggunaMenunggu.length > 7 && this.state.tipe === 'menunggu' &&
        <div>
          <ReactPaginate
              containerClassName="pagination flex justify-center mt-10 mx-auto max-w-xl"
              activeClassName="active rounded-full bg-[#43816F] text-white"
              pageClassName="w-10 h-10 text-center align-middle py-2 hover:bg-[#E6EFED] hover:text-black rounded-full "
              pageLinkClassName="page-link"
              previousClassName="w-10 h-10 text-center text-sm align-middle p-2 hover:bg-[#E6EFED] hover:text-black rounded-full"
              previousLinkClassName="page-link"
              nextClassName="page-item w-10 h-10 text-center text-sm align-middle p-2 hover:bg-[#E6EFED] hover:text-black rounded-full"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              breakLabel="..."
              nextLabel=">"
              onPageChange={this.handlePage}
              pageRangeDisplayed={5}
              pageCount={this.state.countPage}
              previousLabel="<"
              renderOnZeroPageCount={null}>
          </ReactPaginate>
        </div>
        }

        {this.state.penggunaAktif.length > 7 && this.state.tipe === 'aktif' &&
        <div>
          <ReactPaginate
              containerClassName="pagination flex justify-center mt-10 mx-auto max-w-xl"
              activeClassName="active rounded-full bg-[#43816F] text-white"
              pageClassName="w-10 h-10 text-center align-middle py-2 hover:bg-[#E6EFED] hover:text-black rounded-full "
              pageLinkClassName="page-link"
              previousClassName="w-10 h-10 text-center text-sm align-middle p-2 hover:bg-[#E6EFED] hover:text-black rounded-full"
              previousLinkClassName="page-link"
              nextClassName="page-item w-10 h-10 text-center text-sm align-middle p-2 hover:bg-[#E6EFED] hover:text-black rounded-full"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              breakLabel="..."
              nextLabel=">"
              onPageChange={this.handlePage}
              pageRangeDisplayed={5}
              pageCount={this.state.countPage}
              previousLabel="<"
              renderOnZeroPageCount={null}>
          </ReactPaginate>
        </div>
        }

        {/* Popup success Activate or Delete User */}
        {this.state.success? 
          <>
            <Popup type="success" pesan={this.state.message} />
            {this.handleXSuccess()}
          </>
          :<></>}

        {/* Confirmation Pop Up */}
        {this.state.confirmDelete && <ConfDelPopUp onConfirmChange={this.handleConfirmPopupAction} 
                                                        id={this.state.idUser}
                                                        judul="Hapus Pengguna"
                                                        deskripsi="Apakah anda yakin ingin menghapus pengguna ini? Data yang anda hapus akan secara permanent dihapus dari database."/>}
      </div>
      </>
    );
  }
}
