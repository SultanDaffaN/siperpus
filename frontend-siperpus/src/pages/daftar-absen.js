import React, { Component } from "react";
import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import AuthService from "../services/auth-service";
import EventBus from "../common/EventBus";
import {Navigate, NavLink, useNavigate, useParams} from "react-router-dom";
import profilePict from "../pictures/Profile Picture.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownShortWide, faArrowUpShortWide} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";

// Referensi:
// 1. https://www.codegrepper.com/code-examples/javascript/get+current+date+javascript+yyyy-mm-dd

class DaftarAbsen extends Component{
    constructor(props){
        super(props);
        this.checkAuthorize = this.checkAuthorize.bind(this);
        this.onChangeSelectDate = this.onChangeSelectDate.bind(this);
        this.handleSortByNama = this.handleSortByNama.bind(this);
        this.handleSortByUsername = this.handleSortByUsername.bind(this);
        this.handleSortByJam = this.handleSortByJam.bind(this);
        this.handleUbahFormatJam = this.handleUbahFormatJam.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.getAccurateDateToday = this.getAccurateDateToday.bind(this);

        this.state = {
            absenData:[],
            dateToday: this.getAccurateDateToday(),
            showStaffBoard: false,
            showKepalaBoard: false,
            showPenggunaBoard: false,
            currentUser: undefined,
            authorize:true,
            loading: true,

            dateSet: this.getAccurateDateToday(),
            message:"",

            sortUsername: true,
            sortNama: true,
            sortWaktuAbsen: true,


            showSortUsername: false,
            showSortNama: false,
            showSortWaktuAbsen: false,

            perPage:6,
            countPage:0,
            offsetPage:0,
            currentPage:0,

            testDate:""
        };
    }
    onChangeSelectDate(e){
        this.setState({dateSet:e.target.value}, () => this.loadDaftarAbsen());
    }

    // Handle sort by nama
    handleSortByNama(){
        let result = this.state.absenData;

        if (this.state.sortNama) {
            result.sort((namaA, namaB) => (namaA.user.name.toLowerCase() > namaB.user.name.toLowerCase()) ? 1 : -1)
        }

        else {
            result.sort((namaA, namaB) => (namaA.user.name.toLowerCase() > namaB.user.name.toLowerCase()) ? -1 : 1)
        }

        this.setState({
            absenData: result,

            sortUsername: true,
            sortNama: !this.state.sortNama,
            sortWaktuAbsen: true,

            showSortUsername: false,
            showSortNama: true,
            showSortWaktuAbsen: false
        });
    }

    // Handle sort by Username
    handleSortByUsername(){
        let result = this.state.absenData;

        if (this.state.sortUsername) {
            result.sort((usernameA, usernameB) => (usernameA.user.username.toLowerCase() > usernameB.user.name.toLowerCase()) ? 1 : -1)
        }

        else {
            result.sort((usernameA, usernameB) => (usernameA.user.username.toLowerCase() > usernameB.user.name.toLowerCase()) ? -1 : 1)
        }

        this.setState({
            absenData: result,

            sortNama: true,
            sortUsername: !this.state.sortUsername,
            sortWaktuAbsen: true,

            showSortNama: false,
            showSortUsername: true,
            showSortWaktuAbsen: false
        });
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

    loadDaftarAbsen(){
        // GET data dari Backend
        APIConfig.get(`/absen/${this.state.dateSet}`).then(
            // Pengembalian Response Data jika berhasil
            response => {
                // For date debug
                //console.log(this.getAccurateDateToday());
                //console.log(new Date().getDate());
                //console.log(new Date().getMonth() +1);
                //console.log(new Date().getFullYear());

                this.setState({
                    absenData: response.data.result,
                    loading: false,

                    sortUsername: true,
                    sortNama: true,
                    sortWaktuAbsen: true,


                    showsortUsername: false,
                    showsortNama: false,
                    showsortWaktuAbsen: false,

                    countPage: Math.ceil(response.data.result.length / this.state.perPage),

                });

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

            }
        );
    }

    // Handle Paging
    handlePage(event){
        const newOffset = ((event.selected) * this.state.perPage);

        this.setState({ offsetPage : newOffset });
    }





    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showStaffBoard: user.roles.includes("ROLE_STAFF"),
                showKepalaBoard: user.roles.includes("ROLE_KEPALA"),
                showPenggunaBoard: user.roles.includes("ROLE_PENGGUNA"),
            });
        }
        this.checkAuthorize();
    }

    checkAuthorize(){
        const user = AuthService.getCurrentUser();

        if (user === null || !user.roles.includes("ROLE_STAFF")) {
            this.setState({
                authorize: false
            });
        }

        else {
            this.loadDaftarAbsen();
        }
    }

    handleUbahFormatJam(jam){
        jam = jam.slice(11,13) + jam.slice(14,16) + jam.slice(17,19)
        return jam;
    }

    // Handle sort by waktu absen
    handleSortByJam(){
        let result = this.state.absenData;

        if (this.state.sortWaktuAbsen) {
            result.sort((waktuA, waktuB) => (this.handleUbahFormatJam(waktuA.waktuAbsen) > this.handleUbahFormatJam(waktuB.waktuAbsen)) ? 1 : -1)
        }

        else {
            result.sort((waktuA, waktuB) => (this.handleUbahFormatJam(waktuA.waktuAbsen) > this.handleUbahFormatJam(waktuB.waktuAbsen)) ? -1 : 1)
        }

        this.setState({
            absenData: result,

            sortNama: true,
            sortWaktuAbsen: !this.state.sortWaktuAbsen,
            sortUsername: true,

            showSortNama: false,
            showSortWaktuAbsen: true,
            showSortUsername: false
        });
    }

    render(){
        return(

            <>
                {/* Check role (reuse component from manage-pengguna.js) */}
                {this.state.authorize ? <></> : <Navigate to={"/forbidden"}/>}

                <div className="m-10">
                    {/* Judul */}
                    <h2 className="font-avertaBold text-3xl text-center"> Daftar Absensi </h2>

                    {/* Select date */}
                    <p className="font-averta text-center mt-5">
                        Tanggal:
                        <input type="date"
                               value={this.state.dateSet}
                               onChange= {this.onChangeSelectDate}
                               onKeyDown={(e) => e.preventDefault()}
                               className="text-tGray ml-3 pl-3 border-2 rounded-lg bg-[#E5E5E5]"
                               max={this.state.dateToday}>

                        </input>
                    </p>


                        <div className="flex flex-col mt-10">

                            {/* Table Component (reuse) */}
                            <div className="flex flex-col mt-16">
                                <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:mx-12 lg:px-8">
                                    <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                                        <table className="min-w-full">
                                            {/* Table Head */}
                                            <thead>
                                            <tr>
                                                <th
                                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                                    No.</th>
                                                <th
                                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                                    Username

                                                    {!this.state.showSortUsername ?
                                                        <span onClick={this.handleSortByUsername} className="cursor-pointer ml-2 self-center text-gray-400">
                                                          <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                                        </span>
                                                        :
                                                        <span onClick={this.handleSortByUsername} className="cursor-pointer ml-2">
                                                          {this.state.sortUsername ?
                                                              <FontAwesomeIcon icon={faArrowUpShortWide}/>
                                                              :
                                                              <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                                          }
                                                        </span>
                                                    }</th>
                                                <th
                                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                                    Nama

                                                    {!this.state.showSortNama ?
                                                        <span onClick={this.handleSortByNama} className="cursor-pointer ml-2 self-center text-gray-400">
                                                          <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                                        </span>
                                                                            :
                                                                            <span onClick={this.handleSortByNama} className="cursor-pointer ml-2">
                                                          {this.state.sortNama ?
                                                              <FontAwesomeIcon icon={faArrowUpShortWide}/>
                                                              :
                                                              <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                                          }
                                                        </span>
                                                    }</th>
                                                <th
                                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                                    Waktu Absen


                                                    {!this.state.showSortWaktuAbsen ?
                                                        <span onClick={this.handleSortByJam} className="cursor-pointer ml-2 self-center text-gray-400">
                                                          <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                                        </span>
                                                                            :
                                                                            <span onClick={this.handleSortByJam} className="cursor-pointer ml-2 self-center">
                                                          {this.state.sortWaktuAbsen ?
                                                              <FontAwesomeIcon icon={faArrowUpShortWide}/>
                                                              :
                                                              <FontAwesomeIcon icon={faArrowDownShortWide}/>
                                                          }
                                                        </span>
                                                    }</th>
                                            </tr>
                                            </thead>

                                            {/* Table Body */}
                                            <tbody className="bg-white">
                                            {this.state.absenData.slice(this.state.offsetPage, this.state.offsetPage + this.state.perPage).map((absen, no) =>
                                                <tr key={absen.idPeminjaman}>
                                                    {/* No. */}
                                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                        {no + 1}
                                                    </td>

                                                    {/* Username */}
                                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                        {absen.user.username}
                                                    </td>

                                                    {/* Nama user */}
                                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                        {absen.user.name}
                                                    </td>

                                                    {/* Waktu absen */}
                                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                        {absen.waktuAbsen.slice(11,19)}
                                                    </td>


                                                </tr>
                                            )}
                                            </tbody>
                                        </table>

                                        {/* React Paging */}
                                        {this.state.absenData.length > 6 &&
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
                                    </div>
                                </div>

                                {/* Loading Data selama menunggu get Data */}
                                {this.state.loading ?
                                    <div className="text-center self-center mt-14">
                                        <Loading />
                                    </div>
                                    : <></>}

                                {/* Pengganti jika tidak ada yang absen*/}
                                {this.state.absenData.length === 0 && !this.state.loading?
                                    <h2 className="ourFont font-bold text-3xl text-center mt-10">Tidak Ada yang Absen di Tanggal Ini </h2>
                                    : <></>}
                            </div>
                        </div>


                </div>
            </>
        )
    }




}

export default DaftarAbsen;
