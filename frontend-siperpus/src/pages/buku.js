import Book from "../components/book";
import React, { Component } from "react";
import APIConfig from "../api/APIConfig";
import Loading from "../components/loading";
import searchIcon from "../pictures/searchIcon.png";
import {NavLink} from "react-router-dom";
import AuthService from "../services/auth-service";
import ReactPaginate from "react-paginate";
import { SearchIcon } from "@heroicons/react/outline";

class Buku extends Component {
    constructor(props){
        super(props);
        this.state = {
            books: [],
            filteredBooks: [],
            selectedBooks: [],
            categories: [],
            loading: true,
            search: "",
            filteredCategories: [""],
            showStaffBoard: false,
            perPage:8,
            countPage:0,
            offsetPage:0,
            currentPage:0,
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handlePage = this.handlePage.bind(this);
    }

    componentDidMount() {
        this.loadDataBuku();

        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                showStaffBoard: user.roles.includes("ROLE_STAFF"),
            });
        }
    }

    async loadDataBuku() {
        try {
            const { data } = await APIConfig.get("/books");
            this.setState({ books: data.result });
            this.setState({ countPage: Math.ceil(data.result.length / this.state.perPage) });
            this.setState({ filteredBooks: data.result});
            this.setState({ categories: [...new Set(this.state.books.map(book => book.kategoriBuku))]})
            this.setState({ filteredCategories: this.state.categories});
            this.setState({ loading: false });
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    async handleSearch(event){
        event.preventDefault();
        this.setState({search: event.target.value});
    }

    handlePage(event){
        console.log(event.selected);
        const newOffset = ((event.selected) * this.state.perPage);

        console.log(this.state.offsetPage);
        this.setState({ offsetPage : newOffset });
    }

    filterByCategory = event => {
        if (event.target.checked){
            this.state.filteredCategories.push(event.target.value)
        } else{
            this.state.filteredCategories = this.state.filteredCategories.filter(value => value !== event.target.value)
        }
        this.setState({ filteredCateforied : this.state.filteredCategories})
    }

    render() {

        const { showStaffBoard } = this.state;

        let filteredBooks = this.state.books
            .filter((book) => {
                return book.namaBuku.toLowerCase().indexOf(this.state.search.toLowerCase()) != -1})
            .filter((book) => {
                return this.state.filteredCategories.indexOf(book.kategoriBuku) > -1
            });

        console.log(this.state.filteredCategories);
        console.log(filteredBooks);

        return(

            <>
                <header className="bg-white shadow">
                </header>
                <main>
                    {/* <!-- Replace with your content --> */}
                    <div className=" max-w-[90%] mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="">
                            <div className="text-center text-2xl max-w-xl mb-5 mb:10 sm:py-6 md:py-6 lg:py-6 mx-auto">
                                <p><b>Pencarian Buku</b></p>
                            </div>
                            <div class="flex border border-gray-300 bg-[#E6EFED] max-w-xl mx-auto h-10 rounded-xl">
                                <input class="flex-left ml-1 mt-0.5 p-2 min-w-[90%] bg-[#E6EFED] focus:outline-none"
                                        type="text"
                                        placeholder="Search"
                                        onChange={this.handleSearch}
                                ></input>
                                <span className="self-center lg:pl-5">
                                <SearchIcon height={23}/>
                                </span>
                            </div>
                        </div>
                        <div className="lg:ml-2 md:ml-2 min-w-[100%] mb-2 py-6 min">
                            {showStaffBoard && (
                            <button
                                className="w-1/8 bg-primary1 ourfont font-semibold text-white p-2 rounded-lg text-sm hover:bg-primary2"
                            >
                                <NavLink to={'/tambah-buku'} className="btn-green w-32"> + Tambah Buku </NavLink>
                            </button>
                            )}
                        </div>
                        {this.state.loading ? 
                            <div className="flex justify-center items-center">
                                <div className="md:mt-[10%] mt-[30%]">
                                    <Loading />
                                </div>
                            </div>
                        :
                        <>
                        <div className="lg:flex md:flex">
                            <div className="lg:flex-left md:flex-left lg:ml-2 md:ml-2 lg:mr-8 md:mr-8 mb-5 sm:px-0 lg:w-1/5">
                                <div className="border border-gray-300 rounded-md bg-[#E6EFED] p-2 mr-2 sm:px-0 pt-0">
                                    <p className="text-sm py-4 ml-3"><b>Cari berdasarkan kategori</b></p>
                                    {this.state.categories.map((category) =>
                                        <div className="py-2">
                                            <input className="w-4 h-4 ml-3 text-sm border-0 accent-[#43816F] rounded-full"
                                                    key={category.toString()}
                                                    type="checkbox"
                                                    defaultChecked="checked"
                                                    value={category}
                                                    name={category}
                                                    onChange={this.filterByCategory}
                                            ></input>
                                            <label className="ml-3">{category}</label>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="lg:flex-right md:flex-right mr-2 lg:w-4/5 md:w-4/5">
                                <div className="grid lg:grid-cols-4 gap-5 gap-y-7 md:grid-cols-2 sm:grid-cols-1">
                                    {filteredBooks.slice(this.state.offsetPage, this.state.offsetPage + this.state.perPage).map((book) =>
                                        <Book key={book.idBuku} name={book.namaBuku} penulis={book.penulisBuku} gambar={book.gambarBuku} penerbit={book.penerbitBuku} tahun={book.tahunBuku} deskripsi={book.deskripsi} id={book.idBuku}/>)
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <ReactPaginate
                                containerClassName="pagination flex justify-center mt-10 mx-auto max-w-xl"
                                activeClassName="active rounded-full bg-[#43816F] text-white"
                                pageClassName="w-10 h-10 text-center align-middle py-2 hover:bg-[#E6EFED] hover:text-black rounded-full "
                                pageLinkClassName="page-link"
                                previousClassName="w-10 h-10 text-center text-sm align-middle p-2 hover:bg-[#E6EFED] hover:text-black rounded-full"
                                previousLinkClassName="page-link"
                                nextClassName="page-item w-10 h-10 text-center text-sm align-middle p-2 hover:bg-[#E6EFED] hover:text-black rounded-full"
                                nextLinkClassName="page-link"
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                breakLabel="..."
                                nextLabel=">"
                                onPageChange={this.handlePage}
                                pageRangeDisplayed={5}
                                pageCount={this.state.countPage}
                                previousLabel="<"
                                renderOnZeroPageCount={null}>
                            </ReactPaginate>
                        </div>
                        </>
                        }
                    </div>
                    {/* <!-- /End replace --> */}
                </main>
            </>
        );
    };
}
export default Buku;