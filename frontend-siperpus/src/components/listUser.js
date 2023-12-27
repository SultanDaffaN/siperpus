// Component ini untuk penataan data User, terdiri dari beberapa props:
//         nama, nip, email, username, status

import { NavLink } from "react-router-dom";

export default function ListUser(props) {
    return(
        <>
            {/* Nama */}
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.nama}
                </div>
                </div>
            </td>

            {/* NIP */}
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.nip}
                </div>
                </div>
            </td>

            {/* Email */}
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.email}
                </div>
                </div>
            </td>

            {/* Username */}
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.username}
                </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center align-items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.status}
                </div>
                </div>
            </td>

            {/* Detail Peminjaman */}
            {props.tipe === "aktif" && 
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center justify-center">
                <div className="text-sm leading-5 text-gray-900">
                    <NavLink to={`/peminjam/${props.id}`} className="text-pGreen2">Detail</NavLink>
                </div>
                </div>
            </td>
            }
        </>
    );
}