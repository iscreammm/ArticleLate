package com.articlelate.restapi;

import com.articlelate.restapi.utils.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@RestController
public class RestapiController {

    static Dotenv dotenv = Dotenv.load();

    @GetMapping("/verifyLogin")
    public String verifyLogin(@RequestParam String login) {
        boolean data = false;

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "SELECT * FROM auth_data WHERE login = \'" + login + "\'";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            if (rs.next()) {
                data = false;
            } else {
                data = true;
            }
        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось проверить доступность логина", -1));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @PostMapping("/regUser")
    public String regUser(@RequestBody String dataJson) {
        int data = 0;

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        UserData user = gson.fromJson(dataJson, UserData.class);

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "SELECT * FROM auth_data WHERE login = \'" + user.getLogin() + "\'";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            if (rs.next()) {
                return gson.toJson(new Message<>("Error", "Логин занят", -1));
            }

            sql = "INSERT INTO auth_data"
                    + "(login, pass) "
                    + "VALUES"
                    + "(\'" + user.getLogin() + "\', "
                    + "\'" + user.getPass() + "\')";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

            int loginId = 0;

            sql = "SELECT * FROM auth_data WHERE login = \'" + user.getLogin() + "\'";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            rs = statement.executeQuery(sql);

            while (rs.next()) {
                loginId = rs.getInt("id");
            }

            sql = "INSERT INTO user_info"
                    + "(info, loginid, name, identificator, profilepicture) "
                    + "VALUES"
                    + "(\'\', "
                    + loginId + ", "
                    + "\'" + user.getName() + "\', "
                    + "\'" + "user" + loginId + "\', "
                    + "\'" + "pictures/defaultProfilePic" + ".png\')";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

            sql = "SELECT id FROM user_info WHERE loginid = " + loginId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            rs = statement.executeQuery(sql);

            while (rs.next()) {
                data = rs.getInt("id");
            }
        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось зарегистрировать пользователя", -1));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @GetMapping("/loginUser")
    public String loginUser(@RequestBody String dataJson) {
        int data = 0;

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        AuthData auth = gson.fromJson(dataJson, AuthData.class);

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "SELECT * FROM auth_data WHERE login = \'" + auth.getLogin() + "\'";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            if (!rs.next()) {
                return gson.toJson(new Message<>("Error", "Неверный логин", -1));
            }

            sql = "SELECT user_info.id FROM user_info"
                    + " JOIN auth_data ON user_info.loginid = auth_data.id"
                    + " WHERE auth_data.login = \'" + auth.getLogin() + "\'"
                    + " AND auth_data.pass = \'" + auth.getPass() + "\'";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            rs = statement.executeQuery(sql);

            if (!rs.next()) {
                return gson.toJson(new Message<>("Error", "Неверный пароль", -1));
            }

            data = rs.getInt("id");
        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось выполнить вход", -1));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @GetMapping("/getProfile")
    public String getProfile(@RequestParam int userId) {
        String data = "";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "SELECT COUNT(*) AS follows_count FROM relationships WHERE followerid = " + userId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            int follows = 0;

            ResultSet rs = statement.executeQuery(sql);

            while(rs.next()) {
                follows = rs.getInt("follows_count");
            }

            sql = "SELECT COUNT(*) AS followers_count FROM relationships WHERE subscribeid = " + userId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            int followers = 0;

            rs = statement.executeQuery(sql);

            while(rs.next()) {
                followers = rs.getInt("followers_count");
            }

            sql = "SELECT * FROM user_info WHERE id = " + userId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            rs = statement.executeQuery(sql);

            while (rs.next()) {
                data = gson.toJson(new Profile(rs.getString("identificator"), rs.getString("name"),
                        follows, followers, rs.getString("info"), rs.getString("profilepicture")));
            }
        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось загрузить профиль пользователя", -1));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @GetMapping("/getUserPosts")
    public String getUserPosts(@RequestParam int userId,
                               @RequestParam(required = false, defaultValue = "0") int prevPostId) {
        String data = "";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            Timestamp time = new Timestamp(System.currentTimeMillis());

            if (prevPostId != 0) {

                String sql = "SELECT posttime FROM posts WHERE id = " + prevPostId;

                dbConnection = db.getDBConnection();
                statement = dbConnection.createStatement();

                ResultSet rs = statement.executeQuery(sql);

                while(rs.next()) {
                    time = rs.getTimestamp("posttime");
                }
            }

            String sql = "SELECT posts.id, authorid, user_info.identificator, user_info.name, posttime, posttext,"
                    + " categories.name AS category, postpicture, postlikes"
                    + " FROM posts"
                    + " JOIN categories ON postcategoryid = categories.id"
                    + " JOIN user_info ON authorid = user_info.id"
                    + " WHERE authorid = " + userId + " AND posttime < \'" + time + "\'"
                    + " ORDER BY posttime DESC LIMIT 3";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            List<Post> postList = new ArrayList<>();

            ResultSet rs = statement.executeQuery(sql);

            while (rs.next()) {
                postList.add(new Post(rs.getInt("id"), rs.getInt("authorid"),
                        rs.getString("identificator"), rs.getString("name"),
                        rs.getTimestamp("posttime"), rs.getString("posttext"),
                        rs.getString("category"), rs.getString("postpicture"),
                        rs.getInt("postlikes")));
            }

            data = gson.toJson(postList);
        } catch (SQLException e) {
            e.printStackTrace();
            return gson.toJson(new Message<>("Error", "Не удалось загрузить посты пользователя", -1));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @PostMapping("/followUser")
    public String followUser(@RequestBody String dataJson) {
        int data = 0;

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        RelationshipsData relations = gson.fromJson(dataJson, RelationshipsData.class);

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "INSERT INTO relationships"
                    + "(followerid, subscribeid)"
                    + " VALUES"
                    + "(" + relations.getFollowerId() + ", " + relations.getUserId() + ")";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

            sql = "SELECT COUNT(*) AS follows_count FROM relationships WHERE followerid = " + relations.getFollowerId();

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            while(rs.next()) {
                data = rs.getInt("follows_count");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return gson.toJson(new Message<>("Error", "Не удалось подписаться на пользователя", -1));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @DeleteMapping("/unfollowUser")
    public String unfollowUser(@RequestBody String dataJson) {
        int data = 0;

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        RelationshipsData relations = gson.fromJson(dataJson, RelationshipsData.class);

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "DELETE FROM relationships"
                    + " WHERE followerid = " + relations.getFollowerId()
                    + " AND subscribeid = " + relations.getUserId();

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

            sql = "SELECT COUNT(*) AS follows_count FROM relationships WHERE followerid = " + relations.getFollowerId();

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            while(rs.next()) {
                data = rs.getInt("follows_count");
            }
        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось отписаться от пользователя", -1));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @PutMapping("/changeProfile")
    public String changeProfile(@RequestBody String dataJson) {
        String data = "";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        ProfileData profile = gson.fromJson(dataJson, ProfileData.class);

        try {
            if (!checkIdentificator(profile.getIdentificator())) {
                return gson.toJson(new Message<>("Error", "Идентификатор не может начинаться с \"user\"", -1));
            }

            data = loadImage(profile.getImagePath(), "profilePictures");

            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "UPDATE user_info SET identificator = \'" + profile.getIdentificator() + "\'"
                    + ", name = \'" + profile.getName() + "\', " + " info = \'" + profile.getInfo() + "\'"
                    + ", profilepicture = \'" + data + "\' WHERE id = " + profile.getId();

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

        } catch (IOException e) {
            e.printStackTrace();
            return gson.toJson(new Message<>("Error", "Не удалось загрузить изображение", -1));

        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось изменить информацию профиля", -1));

        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }


    @GetMapping("/verifyIdentificator")
    public String verifyIdentificator(@RequestParam String identificator) {
        boolean data = false;

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            if (!checkIdentificator(identificator)) {
                return gson.toJson(new Message<>("Error", "Идентификатор не может начинаться с \"user\"", -1));
            }

            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "SELECT * FROM user_info WHERE identificator = \'" + identificator + "\'";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            if (rs.next()) {
                data = false;
            } else {
                data = true;
            }
        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось проверить доступность идентификатора", -1));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    //not listed in specification
    @PostMapping("/createPost")
    public String createPost(@RequestBody String dataJson) {
        String data = "";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        PostData post = gson.fromJson(dataJson, PostData.class);

        try {
            data = loadImage(post.getImage(), "postPictures");

            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "INSERT INTO posts(authorid, posttime, postcategoryid, postpicture, posttext, postlikes)"
                    + " VALUES(" + post.getAuthorId() + ", \'" + new Timestamp(System.currentTimeMillis()) + "\'"
                    + ", " + post.getCategoryId() + ", \'" + data + "\', \'" + post.getText() + "\'"
                    + ", " + 0 + ")";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

        } catch (IOException e) {
            return gson.toJson(new Message<>("Error", "Не удалось загрузить изображение", -1));

        } catch (SQLException e) {
            e.printStackTrace();
            return gson.toJson(new Message<>("Error", "Не удалось изменить содержимое поста", -1));

        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @PutMapping("/incLikesOnPost")
    public String incLikesOnPost(@RequestParam int postId) {
        int data = 0;

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "UPDATE posts SET postlikes = postlikes + 1"
                    + " WHERE id = " + postId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

            sql = "SELECT postlikes FROM posts WHERE id = " + postId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            while (rs.next()) {
                data = rs.getInt("postlikes");
            }

        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось поставить лайк посту", -1));

        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @PutMapping("/decLikesOnPost")
    public String decLikesOnPost(@RequestParam int postId) {
        int data = 0;

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "UPDATE posts SET postlikes = postlikes - 1"
                    + " WHERE id = " + postId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

            sql = "SELECT postlikes FROM posts WHERE id = " + postId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            while (rs.next()) {
                data = rs.getInt("postlikes");
            }

        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось убрать лайк с поста", -1));

        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @GetMapping("/getPost")
    public String getPost(@RequestParam int postId) {
        String data = "";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "SELECT posts.id, authorid, user_info.identificator, user_info.name, posttime, posttext,"
                    + " categories.name AS category, postpicture, postlikes"
                    + " FROM posts"
                    + " JOIN categories ON postcategoryid = categories.id"
                    + " JOIN user_info ON authorid = user_info.id"
                    + " WHERE posts.id = " + postId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            if (!rs.next()) {
                return gson.toJson(new Message<>("Error", "Пост был удален", -1));
            } else {
                data = gson.toJson(new Post(rs.getInt("id"), rs.getInt("authorid"),
                        rs.getString("identificator"), rs.getString("name"),
                        rs.getTimestamp("posttime"), rs.getString("posttext"),
                        rs.getString("category"), rs.getString("postpicture"),
                        rs.getInt("postlikes")));
            }

        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось загрузить пост", -1));

        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @DeleteMapping("/deletePost")
    public String deletePost(@RequestParam int postId) {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "DELETE FROM posts WHERE id = " + postId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось удалить пост", -1));

        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", 1));
    }

    @PutMapping("/changePost")
    public String changePost(@RequestBody String dataJson) {
        String data = "";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        PostData post = gson.fromJson(dataJson, PostData.class);

        try {
            data = loadImage(post.getImage(), "postPictures");

            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "UPDATE posts SET postpicture = \'" + data + "\'"
                    + ", posttext = \'" + post.getText() + "\' WHERE id = " + post.getId();

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

        } catch (IOException e) {
            return gson.toJson(new Message<>("Error", "Не удалось загрузить изображение", -1));

        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось изменить содержимое поста", -1));

        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    @GetMapping("/getComments")
    public String getComments(@RequestParam int postId,
                              @RequestParam(required = false, defaultValue = "0") int prevCommentId) {
        String data = "";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            Timestamp time = new Timestamp(0);

            if (prevCommentId != 0) {
                String sql = "SELECT commenttime FROM commentaries WHERE id = " + prevCommentId;

                dbConnection = db.getDBConnection();
                statement = dbConnection.createStatement();

                ResultSet rs = statement.executeQuery(sql);

                while (rs.next()) {
                    time = rs.getTimestamp("commenttime");
                }
            }

            String sql = "SELECT commentaries.id, userid, user_info.identificator,"
                    + " user_info.name, commenttime, commenttext, user_info.profilepicture"
                    + " FROM commentaries JOIN user_info ON userid = user_info.id"
                    + " WHERE postid = " + postId + " AND commenttime > \'" + time + "\'"
                    + " ORDER BY commenttime ASC LIMIT 5";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            List<Comment> commentList = new ArrayList<>();

            ResultSet rs = statement.executeQuery(sql);

            while (rs.next()) {
                commentList.add(new Comment(rs.getInt("id"), rs.getInt("userid"),
                        rs.getString("identificator"), rs.getString("name"),
                        rs.getTimestamp("commenttime"), rs.getString("commenttext"),
                        rs.getString("profilepicture")));
            }

            data = gson.toJson(commentList);

        } catch (SQLException e) {
            return gson.toJson(new Message<>("Error", "Не удалось загрузить комментарии", -1));

        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message<>("Success", "", data));
    }

    //need test loading image by url!!!
    private String loadImage(String url, String foldername) throws IOException {
        File folder = new File(foldername);

        if (!folder.exists()) {
            folder.mkdir();
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");

        String format = parseFormat(url);

        System.out.println("parsed: " + format);

        BufferedImage img = ImageIO.read(new URL(url));

        System.out.println("imageCreated");

        String filename = sdf.format(System.currentTimeMillis()) + format;
        File imgFile = new File(foldername, filename);

        if (!imgFile.exists()) {
            imgFile.createNewFile();
        }

        ImageIO.write(img, format.substring(1, 3), imgFile);

        return foldername + filename;
    }

    private String parseFormat(String filename) throws IOException {
        String format = filename.substring(filename.length() - 4, filename.length());
        String[] allowedFormats = new String[]{".jpg", ".png", ".bmp"};

        for (String item : allowedFormats) {
            if (format.equals(item)) {
                return format;
            }
        }

        throw new IOException();
    }

    private boolean checkIdentificator(String identificator) {
        if (identificator.substring(0, 4).equals("user"))
            return false;
        else
            return true;
    }
}
