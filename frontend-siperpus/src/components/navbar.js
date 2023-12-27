import React, { Component } from "react";
import { Transition } from "@headlessui/react";
import logo from "../pictures/Logo.png";
import profileImg from "../pictures/Profile Logo.png";
import { NavLink, useLocation} from 'react-router-dom';
import AuthService from "../services/auth-service";
import EventBus from "../common/EventBus";
import {IoIosArrowDown} from "react-icons/io"

class Main extends Component{
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.logOut = this.logOut.bind(this);
    this.toggleClass = this.toggleClass.bind(this);
    this.toggleSubMenu = this.toggleSubMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.cancelSubMenu = this.cancelSubMenu.bind(this);
    this.toggleSubMenuMobile = this.toggleSubMenuMobile.bind(this);

    this.state = {
      showStaffBoard: false,
      showKepalaBoard: false,
      showPenggunaBoard: false,
      showPengunjungBoard: false,
      currentUser: undefined,
      subMenu: false,
      subMenuMobile: false,
      // for Mobile
      isOpen: false
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showStaffBoard: user.roles.includes("ROLE_STAFF"),
        showKepalaBoard: user.roles.includes("ROLE_KEPALA"),
        showPenggunaBoard: user.roles.includes("ROLE_PENGGUNA"),
        showPengunjungBoard: user.roles.includes("ROLE_PENGUNJUNG"),
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });

    document.addEventListener("mousedown", this.handleClickOutside);

  }

  componentWillUnmount() {
    EventBus.remove("logout");
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showStaffBoard: false,
      showKepalaBoard: false,
      showPenggunaBoard: false,
      showPengunjungBoard: false,
      currentUser: undefined,
    });
  }

  toggleClass() {
    const currentState = this.state.isOpen;
    this.setState({ 
      isOpen: !currentState,
      subMenuMobile: false
    });
  };

  toggleSubMenu(){
    const currentState = this.state.subMenu;
    this.setState({ subMenu: !currentState });
  }

  toggleSubMenuMobile(){
    const currentState = this.state.subMenuMobile;
    this.setState({ subMenuMobile: !currentState });
  }

  cancelSubMenu(){
    this.setState({ subMenu: false });
  }

  
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.cancelSubMenu();
      }
  }
  
  render() {
    const { currentUser, showStaffBoard, showKepalaBoard, showPenggunaBoard, showPengunjungBoard } = this.state;
    const splitLocation = this.props.splitLocation;

    return (
      <div>
        <nav className="bg-pGreen2">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* Logo */}
                  <NavLink to={"/"}>
                    <img
                      className="h-14 w-14 rounded-full mr-3"
                      src={logo}
                      alt="Workflow"
                    />
                  </NavLink>
                </div>
                <div className="grid grid-rows-2 grid-flow-col" >
                  {/* Title */}
                  <div className="text-white text-2xl h-1 font-avertaBold">SIPERPUS</div>
                  <div className="text-white text-lg font-avertaSemiBold">SMP 131 Jakarta</div>
                </div>
                </div>
                <div className="hidden lg:block">
                  <div className="ml-10 flex items-baseline space-x-4 text-center">
                    {showKepalaBoard && (
                      <NavLink to={"/"} 
                      className={splitLocation[1] === "" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Dashboard</NavLink>
                      )}

                    {/* ROLE_PENGUNJUNG */}
                    {showPengunjungBoard && (
                      <NavLink to={"/"} 
                      className={splitLocation[1] === "" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Absen</NavLink>
                    )}

                    {/* PUBLIC */}

                    {(!showPengunjungBoard && !showKepalaBoard) && (
                      <NavLink to={"/"} 
                      className={splitLocation[1] === "" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Pengumuman</NavLink>
                    )}

                    {showKepalaBoard && (
                      <NavLink to={"/pengumuman"} 
                      className={splitLocation[1] === "pengumuman" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Pengumuman</NavLink>
                    )}


                    {!showPengunjungBoard && (
                      <NavLink to={"/buku"} 
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "buku" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Buku</NavLink>
                    )}
  
                    {/* ROLE_KEPALA */}
                    {/* {showKepalaBoard && (
                      <NavLink to={"/kepala"} 
                      className={splitLocation[1] === "kepala" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm"}
                      >Kepala Board</NavLink>
                    )} */}

                    {showKepalaBoard && (
                      <NavLink to={"/users/staff"} 
                      className={splitLocation[1] === "users" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Kelola Staff</NavLink>
                    )}


  
                    {/* ROLE_STAFF */}
                    {/* {showStaffBoard && (
                      <NavLink to={"/staff"} 
                      className={splitLocation[1] === "staff" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm"}
                      >Staff Board</NavLink>
                    )} */}

                    {showStaffBoard && (
                      <NavLink to={"/users/pengguna"} 
                      className={splitLocation[1] === "users" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                      >Kelola Pengguna</NavLink>
                    )}

                    {showStaffBoard && (
                        <NavLink to={"/absensi"}
                                 className={splitLocation[1] === "absensi" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold"
                                     : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                        >Absensi</NavLink>
                    )}

                    {showStaffBoard && (
                      <div
                        ref={this.wrapperRef}
                        onClick={this.toggleSubMenu}
                        className={splitLocation[1] === "peminjaman" ? "cursor-pointer hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                        : "cursor-pointer hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                        ><div className="flex justify-between items-center">
                            <div>Peminjaman</div> 
                            <div className="ml-3"><IoIosArrowDown /></div>
                          </div> 
                        

                        {this.state.subMenu ? 
                          <div className="absolute bg-gray-200 rounded-lg top-14 right-35" >
                            <div className="flex flex-col">
                              <NavLink to={"/peminjaman/tambah"} className="text-pGreen2 p-2 border-b-2 border-pGreen2 hover:bg-gray-100 hover:rounded-t-lg">Tambah Peminjaman</NavLink>
                              <NavLink to={"/peminjaman/buku"} className="text-pGreen2 p-2 hover:bg-gray-100 hover:rounded-b-lg">Daftar Peminjaman</NavLink>
                            </div>
                          </div>:
                          <></>
                        }
                      </div>
                    )}
  
                    {/* ROLE_PENGGUNA */}
                    {showPenggunaBoard && (
                      <NavLink to={"/dashboard"}
                      className={splitLocation[1] === "user" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                      >Peminjaman</NavLink>
                    )}
                    {/* {showPenggunaBoard && (
                      <NavLink to={"/pengguna"} 
                      className={splitLocation[1] === "pengguna" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm"}
                      >Pengguna Board</NavLink>
                    )} */}
  
                    {/* CURRENT_USER */}
                    {currentUser ? (
                      <>
                        {/* <NavLink to={"/profile"} 
                        className={splitLocation[1] === "profile" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                        : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                        >Profile</NavLink> */}
  
                        <a href="/login" 
                        className="hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                        onClick={this.logOut}
                        >LogOut</a>

                        <div className="h-5">
                          <img src={profileImg} className="h-8"/>
                        </div>
                        <p className="text-white rounded-md font-avertaBold tracking-wide">
                          Hi, {currentUser.username}
                        </p>


                      </>
                    ) : (
                      <>
                        <NavLink to={"/login"} 
                        className={splitLocation[1] === "login" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                        : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                        >Login</NavLink>
  
                        <NavLink to={"/register"} 
                        className={splitLocation[1] === "register" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                        : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                        >Register</NavLink>
                      </>
                    )}
                  </div>
              </div>
              <div className="-mr-2 flex lg:hidden">
                <button
                  onClick={this.toggleClass}
                  type="button"
                  className="bg-primary3 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-primary3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {!this.state.isOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
  
          <Transition
            show={this.state.isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {(ref) => (
              <div className="lg:hidden" id="mobile-menu">
                <div ref={ref} className="px-2 pt-2 pb-3 flex flex-col space-y-1 sm:px-3">

                {showKepalaBoard && (
                      <NavLink to={"/"} 
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Dashboard</NavLink>
                      )}
                
                {/* ROLE_PENGUNJUNG*/}
                {showPengunjungBoard && (
                      <NavLink to={"/"}
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                      >Absen</NavLink>
                    )}

                    {(!showPengunjungBoard && !showKepalaBoard) && (
                      <NavLink to={"/"} 
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Pengumuman</NavLink>
                    )}

                    {(showKepalaBoard) && (
                      <NavLink to={"/pengumuman"} 
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "pengumuman" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Pengumuman</NavLink>
                    )}


                    {!showPengunjungBoard && (
                      <NavLink to={"/buku"} 
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "buku" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-semibold font-avertaSemiBold"}
                      >Buku</NavLink>
                    )}
  
                    {/* ROLE_KEPALA */}
                    {/* {showKepalaBoard && (
                      <NavLink to={"/kepala"} 
                      className={splitLocation[1] === "kepala" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm"}
                      >Kepala Board</NavLink>
                    )} */}

                    {showKepalaBoard && (
                      <NavLink to={"/users/staff"} 
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "users" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                      >Kelola Staff</NavLink>
                    )}




  
                    {/* ROLE_STAFF */}
                    {/* {showStaffBoard && (
                      <NavLink to={"/staff"} 
                      className={splitLocation[1] === "staff" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm"}
                      >Staff Board</NavLink>
                    )} */}

                    {showStaffBoard && (
                      <>
                      <NavLink to={"/users/pengguna"} 
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "users" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                      >Kelola Pengguna</NavLink>

                      <NavLink to={"/absensi"}
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "absensi" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                      >Absensi</NavLink>
                      </>
                    )}

                    {showStaffBoard && (
                      <div className="bg-pGreen2 rounded-lg">
                      <div 
                      onClick={this.toggleSubMenuMobile}
                      className={splitLocation[1] === "peminjaman" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                      >Peminjaman
                      
                      </div>

                      {this.state.subMenuMobile ? 
                        <div className="px-3 py-1 text-white flex flex-col"> 
                            <NavLink to={"/peminjaman/tambah"} 
                            onClick={this.toggleClass}
                            className={splitLocation[2] === "tambah" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                            : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                            >Tambah Peminjaman
                            </NavLink>

                            <NavLink to={"/peminjaman/buku"} 
                            onClick={this.toggleClass}
                            className={splitLocation[2] === "buku" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                            : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                            >Daftar Peminjaman
                            </NavLink>
                        </div>
                      : <></>}
                      
                      </div>
                    )}
  
                    {/* ROLE_PENGGUNA */}
                    {showPenggunaBoard && (
                      <NavLink to={"/user/peminjaman"}
                      onClick={this.toggleClass}
                      className={splitLocation[1] === "user" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                      : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                      >Peminjaman Buku</NavLink>
                    )}
  
                    {/* CURRENT_USER */}
                    {currentUser ? (
                      <>
                        {/* <NavLink to={"/profile"} 
                        onClick={this.toggleClass}
                        className={splitLocation[1] === "profile" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                        : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                        >Profile</NavLink> */}
  
                        <a href="/login" 
                        className="hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                        onClick={this.logOut}
                        >LogOut</a>
                      </>
                    ) : (
                      <>
                        <NavLink to={"/login"} 
                        onClick={this.toggleClass}
                        className={splitLocation[1] === "login" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                        : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                        >Login</NavLink>
  
                        <NavLink to={"/register"} 
                        onClick={this.toggleClass}
                        className={splitLocation[1] === "register" ? "hover:bg-pGreen1 text-white px-3 py-2 rounded-md text-sm font-avertaSemiBold" 
                        : "hover:bg-pGreen1 text-gray-300 px-3 py-2 rounded-md text-sm font-avertaSemiBold"}
                        >Register</NavLink>
                      </>
                    )}
                </div>
              </div>
            )}
          </Transition>
        </nav>
      </div>
    );
  }
}

function Nav(Component) {
  return function WrappedComponent(props) {
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    return <Component {...props} splitLocation={splitLocation} />;
  }
}
export default Nav(Main);