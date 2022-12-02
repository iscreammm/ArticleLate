package com.articlelate.restapi.utils;

public class Notification {
    private int id;
    private int userId;
    private int postId;

    public Notification(int id, int userId, int postId) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
    }
}
