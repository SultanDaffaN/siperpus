/* This example requires Tailwind CSS v2.0+ */
import { Component, Fragment} from 'react'
import React from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'

export default class ConfTerimaBukuBerdenda extends Component {
    constructor(props) {
        super(props);
        this.cancelButtonRef = React.createRef(null);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickShowDenda = this.handleClickShowDenda.bind(this);
        this.onChangeDenda = this.onChangeDenda.bind(this);
    
        this.state = {
          open: true,
          idPeminjaman: props.idPeminjaman,
          idUser: props.idUser,
          dendaBuku: props.dendaBuku,
          jmlDibayar: 0,
          showInputDenda: false
        };
      }

    componentDidMount(){
        this.setState({
            jmlDibayar: this.state.dendaBuku
        });
    }
     
      
    // Handle ketika menekan terima buku
    handleClick(action, bukuAndDenda, jmlDibayar)  {
        this.setState({
            open: false
        });

        this.props.onConfirmChange(action, bukuAndDenda, jmlDibayar);
    }

    // Fungsi untuk memunculkan input Denda
    handleClickShowDenda() {
        this.setState({
            showInputDenda: true
        });
    }

    // Fungsi untuk menyimpan denda ke state
    onChangeDenda(e) {
        this.setState({
            jmlDibayar: e.target.value
        });
    }

    render(){

        return (
            <Transition.Root show={this.state.open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={this.cancelButtonRef} onClose={this.handleClick}>
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
        
                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                <div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4">
                        <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            {/* Judul */}
                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center">
                            Terima Buku
                            </Dialog.Title>
                            <div className="mt-2">

                            {/* Deskripsi */}
                            <p className="text-sm text-gray-500 text-left">
                                Buku yang diterima memiliki denda sebesar Rp{this.state.dendaBuku}. Apakah anda menerima buku sekaligus denda atau hanya menerima buku?
                            </p>
                            </div>

                            {/* Pembayaran Denda */}
                            {
                                this.state.showInputDenda && 
                                <>
                                    <p className="text-sm text-gray-500 mt-3 text-left">Masukkan Jumlah Denda: Rp<span>
                                        <input className='sm:ml-2 sm:w-48 ml-1 w-28 border-2 border-gray-500 rounded'
                                               value={this.state.jmlDibayar}
                                               onChange={this.onChangeDenda}
                                        
                                        >

                                        </input>
                                        </span></p>
                                </>
                            }
                        </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 lg:flex lg:flex-row-reverse sm:px-6 flex justify-center flex-row-reverse">
                        {!this.state.showInputDenda && 
                        <>
                            <button
                            type="button"
                            className="btn-green inline-flex justify-center ml-3"
                            onClick={() => this.handleClick(true, false, this.state.jmlDibayar)}
                            >
                            <p className='self-center'>Terima Buku</p>
                            </button>
                            <button
                            type="button"
                            className="btn-green inline-flex justify-center ml-3 md:w-40"
                            onClick={this.handleClickShowDenda}
                            >
                            Terima Buku + Denda
                            </button>
                        </>
                        }
                        {this.state.showInputDenda && 
                            <button
                            type="button"
                            className="btn-green inline-flex justify-center ml-3 md:w-40 w-44"
                            onClick={() => this.handleClick(true, true, this.state.jmlDibayar)}
                            >
                            Terima Buku + Denda
                            </button>
                        }
                        <button
                        type="button"
                        className="btn-outline-green inline-flex justify-center"
                        onClick={() => this.handleClick(false, false, this.state.jmlDibayar)}
                        ref={this.cancelButtonRef}
                        >
                        <p className='self-center'>Batal</p>
                        </button>
                    </div>
                </div>
                </Transition.Child>
                </div>
            </Dialog>
            </Transition.Root>
        )
    }
}
