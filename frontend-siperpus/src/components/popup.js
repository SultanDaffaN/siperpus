// Component ini Mengambil 2 Props sebagai berikut:
//      type: Pilihan tipe Popup seperti success, warning, atau danger
//      pesan: Pesan yang ingin ditampilkan pada Popup

import { useEffect, useState } from "react";

export default function Popup(props) {
    // Pilihan Type
    const danger = "text-pRed3 bg-pRed1 rounded-lg dark:bg-red-200 dark:text-red-800";
    const warning = "text-pYellow3 bg-pYellow1 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
    const success = "text-pGreen3 bg-pGreen1 rounded-lg dark:bg-green-200 dark:text-green-800";
    const [addClass, setAddClass] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setAddClass(true);
        }, 100);
    });

    return(
        <div className="flex justify-center">
            <div id="type" className={`-top-20 transform transition duration-300 ${addClass && 'translate-y-40'} flex p-4 mb-4 text-sm w-4/5 lg:w-2/5 fixed ${props.type === "success" ? success : 
                                                                                           props.type === "warning" ? warning : 
                                                                                           danger}`} role="alert">
                <svg className="inline flex-shrink-0 mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <div>
                    <span className="font-medium">{`${props.type === "success" ? "Success!" : 
                                                    props.type === "warning" ? "Warning!"   :
                                                    "Danger!" }`}</span> {props.pesan}
                </div>
            </div>
        </div>
    );
}