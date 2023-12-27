export default function ListBukuDipinjam(props) {
    return(
        <>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.nomor}
                </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.judulBuku}
                </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.batasPengembalian}
                </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.status}
                </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.denda}
                </div>
                </div>
            </td>
        </>
    );
}