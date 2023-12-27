export default function Reservasi(props) {
    return(
        <>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                <div className="text-sm leading-5 text-gray-900">
                    {props.user}
                </div>
                </div>
            </td>
        </>
    )
}