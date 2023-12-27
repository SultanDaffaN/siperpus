import {Link} from "react-router-dom";
import React from "react";
import Book from "./book";
import EventBus from "../common/EventBus";
import profilePict from "../pictures/Profile Picture.png";

export default function Bookdetail(props) {
    return(
        <>
            <div className="grid lg:grid-cols-2 gap-4 mt-10 mx-5 mb-20">

                {/* CSS dipanggil sesuai role */}
                <div className={props.cssdivgambarbuku}>
                    <img className="h-96 mx-auto mb-6 flex justify-end" src={props.gambar}/>
                </div>

                <div className="">
                    {props.tombolubah}

                    <div className="h-auto flex flex-row p-5 bg-white rounded-lg border border-gray-200 shadow-md bg-[#E6EFED]
                 w-5/6">
                        <div className="text-sm md:text-base">
                            <h4 className="font-averta mt-1">ID Buku: </h4>
                            <h4 className="font-averta mt-2"> Penulis: </h4>
                            <h4 className="font-averta mt-2"> Penerbit: </h4>
                            <h4 className="font-averta mt-2"> Kategori:</h4>
                            <h4 className="font-averta mt-2"> Tahun:</h4>
                            <h4 className="font-averta mt-2"> Tersedia: </h4>
                            <h4 className="font-averta mt-2"> Deskripsi: </h4>

                        </div>

                        <div className="ml-12 text-sm md:text-base">
                            <h4 className="font-averta mt-1"> {props.id}</h4>
                            <h4 className="font-averta mt-2"> {props.penulis}</h4>
                            <h4 className="font-averta mt-2"> {props.penerbit}</h4>
                            <h4 className="font-averta mt-2"> {props.kategori}</h4>
                            <h4 className="font-averta mt-2"> {props.tahun}</h4>
                            <h4 className="font-averta mt-2"> {props.jml_tersedia}</h4>
                            <h4 className="font-averta mt-2"> {props.deskripsi}</h4>

                            <div className={props.warnastatus}>{props.status}</div>

                            <h4 className="font-averta mt-6 mr-3"> Antrian peminjaman: {props.jmlReservasi}</h4>
                        </div>



                    </div>
                </div>

            </div>

        </>
    );
}




