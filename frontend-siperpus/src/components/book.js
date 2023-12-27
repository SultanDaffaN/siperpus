import {Link} from "react-router-dom";

export default function Book(props) {
    return(
        <>
            <Link to={`/buku/${props.id}`}>
                <div className="grid p-3 justify-items-center rounded border border-white hover:shadow-2xl hover:text-pGreen2">
                    <div className="bg-black rounded mb-3">
                        <img className="md:h-64 md:w-44 w-72 rounded object-fill" src={props.gambar}/>
                    </div>
                    <div className="font-bold text-xl md:text-base">{props.name.slice(0,18)}{props.name.length > 18 ? <span>...</span> : <></>}</div>
                    <div className="mb-1 font-semibold text-sm">{props.penulis.slice(0,25)}{props.penulis.length > 25 ? <span>...</span> : <></>}</div>
                    <div className="mb-1 text-sm text-center">{props.deskripsi.slice(0,70)}{props.deskripsi.length > 70 ? <span>...</span> : <></>}</div>
                </div>
            </Link>
        </>
    );
}