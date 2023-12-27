// Component ini memiliki 2 props yaitu color dan isi

export default function Button(props) {
    // Pilihan-pilihan Button
    const green = ""
    const greenOut = ""
    return(
        <button className={`p-1 px-3 bg-red-600 hover:bg-red-800 text-white inline-block rounded-md`}>{props.isi}</button>
    );
}