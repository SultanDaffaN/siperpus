/* This example requires Tailwind CSS v2.0+ */
import { Component, Fragment} from 'react'
import React from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'

export default class ConfTerimaBuku extends Component {
    constructor(props) {
        super(props);
        this.cancelButtonRef = React.createRef(null);
        this.handleClick = this.handleClick.bind(this);
    
        this.state = {
          open: true,
          id: props.id
        };
      }


    // Handle ketika menekan terima buku
    handleClick(action)  {
        this.setState({
            open: false
        });

        this.props.onConfirmChange(action, this.state.id);
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
                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center">
                            Terima Buku
                            </Dialog.Title>
                            <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Apakah anda yakin sudah menerima buku yang dipinjam oleh Pengguna? Buku yang diterima tidak memiliki denda.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 lg:flex lg:flex-row-reverse sm:px-6 flex justify-center flex-row-reverse">
                        <button
                        type="button"
                        className="btn-green inline-flex justify-center ml-3"
                        onClick={() => this.handleClick(true)}
                        >
                        Terima
                        </button>
                        <button
                        type="button"
                        className="btn-outline-green inline-flex justify-center"
                        onClick={() => this.handleClick(false)}
                        ref={this.cancelButtonRef}
                        >
                        Batal
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
