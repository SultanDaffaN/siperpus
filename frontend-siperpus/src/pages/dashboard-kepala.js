import React, { Component } from "react";
import RectInfo from "../components/rect-info";

import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default class DashboardKepala extends Component {
  constructor(props) {
    super(props);
    this.getDataDashboard = this.getDataDashboard.bind(this);
    this.getDataAbsen = this.getDataAbsen.bind(this);
    this.greenishColor = this.greenishColor.bind(this);
    this.getDataBukuPopular = this.getDataBukuPopular.bind(this);
    this.getPersentaseKategori = this.getPersentaseKategori.bind(this);

    this.state = {
        dataDashboard: {},
        dataAbsen: [],
        labelsPopular: [],
        dataPopular: [],
        labelsKategori: [],
        dataKategori: [],

        loading: true,


        // Green Colors
        Greencolor: [
                     'rgb(9, 121, 105)',
                     'rgb(0, 255, 127)',
                     'rgb(175, 225, 175)',
                     'rgb(159, 226, 191)',
                     'rgb(127, 255, 212)', 
                     'rgb(69, 75, 27)', 
                     'rgb(80, 200, 120)',
                     'rgb(95, 133, 117)',
                     'rgb(34, 139, 34)',
                     'rgb(124, 252, 0)',
                     'rgb(170, 255, 0)', 
                  ]
    };
  }

  componentDidMount(){
      this.getDataAbsen();
      this.getDataBukuPopular();
      this.getPersentaseKategori();
      this.getDataDashboard();
  }

  // Fungsi untuk Get Data Dashboard Kepala
  getDataDashboard() {
    // GET data dari Backend
    APIConfig.get("/dashboard/kepala").then(
        // Pengembalian Response Data jika berhasil
        response => {
          this.setState({
            dataDashboard: response.data.result,
            loading: false
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

  // Fungsi untuk Get Data Absen
  getDataAbsen() {
    // GET data dari Backend
    APIConfig.get("/dashboard/kepala/data-absen").then(
        // Pengembalian Response Data jika berhasil
        response => {
          this.setState({
            dataAbsen: response.data.result.lstDataAbsen,
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

  // Fungsi untuk Get Data Buku Popular
  getDataBukuPopular() {
    // GET data dari Backend
    APIConfig.get("/dashboard/kepala/kategori-popular").then(
        // Pengembalian Response Data jika berhasil
        response => {
          const obj = response.data.result.kategoriBukuPopular;
          let labelsPopular = [];
          let dataPopular = [];
          Object.keys(obj).forEach(key => {
            labelsPopular.push(key);
            dataPopular.push(obj[key])
          });
          this.setState({
            labelsPopular: labelsPopular,
            dataPopular: dataPopular
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

  // Fungsi untuk Get Data Persentase Kategori
  getPersentaseKategori() {
    // GET data dari Backend
    APIConfig.get("/dashboard/kepala/persentase-kategori").then(
        // Pengembalian Response Data jika berhasil
        response => {
          const obj = response.data.result.persentaseKategoriBuku;
          let labelsKategori = [];
          let dataKategoriTemp = [];
          let dataKategori = [];
          Object.keys(obj).forEach(key => {
            labelsKategori.push(key);
            dataKategoriTemp.push(obj[key])
          });

          const sum = dataKategoriTemp.reduce((a, b) => a + b, 0)
          dataKategoriTemp.forEach(element => 
              dataKategori.push((element / sum * 100).toFixed(2))
            );

          this.setState({
            labelsKategori: labelsKategori,
            dataKategori: dataKategori
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

  // Fungsi untuk memberikan warna pada H Bar
  greenishColor(data){
    let result = [];

    data.forEach((element, index) => {
      result.push(this.state.Greencolor[index]);
    });
    
    return result;
  }

  render() {
    return (
        <div className="m-14">
          {/* Judul */}
          <h2 className="ourFont font-bold text-3xl text-center">Dashboard</h2>
          
          {/* Loading Data selama menunggu get Data */}
          {this.state.loading ?
          <div className="mt-40 flex justify-center">
            <Loading />
          </div>
          : 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 m-5 mt-16">
            {/* Total Data Info */}
            <RectInfo 
                uang={false}
                angka={this.state.dataDashboard.totalBuku}
                satuan="Buku"
                info="Total Buku"
            />
            <RectInfo 
                uang={false}
                angka={this.state.dataDashboard.bukuDipinjam}
                satuan="Buku"
                info="Total Buku Dipinjam"
            />
            <RectInfo 
                uang={false}
                angka={this.state.dataDashboard.bukuTerlambat}
                satuan="Buku"
                info="Total Buku Terlambat"
            />
            <RectInfo 
                uang={false}
                angka={this.state.dataDashboard.totalStaff}
                satuan="Staff"
                info="Total Staff"
            />
            

            <RectInfo 
                uang={true}
                angka={this.state.dataDashboard.dendaTerkumpul}
                satuan="Denda"
                info="Total Denda Terkumpul"
            />
            <RectInfo 
                uang={true}
                angka={this.state.dataDashboard.dendaBlmTerbayar}
                satuan="Denda"
                info="Denda Belum Terbayar"
            />
            <RectInfo 
                uang={false}
                angka={this.state.dataDashboard.pengunjungBulanan}
                satuan="Pengunjung"
                info="Pengunjung Bulan ini"
            />
            <RectInfo 
                uang={false}
                angka={this.state.dataDashboard.totalPengguna}
                satuan="Pengguna"
                info="Total Pengguna"
            />


            {/* Line Chart Absensi */}
            <div className="hidden md:block md:col-span-2 lg:col-span-4 border-2 border-pGreen1 shadow-lg h-96 p-3 rounded mt-5">
              <Line 
                data={{
                  labels: Array.from({length: this.state.dataAbsen.length}, (_, i) => i + 1),
                  datasets: [{
                      label: ' Pengunjung',
                      data: this.state.dataAbsen,
                      fill: true,
                      pointBackgroundColor: 'rgb(67,129,111)',
                      backgroundColor: 'rgb(225,235,232)',
                      borderColor: 'rgb(59,149,120)',
                      tension: 0,
                      borderWidth: 2
                  }]
                }}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'Pengunjung Perpustakaan Bulan ini',
                      color: 'rgb(0,0,0)',
                      font: {
                        size: 18
                      },
                      padding: {
                        top: 5,
                        bottom: 25
                      }
                    },
                    legend: {
                      display: false
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Tanggal'
                      },
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Pengunjung'
                      }
                    }
                  },
                  maintainAspectRatio: false
                }}
                
              />
            </div>

            {/* H-bar Chart Kategori Buku Popular */}
            <div className="hidden md:block md:col-span-2 lg:col-span-2 border-2 border-pGreen1 shadow-xl h-60 p-2 rounded mt-5">
                <Bar 
                  data={{
                    labels: this.state.labelsPopular,
                    datasets: [{
                      axis: 'y',
                      label: ' Jumlah Dipinjam',
                      data: this.state.dataPopular,
                      fill: true,
                      backgroundColor: this.greenishColor(this.state.dataPopular),
                      borderWidth: 1
                    }]
                  }}

                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: 'Kategori Buku Terpopular',
                        color: 'rgb(0,0,0)',
                        font: {
                          size: 15
                        },
                        padding: {
                          top: 5,
                          bottom: 15
                        }
                      },
                      legend: {
                        display: false
                      },
                    },
                    indexAxis: 'y',
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Jumlah Dipinjam'
                        }
                      },
                      y: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
            </div>

            {/* Pie Chart Persentase Buku Per Kategori */}
            <div className="hidden md:block md:col-span-2 lg:col-span-2 border-2 border-pGreen1 shadow-xl h-60 p-3 rounded mt-5">
                <Pie 
                  data={{
                    labels: this.state.labelsKategori,
                    datasets: [
                      {
                        // label: '# persen',
                        data: this.state.dataKategori,
                        backgroundColor: this.greenishColor(this.state.dataKategori),
                        borderWidth: 1,
                      },
                    ],
                  }}

                  options = {{
                    plugins: {
                      title: {
                        display: true,
                        text: 'Persentase Kategori Buku',
                        color: 'rgb(0,0,0)',
                        font: {
                          size: 15
                        },
                        padding: {
                          top: 5,
                          bottom: 15
                        }
                      },
                      legend: {
                        labels: {
                          usePointStyle: true,
                          font: {
                            size: 10
                          }
                        },
                        position: 'bottom'
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            let label = ' '
                            label += context.label || '';
                            console.log(context)
    
                            if (label) {
                                label += ': ';
                                label += context.parsed
                                label += '%'
                            }
                            
                            return label;
                          }
                        }
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
            </div>
          </div>
          }
        </div>
    );
  }
}
