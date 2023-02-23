package com.articlelate.restapi.utils;

import java.sql.Timestamp;

public class Post {
    private int id;
    private int authorId;
    private String authorImage;
    private String identificator;
    private String name;
    private Timestamp time;
    private String text;
    private String category;
    private String image;
    private int likesCount;
    private boolean isLiked;

    public Post(int id, int authorId, String authorImage, String identificator, String name,
                Timestamp time, String text, String category, String image, int likesCount, boolean isLiked) {
        this.id = id;
        this.authorId = authorId;
        this.authorImage = authorImage;
        this.identificator = identificator;
        this.name = name;
        this.time = time;
        this.text = text;
        this.category = category;
        this.image = image;
        this.likesCount = likesCount;
        this.isLiked = isLiked;
    }

    public int getAuthorId() {
        return authorId;
    }

    public Timestamp getTime() {
        return time;
    }
}
