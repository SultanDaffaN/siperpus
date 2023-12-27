// Component ini untuk penataan data pada Dashboard Kepala, terdiri dari beberapa props:
//         angka, satuan, info, uang
import CountUp from 'react-countup';

export default function RectInfo(props){
    return (
        <>
        <div className="border-2 border-pGreen1 rounded shadow-md p-3">
            {props.uang ? 
                props.angka > 1000 ? 
                <p className="font-avertaBold text-5xl mb-2 mt-3">Rp<CountUp end={props.angka / 1000} duration={1}/>k</p>
                :
                <p className="font-avertaBold text-5xl mb-2 mt-3">Rp<CountUp end={props.angka} duration={1}/></p>
            :
                props.angka > 1000 ?
                <p className="font-avertaBold text-6xl"><CountUp end={props.angka / 1000} duration={1}/>k</p>
                :
                <p className="font-avertaBold text-6xl"><CountUp end={props.angka} duration={1}/></p>
            }
            <p className="font-averta ml-1 text-2xl mt-2">{props.satuan}</p>
            <p className="font-averta ml-1 text-base">{props.info}</p>
        </div>
        </>
    );
}