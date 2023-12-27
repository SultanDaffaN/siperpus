import React, { Component } from "react";

import UserService from "../services/user-service";
import DashboardKepala from "./dashboard-kepala";
import AuthService from "../services/auth-service";
import Buku from "./buku";
import FormInputAbsen from "./form-input-absen";
import DaftarPengumuman from "./daftar-pengumuman";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.checkAuthorize = this.checkAuthorize.bind(this);

    this.state = {
      content: "",

      // State  untuk Pembeda authorization 
      pengguna: false,
      staffPerpus: false,
      kepalaPerpus: false,
      pengunjung: false
    };
  }

   // Fungsi untuk Check Authorize Role
   checkAuthorize(){
    const user = AuthService.getCurrentUser();
    
    this.setState({
        user: user
    });

    if (user !== null) {
      if (user.roles.includes("ROLE_KEPALA")) {
        this.setState({
          kepalaPerpus: true
        });
      }
  
      if (user.roles.includes("ROLE_STAFF")) {
        this.setState({
          staffPerpus: true
        });
      }
  
      if (user.roles.includes("ROLE_PENGGUNA")) {
        this.setState({
          pengguna: true
        });
      }

      if (user.roles.includes("ROLE_PENGUNJUNG")) {
        this.setState({
          pengunjung: true
        });
      }

    }

  }

  componentDidMount() {
    this.checkAuthorize();
  }

  render() {
    if (this.state.kepalaPerpus) {
      return(<DashboardKepala />);
    }

    else if (this.state.pengunjung) {
      return(<FormInputAbsen />);
    }

    else {return(<DaftarPengumuman />);}
  }
}
