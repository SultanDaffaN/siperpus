import React, { Component } from "react";
import ListBukuDipinjam from "../components/listBukuDipinjam";
import EventBus from "../common/EventBus";
import ListUser from "../components/listUser";
import Popup from "../components/popup";
import APIConfig from "../api/APIConfig";

export default class BukuDipinjam extends Component {
    constructor(props) {
        super(props);
        this.loadDataPeminjaman = this.loadDataPeminjaman.bind(this);
        this.state={
            message:"",
            data: [],
            peminjaman:[]
        };
    }
    
    componentDidMount(){
        this.loadDataPeminjaman();
    }

    loadDataPeminjaman() {
        APIConfig.get("/peminjaman/user").then(
            response => {
              this.setState({
                data: response.data.result
              });

              console.log(response)
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

          console.log(this.state.data)
      }

    render() {
        return (
          <div className="m-10">
            <h2 className="font-avertaStdBold text-3xl text-center">Peminjaman Buku</h2>
             
            <div className="flex flex-col mt-14">
              <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                  <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                      <table className="min-w-full">
                        <thead>
                            <tr>
                                <th
                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                    No</th>
                                <th
                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                    Judul Buku</th>
                                <th
                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                    Batas Peminjaman</th>
                                <th
                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                    Status</th>
                                <th
                                    className="px-6 py-3 text-md font-bold leading-4  text-left text-black ourFont border-b border-gray-500 bg-gray-50">
                                    Jumlah Denda</th>
                            </tr>
                        </thead>
                          
                        <tbody> 
                            {this.state.data.map((peminjaman) => 
                                <tr>
                                <ListBukuDipinjam
                                    key={peminjaman.nomor}
                                    nomor={peminjaman.nomor}
                                    judulBuku={peminjaman.judulBuku}
                                    batasPengembalian={peminjaman.batasPengembalian}
                                    denda={peminjaman.denda}
                                    status={peminjaman.status}
                                />
                            </tr>
                            )}   
                            {/* <tr>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">1</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">The Bell Jar</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">15 Maret 2022</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">Sisa 5 hari</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">Rp0</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">2</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">Love Hypothesis</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">17 Maret 2022</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">Sisa 5 hari</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">Rp0</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">3</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">The Bell Jar</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">15 Maret 2022</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">Sisa 5 hari</td>
                                <td className="px-6 py-3 whitespace-no-wrap justify-center">Rp0</td>
                            </tr> */}
                    </tbody>
                      </table>
                  </div>
              
            </div>
          </div>
        </div>
        );
      }
}