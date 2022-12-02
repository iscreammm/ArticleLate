package com.articlelate.restapi.utils;

public class PostData {
    private int id;
    private int authorId;
    private int categoryId;
    private String text;
    private String image;

    public PostData(int id, String text, String image) {
        this.id = id;
        this.text = text;
        this.image = image;

        this.authorId = 0;
        this.categoryId = 0;
    }

    public PostData(int authorId, int categoryId, String text, String image) {
        this.authorId = authorId;
        this.categoryId = categoryId;
        this.text = text;
        this.image = image;

        this.id = 0;
    }

    public int getId() {
        return id;
    }

    public int getAuthorId() {
        return authorId;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public String getText() {
        return text;
    }

    public String getImage() {
        return image;
    }
}
