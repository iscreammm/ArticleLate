package com.articlelate.restapi.utils;

public class Message<T> {
    private String state;
    private String message;
    private T data;

    public Message(String state, String message, T data) {
        this.state = state;
        this.message = message;
        this.data = data;
    }
}
