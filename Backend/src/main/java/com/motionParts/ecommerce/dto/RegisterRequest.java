package com.motionParts.ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {

    @NotNull(message = "El usuario no puede ser nulo")
    @Valid
    private UserDTO user;

    @NotNull(message = "La información del usuario no puede ser nula")
    @Valid
    private UserInfoDTO userInfo;

    public RegisterRequest() {}

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public UserInfoDTO getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfoDTO userInfo) {
        this.userInfo = userInfo;
    }
}