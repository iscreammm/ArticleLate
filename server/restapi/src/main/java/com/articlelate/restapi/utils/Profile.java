package com.articlelate.restapi.utils;

public class Profile {
    private String identificator;
    private String name;
    private int follows;
    private int followers;
    private String info;
    private String imagePath;

    public Profile(String identificator, String name, int follows,
                   int followers, String info, String imagePath) {
        this.identificator = identificator;
        this.name = name;
        this.follows = follows;
        this.followers = followers;
        this.info = info;
        this.imagePath = imagePath;
    }
}
