/* This example requires Tailwind CSS v2.0+ */
import { Component, Fragment} from 'react'
import React from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'

// Component ini memiliki 4 props sebagai berikut:
//      1. judul: untuk memberikan judul pada popup
//      2. deskripsi: untuk memberikan deskripsi pada popup
//      3. onConfirmChange: untuk menghandle aksi yang dilakukan pada popup dan passing ke state pada component sebelumnya
//      4. id: untuk menginisiasi id yang ingin dihapus
export default class ConfDelPopUp extends Component {
    constructor(props) {
        super(props);
        this.cancelButtonRef = React.createRef(null);
        this.handleClick = this.handleClick.bind(this);
    
        this.state = {
          open: true,
          id: props.id
        };
      }


    // Handle User Click
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
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                            {this.props.judul}
                            </Dialog.Title>
                            <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                {this.props.deskripsi}
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 lg:flex lg:flex-row-reverse sm:px-6 flex justify-center flex-row-reverse">
                        <button
                        type="button"
                        className="btn-red inline-flex justify-center ml-3"
                        onClick={() => this.handleClick(true)}
                        >
                        Hapus
                        </button>
                        <button
                        type="button"
                        className="btn-outline-red inline-flex justify-center"
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
