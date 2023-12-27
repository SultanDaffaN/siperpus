package propensi.b04.siperpus.rest;

import propensi.b04.siperpus.model.BukuModel;
import propensi.b04.siperpus.model.UserModel;

public class UserDTO {
    public String status;

    public UserModel activateUser(UserModel user) {
        user.setStatus(status);

        return user;
    }
}
