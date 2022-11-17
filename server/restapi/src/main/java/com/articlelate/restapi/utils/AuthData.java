package com.articlelate.restapi.utils;

public class AuthData {
    private String login;
    private String pass;

    public AuthData(String login, String pass) {
        this.login = login;
        this.pass = pass;
    }

    public String getLogin() {
        return login;
    }

    public String getPass() {
        return pass;
    }
}
