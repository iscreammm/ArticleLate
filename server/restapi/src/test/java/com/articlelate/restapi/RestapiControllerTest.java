package com.articlelate.restapi;

import com.articlelate.restapi.utils.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import io.github.cdimascio.dotenv.Dotenv;
import org.checkerframework.checker.units.qual.C;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.*;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class RestapiControllerTest {

    @BeforeAll
    @AfterAll
    static void init(){
        try {
            Dotenv dotenv = Dotenv.load();
            DataBase db = new DataBase(dotenv.get("DB_URL"), dotenv.get("USER"), dotenv.get("PASS"));

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "DROP TABLE auth_data, categories, commentaries, likes, " +
                    "notifications, posts, relationships, user_info CASCADE";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            statement.execute(sql);

            if (statement != null) {
                statement.close();
            }
            if (dbConnection != null) {
                dbConnection.close();
            }

        } catch (SQLException e) {
            e.printStackTrace();

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } ;
    }

    RestapiController rest = new RestapiController();
    @DisplayName("Success registration")
    @Order(1)
    @Test
    void regUserSuccess(){
        JsonObject json1 = new JsonObject();
        JsonObject json2 = new JsonObject();

        json1.addProperty("name", "testUser1");
        json1.addProperty("login", "testUser1");
        json1.addProperty("pass", "testPassword");

        json2.addProperty("name", "testUser2");
        json2.addProperty("login", "testUser2");
        json2.addProperty("pass", "testPassword");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.regUser(json1.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());

        message = gson.fromJson(rest.regUser(json2.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(2.0, message.getData());
    }

    @DisplayName("Unsuccess login")
    @Order(2)
    @Test
    void regUserUnsuccessLoginNotFree(){
        JsonObject json = new JsonObject();

        json.addProperty("name", "testUser");
        json.addProperty("login", "testUser1");
        json.addProperty("pass", "testPassword");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.regUser(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Логин занят", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Login free")
    @Order(3)
    @Test
    void verifyLoginFree(){
        JsonObject json = new JsonObject();

        json.addProperty("login", "testUser");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.verifyLogin(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @DisplayName("Login not free")
    @Order(4)
    @Test
    void verifyLoginNotFree(){
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.verifyLogin("testUser1"), Message.class);

        assertEquals("Success", message.getState());
        assertFalse (message.getData());
    }

    @DisplayName("Login success")
    @Order(5)
    @Test
    void loginSuccess(){
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.loginUser("testUser1", "testPassword"), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Login unsuccess incorrect login")
    @Order(6)
    @Test
    void loginUnsuccessIncorrectLogin(){
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.loginUser("wrongUser", "password"), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Неверный логин", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Login unsuccess incorrect password")
    @Order(7)
    @Test
    void loginUnsuccessIncorrectPassword(){
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.loginUser("testUser1", "wrongpassword"), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Неверный пароль", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Success follow")
    @Order(8)
    @Test
    void followUser() {
        JsonObject json = new JsonObject();

        json.addProperty("followerId", 2);
        json.addProperty("userId", 1);

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.followUser(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Right relationships test")
    @Order(9)
    @Test
    void getIsSubscribeRight() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.getIsSubscribe(2, 1), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @DisplayName("Success get profile")
    @Order(10)
    @Test
    void getProfile() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getProfile(1), Message.class);

        Profile profile = gson.fromJson(message.getData(), Profile.class);

        assertEquals("Success", message.getState());
        assertEquals("user1", profile.getIdentificator());
        assertEquals("testUser1", profile.getName());
        assertEquals(0, profile.getFollows());
        assertEquals(1, profile.getFollowers());

        message = gson.fromJson(rest.getProfile(2), Message.class);
        profile = gson.fromJson(message.getData(), Profile.class);

        assertEquals("Success", message.getState());
        assertEquals("user2", profile.getIdentificator());
        assertEquals("testUser2", profile.getName());
        assertEquals(1, profile.getFollows());
        assertEquals(0, profile.getFollowers());
    }

    @DisplayName("Create post success with image")
    @Order(11)
    @Test
    void createPostSuccessWithImage() throws JSONException {
        JsonObject json = new JsonObject();

        json.addProperty("authorId", 1);
        json.addProperty("categoryId", 2);
        json.addProperty("text", "text");
        json.addProperty("image", "iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAA+VBMVEX39/f6AAAncyz6ooJieBkFAwMAAwP/AAD+/P7/pIYjcy1leBfsnnlUdQkAaAze5d6fh0dcdxP6p4b3//9JdiMbbyH6UEF9oX/6knX6blgAZgAUbRuiuqPSAQFddxzQlWiAfzE+dSZSdiBOhVH4z88eAwPD0cP5Z2cydCr38vKTAgLIzbpbcgD42Nj5XFz6HR36Pz/wAQE/fkOyjFSwuZtoAwOqAgL5iYmLAgL4qKj5e3v6QzYtAwOQgz3R29J8AwMAWwBGbwD34ODArJBwfTJdAwP6UFDhAQH4srL6LiX6clsUAwM7AwNPaQBbeS3o7OgvbQpqlmxyj1iAOB7VAAADtUlEQVR4nO3daVPaUBSAYTbFAAlCRCruihsVLW5dsdrNWlu1/f8/pn7jnMzkGjAhJLzvV2ZMHm+YyWG7mQwRERERUdDmdHGfTlRVX6t2VSlVz539ORRdL4uck9SiDwuirVJOtA06PYEGDTpdgQYNOl1NK7o2KL3oL13Z1w1R/9u+bLsqu4z7xF+Qe5SVLdUt0XqtLKo5sqsEr7u750HnB1nrtnyGr6mLvQU6WYEGDRo06CQGGjToaULX0oJ2s4YUOm+p8racucot2VU1bpY59zgwWldRF3tZrbsDevICDRo0aNCgQU9uoFOMdlUaXVQt1VUJRh9kj2XafD6zM2j2ItsblF2sJxntX/F8VnZRlA+mGD0zCDRo0KBBT06gQYMGnUS0GqsyJvT31Nx7d38cyQzo7M2qrKceSxa6bWJ611qmH0ov2hBo0KBBgwYNGjRo0M+k5qquiVI03G0nC91+K/tgMnfeyW6Si3bfm1ZMo2fUBL1qWOsUoXfUayWgQYMGDRo0aNCgQQ8HlU3JvXf7/U+Raa7yoDuyZE1ZbnCmV53ceXp0dPBAgwYNGjRo0KBBgx4KHfz+etLRbVl3z3C2PfUxQNP06On2o2wpfrR7G/TUi6tqZJ4Njv41ad/Ac98MgZYvjuwER0/cdy1BgwYNGjRo0KBBJwotuwsFbZnQrRDRB7KMRvdUHvTdJ9HvkdEV0dNKr4kKJ7JceGjTbyAWP6vV7ChYcdR52vNrkte2rCRrRbVV3DNo+bztjPxKgQkdx++GggYNGjRo0KBBgwY9HrS+jTej/QeO0dGW/35ZhajQVbUVsm3V/VscdZLK+/9N69QW28HVttRclctFhVYb79lW3rf64qir6f8389ap2ppgywMFDRo0aNCgQYMGDTpNaLUPsGfDqijQ+hCnaq7yoKPalbjaUls+b6gq6mxfjZo2z6tD3KvD7yvz9oPagDo0c6bqyMOUCupi1+hwsvrqgl4wXNCR7TTuQZfHjC6DBg0aNGjQoEGDnk701bJMbQNsV6wI6hfkMTS6Ic/FOYkK/bCretyU9ecj6F4dQs1Vjb/6bCIye9+1bKmLvRZF+/4XdKMZ0Schzf8BjV4rhF950/9J/IQeExQ0aNCgQYMGDRr0RKH1zGXLD9apN71e0OOyb0486BXVmerfQig1V/zbjQPtmbl0zUYphJxL0zHiMJt6Qvs/G4PnXMYNGSbQoEGDBg06IYEGnWq00wihVrLQK81QmoDN64bINB0NUdwMIiIiIhpL/wGJY9+ssJDbRQAAAABJRU5ErkJggg==");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.createPost(json.toString()), Message.class);

        org.json.JSONObject obj = new JSONObject(message.getData());
        String way = obj.getString("imagePath");
        Integer id = obj.getInt("postId");

        assertEquals("Success", message.getState());

        Path path = Paths.get("");

        String filePath = path.toAbsolutePath().toString();

        filePath = filePath.substring(0, filePath.indexOf("\\server"));

        File img = new File(filePath + "\\client\\public\\"
                + way.substring(0, way.indexOf("/"))
                + "\\" + way.substring(way.indexOf("/")));

        assertTrue(img.exists());
        assertEquals(1, id);
    }

    @DisplayName("Create post success without image")
    @Order(12)
    @Test
    void createPostSuccessWithOutImage() throws JSONException {
        JsonObject json = new JsonObject();
        JsonObject json2 = new JsonObject();

        json.addProperty("authorId", 1);
        json.addProperty("categoryId", 2);
        json.addProperty("text", "text");
        json.addProperty("image", "");

        json2.addProperty("authorId", 2);
        json2.addProperty("categoryId", 2);
        json2.addProperty("text", "text");
        json2.addProperty("image", "");


        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        Message<String> message = gson.fromJson(rest.createPost(json.toString()), Message.class);

        org.json.JSONObject obj = new JSONObject(message.getData());
        Integer id = obj.getInt("postId");

        assertEquals("Success", message.getState());
        assertEquals(2, id);

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        message = gson.fromJson(rest.createPost(json.toString()), Message.class);
        obj = new JSONObject(message.getData());
        id = obj.getInt("postId");

        assertEquals("Success", message.getState());
        assertEquals(3, id);

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        message = gson.fromJson(rest.createPost(json.toString()), Message.class);
        obj = new JSONObject(message.getData());
        id = obj.getInt("postId");

        assertEquals("Success", message.getState());
        assertEquals(4, id);

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        message = gson.fromJson(rest.createPost(json2.toString()), Message.class);
        obj = new JSONObject(message.getData());
        id = obj.getInt("postId");

        assertEquals("Success", message.getState());
        assertEquals(5, id);
    }

    @DisplayName("Create post unsuccess")
    @Order(13)
    @Test
    void createPostWrongImage() {
        JsonObject json = new JsonObject();

        json.addProperty("authorId", 1);
        json.addProperty("categoryId", 2);
        json.addProperty("text", "text");
        json.addProperty("image", "iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAA+VBMVEX39/f6AAAncyz6ooJiFAwMAAwP/AAD+/P7/pIYjcy1leBfsnnlUdQkAaAze5d6fh0dcdxP6p4b3//9JdiMbbyH6UEF9oX/6knX6blgAZgAUbRuiuqPSAQFddxzQlWiAfzE+dSZSdiBOhVH4z88eAwPD0cP5Z2cydCr38vKTAgLIzbpbcgD42Nj5XFz6HR36Pz/wAQE/fkOyjFSwuZtoAwOqAgL5iYmLAgL4qKj5e3v6QzYtAwOQgz3R29J8AwMAWwBGbwD34ODArJBwfTJdAwP6UFDhAQH4srL6LiX6clsUAwM7AwNPaQBbeS3o7OgvbQpqlmxyj1iAOB7VAAADtUlEQVR4nO3daVPaUBSAYTbFAAlCRCruihsVLW5dsdrNWlu1/f8/pn7jnMzkGjAhJLzvV2ZMHm+YyWG7mQwRERERUdDmdHGfTlRVX6t2VSlVz539ORRdL4uck9SiDwuirVJOtA06PYEGDTpdgQYNOl1NK7o2KL3oL13Z1w1R/9u+bLsqu4z7xF+Qe5SVLdUt0XqtLKo5sqsEr7u750HnB1nrtnyGr6mLvQU6WYEGDRo06CQGGjToaULX0oJ2s4YUOm+p8racucot2VU1bpY59zgwWldRF3tZrbsDevICDRo0aNCgQU9uoFOMdlUaXVQt1VUJRh9kj2XafD6zM2j2ItsblF2sJxntX/F8VnZRlA+mGD0zCDRo0KBBT06gQYMGnUS0GqsyJvT31Nx7d38cyQzo7M2qrKceSxa6bWJ611qmH0ov2hBo0KBBgwYNGjRo0M+k5qquiVI03G0nC91+K/tgMnfeyW6Si3bfm1ZMo2fUBL1qWOsUoXfUayWgQYMGDRo0aNCgQQ8HlU3JvXf7/U+Raa7yoDuyZE1ZbnCmV53ceXp0dPBAgwYNGjRo0KBBgx4KHfz+etLRbVl3z3C2PfUxQNP06On2o2wpfrR7G/TUi6tqZJ4Njv41ad/Ac98MgZYvjuwER0/cdy1BgwYNGjRo0KBBJwotuwsFbZnQrRDRB7KMRvdUHvTdJ9HvkdEV0dNKr4kKJ7JceGjTbyAWP6vV7ChYcdR52vNrkte2rCRrRbVV3DNo+bztjPxKgQkdx++GggYNGjRo0KBBgwY9HrS+jTej/QeO0dGW/35ZhajQVbUVsm3V/VscdZLK+/9N69QW28HVttRclctFhVYb79lW3rf64qir6f8389ap2ppgywMFDRo0aNCgQYMGDTpNaLUPsGfDqijQ+hCnaq7yoKPalbjaUls+b6gq6mxfjZo2z6tD3KvD7yvz9oPagDo0c6bqyMOUCupi1+hwsvrqgl4wXNCR7TTuQZfHjC6DBg0aNGjQoEGDnk701bJMbQNsV6wI6hfkMTS6Ic/FOYkK/bCretyU9ecj6F4dQs1Vjb/6bCIye9+1bKmLvRZF+/4XdKMZ0Schzf8BjV4rhF950/9J/IQeExQ0aNCgQYMGDRr0RKH1zGXLD9apN71e0OOyb0486BXVmerfQig1V/zbjQPtmbl0zUYphJxL0zHiMJt6Qvs/G4PnXMYNGSbQoEGDBg06IYEGnWq00wihVrLQK81QmoDN64bINB0NUdwMIiIiIhpL/wGJY9+ssJDbRQAAAABJRU5ErkJggg==");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.createPost(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить изображение", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Inc likes on post ")
    @Order(14)
    @Test
    void incLikesOnPostSuccess() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.incLikesOnPost(2,2), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Get post")
    @Order(15)
    @Test
    void getPostSuccess() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPost(2, 2), Message.class);

        Post post = gson.fromJson(message.getData(), Post.class);

        assertEquals("Success", message.getState());
        assertEquals(2, post.getId());
        assertEquals(1, post.getAuthorId());
        assertEquals("Игры", post.getCategory());
        assertEquals("", post.getImage());
        assertEquals("text", post.getText());
        assertEquals(1, post.getLikesCount());
        assertTrue(post.isLiked());
    }

    @DisplayName("Dec likes on post")
    @Order(16)
    @Test
    void decLikesOnPostSuccess() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.decLikesOnPost(2,2), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(0.0, message.getData());

        message = gson.fromJson(rest.getPost(2,2), Message.class);
        Post post = gson.fromJson(message.getData(), Post.class);

        assertEquals("Success", message.getState());
        assertEquals(2, post.getId());
        assertEquals(0, post.getLikesCount());
        assertFalse(post.isLiked());
    }



    @DisplayName("Success change post")
    @Order(17)
    @Test
    void changePostSuccess() {
        JsonObject json = new JsonObject();

        json.addProperty("id", 2);
        json.addProperty("text", "newText");
        json.addProperty("categoryId", 2);
        json.addProperty("image", "iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAA+VBMVEX39/f6AAAncyz6ooJieBkFAwMAAwP/AAD+/P7/pIYjcy1leBfsnnlUdQkAaAze5d6fh0dcdxP6p4b3//9JdiMbbyH6UEF9oX/6knX6blgAZgAUbRuiuqPSAQFddxzQlWiAfzE+dSZSdiBOhVH4z88eAwPD0cP5Z2cydCr38vKTAgLIzbpbcgD42Nj5XFz6HR36Pz/wAQE/fkOyjFSwuZtoAwOqAgL5iYmLAgL4qKj5e3v6QzYtAwOQgz3R29J8AwMAWwBGbwD34ODArJBwfTJdAwP6UFDhAQH4srL6LiX6clsUAwM7AwNPaQBbeS3o7OgvbQpqlmxyj1iAOB7VAAADtUlEQVR4nO3daVPaUBSAYTbFAAlCRCruihsVLW5dsdrNWlu1/f8/pn7jnMzkGjAhJLzvV2ZMHm+YyWG7mQwRERERUdDmdHGfTlRVX6t2VSlVz539ORRdL4uck9SiDwuirVJOtA06PYEGDTpdgQYNOl1NK7o2KL3oL13Z1w1R/9u+bLsqu4z7xF+Qe5SVLdUt0XqtLKo5sqsEr7u750HnB1nrtnyGr6mLvQU6WYEGDRo06CQGGjToaULX0oJ2s4YUOm+p8racucot2VU1bpY59zgwWldRF3tZrbsDevICDRo0aNCgQU9uoFOMdlUaXVQt1VUJRh9kj2XafD6zM2j2ItsblF2sJxntX/F8VnZRlA+mGD0zCDRo0KBBT06gQYMGnUS0GqsyJvT31Nx7d38cyQzo7M2qrKceSxa6bWJ611qmH0ov2hBo0KBBgwYNGjRo0M+k5qquiVI03G0nC91+K/tgMnfeyW6Si3bfm1ZMo2fUBL1qWOsUoXfUayWgQYMGDRo0aNCgQQ8HlU3JvXf7/U+Raa7yoDuyZE1ZbnCmV53ceXp0dPBAgwYNGjRo0KBBgx4KHfz+etLRbVl3z3C2PfUxQNP06On2o2wpfrR7G/TUi6tqZJ4Njv41ad/Ac98MgZYvjuwER0/cdy1BgwYNGjRo0KBBJwotuwsFbZnQrRDRB7KMRvdUHvTdJ9HvkdEV0dNKr4kKJ7JceGjTbyAWP6vV7ChYcdR52vNrkte2rCRrRbVV3DNo+bztjPxKgQkdx++GggYNGjRo0KBBgwY9HrS+jTej/QeO0dGW/35ZhajQVbUVsm3V/VscdZLK+/9N69QW28HVttRclctFhVYb79lW3rf64qir6f8389ap2ppgywMFDRo0aNCgQYMGDTpNaLUPsGfDqijQ+hCnaq7yoKPalbjaUls+b6gq6mxfjZo2z6tD3KvD7yvz9oPagDo0c6bqyMOUCupi1+hwsvrqgl4wXNCR7TTuQZfHjC6DBg0aNGjQoEGDnk701bJMbQNsV6wI6hfkMTS6Ic/FOYkK/bCretyU9ecj6F4dQs1Vjb/6bCIye9+1bKmLvRZF+/4XdKMZ0Schzf8BjV4rhF950/9J/IQeExQ0aNCgQYMGDRr0RKH1zGXLD9apN71e0OOyb0486BXVmerfQig1V/zbjQPtmbl0zUYphJxL0zHiMJt6Qvs/G4PnXMYNGSbQoEGDBg06IYEGnWq00wihVrLQK81QmoDN64bINB0NUdwMIiIiIhpL/wGJY9+ssJDbRQAAAABJRU5ErkJggg==");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.changePost(json.toString()), Message.class);

        assertEquals("Success", message.getState());

        Path path = Paths.get("");

        String filePath = path.toAbsolutePath().toString();

        filePath = filePath.substring(0, filePath.indexOf("\\server"));

        File img = new File(filePath + "\\client\\public\\"
                + message.getData().substring(0, message.getData().indexOf("/"))
                + "\\" + message.getData().substring(message.getData().indexOf("/")));

        assertTrue(img.exists());
    }

    @DisplayName("Unsuccess change post")
    @Order(18)
    @Test
    void changePostUnSuccess() {
        JsonObject json = new JsonObject();

        json.addProperty("id", 1);
        json.addProperty("text", "newText");
        json.addProperty("imagePath", "iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAA+VBMVEX39/f6AAAncyz6ooJiFAwMAAwP/AAD+/P7/pIYjcy1leBfsnnlUdQkAaAze5d6fh0dcdxP6p4b3//9JdiMbbyH6UEF9oX/6knX6blgAZgAUbRuiuqPSAQFddxzQlWiAfzE+dSZSdiBOhVH4z88eAwPD0cP5Z2cydCr38vKTAgLIzbpbcgD42Nj5XFz6HR36Pz/wAQE/fkOyjFSwuZtoAwOqAgL5iYmLAgL4qKj5e3v6QzYtAwOQgz3R29J8AwMAWwBGbwD34ODArJBwfTJdAwP6UFDhAQH4srL6LiX6clsUAwM7AwNPaQBbeS3o7OgvbQpqlmxyj1iAOB7VAAADtUlEQVR4nO3daVPaUBSAYTbFAAlCRCruihsVLW5dsdrNWlu1/f8/pn7jnMzkGjAhJLzvV2ZMHm+YyWG7mQwRERERUdDmdHGfTlRVX6t2VSlVz539ORRdL4uck9SiDwuirVJOtA06PYEGDTpdgQYNOl1NK7o2KL3oL13Z1w1R/9u+bLsqu4z7xF+Qe5SVLdUt0XqtLKo5sqsEr7u750HnB1nrtnyGr6mLvQU6WYEGDRo06CQGGjToaULX0oJ2s4YUOm+p8racucot2VU1bpY59zgwWldRF3tZrbsDevICDRo0aNCgQU9uoFOMdlUaXVQt1VUJRh9kj2XafD6zM2j2ItsblF2sJxntX/F8VnZRlA+mGD0zCDRo0KBBT06gQYMGnUS0GqsyJvT31Nx7d38cyQzo7M2qrKceSxa6bWJ611qmH0ov2hBo0KBBgwYNGjRo0M+k5qquiVI03G0nC91+K/tgMnfeyW6Si3bfm1ZMo2fUBL1qWOsUoXfUayWgQYMGDRo0aNCgQQ8HlU3JvXf7/U+Raa7yoDuyZE1ZbnCmV53ceXp0dPBAgwYNGjRo0KBBgx4KHfz+etLRbVl3z3C2PfUxQNP06On2o2wpfrR7G/TUi6tqZJ4Njv41ad/Ac98MgZYvjuwER0/cdy1BgwYNGjRo0KBBJwotuwsFbZnQrRDRB7KMRvdUHvTdJ9HvkdEV0dNKr4kKJ7JceGjTbyAWP6vV7ChYcdR52vNrkte2rCRrRbVV3DNo+bztjPxKgQkdx++GggYNGjRo0KBBgwY9HrS+jTej/QeO0dGW/35ZhajQVbUVsm3V/VscdZLK+/9N69QW28HVttRclctFhVYb79lW3rf64qir6f8389ap2ppgywMFDRo0aNCgQYMGDTpNaLUPsGfDqijQ+hCnaq7yoKPalbjaUls+b6gq6mxfjZo2z6tD3KvD7yvz9oPagDo0c6bqyMOUCupi1+hwsvrqgl4wXNCR7TTuQZfHjC6DBg0aNGjQoEGDnk701bJMbQNsV6wI6hfkMTS6Ic/FOYkK/bCretyU9ecj6F4dQs1Vjb/6bCIye9+1bKmLvRZF+/4XdKMZ0Schzf8BjV4rhF950/9J/IQeExQ0aNCgQYMGDRr0RKH1zGXLD9apN71e0OOyb0486BXVmerfQig1V/zbjQPtmbl0zUYphJxL0zHiMJt6Qvs/G4PnXMYNGSbQoEGDBg06IYEGnWq00wihVrLQK81QmoDN64bINB0NUdwMIiIiIhpL/wGJY9+ssJDbRQAAAABJRU5ErkJggg==");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.changePost(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить изображение", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Feed with only userId test")
    @Order(19)
    @Test
    void getFeedWithUserId() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPosts(2, 0,0), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(posts).count() < 4);
        assertTrue(posts[0].getTime().after(posts[1].getTime()));
        assertTrue(posts[1].getTime().after(posts[2].getTime()));


        assertTrue(posts[0].getAuthorId() != 2);
        assertTrue(posts[1].getAuthorId() != 2);
        assertTrue(posts[2].getAuthorId() != 2);

        assertEquals("newText", posts[2].getText());
    }

    @DisplayName("Feed with userId and prevPostId test")
    @Order(20)
    @Test
    void getFeedWithPrevPostId() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPosts(2, 4,0), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(posts).count() < 4);

        assertTrue(posts[0].getTime().after(posts[1].getTime()));
        assertTrue(posts[1].getTime().after(posts[2].getTime()));

        message = gson.fromJson(rest.getPost(1, 4), Message.class);
        Post prevPost = gson.fromJson(message.getData(), Post.class);

        assertTrue(posts[0].getTime().before(prevPost.getTime()));
        assertTrue(posts[0].getAuthorId() != 2);
        assertTrue(posts[1].getAuthorId() != 2);
        assertTrue(posts[2].getAuthorId() != 2);
    }

    @DisplayName("Feed with UserId and category test")
    @Order(21)
    @Test
    void getFeedWithCategory() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPosts(2, 0,3), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }


    @DisplayName("Feed with all parameters test")
    @Order(22)
    @Test
    void getFeedWithAllParameters() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPosts(2, 4,2), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(posts).count() < 4);
        assertTrue(posts[0].getTime().after(posts[1].getTime()));
        assertTrue(posts[1].getTime().after(posts[2].getTime()));
        assertEquals("Игры", posts[0].getCategory());
        assertEquals("Игры", posts[1].getCategory());
        assertEquals("Игры", posts[2].getCategory());
        assertTrue(posts[0].getAuthorId() != 2);
        assertTrue(posts[1].getAuthorId() != 2);
        assertTrue(posts[2].getAuthorId() != 2);

        message = gson.fromJson(rest.getPost(1, 4), Message.class);
        Post prevPost = gson.fromJson(message.getData(), Post.class);

        assertTrue(posts[0].getTime().before(prevPost.getTime()));
    }

    @DisplayName("Success delete post test")
    @Order(23)
    @Test
    void deletePostSuccess() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.deletePost(4), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());

        message = gson.fromJson(rest.deletePost(5), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Subfeed with empty data test")
    @Order(24)
    @Test
    void getSubFeedNoPosts() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPosts(1, 0,0), Message.class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }

    @DisplayName("Subfeed with only userId test")
    @Order(25)
    @Test
    void getSubFeedWithUserId() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getSubPosts(2, 0,0), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(posts).count() < 4);
        assertTrue(posts[0].getTime().after(posts[1].getTime()));
        assertTrue(posts[1].getTime().after(posts[2].getTime()));
        assertEquals(1, posts[0].getAuthorId());
        assertEquals(1, posts[1].getAuthorId());
        assertEquals(1, posts[2].getAuthorId());
    }

    @DisplayName("Subfeed with userId and prevPostId test")
    @Order(26)
    @Test
    void getSubFeedWithPrevPostId() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPosts(2, 3,0), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(posts).count() == 2);
        assertTrue(posts[0].getTime().after(posts[1].getTime()));

        message = gson.fromJson(rest.getPost(1, 3), Message.class);
        Post prevPost = gson.fromJson(message.getData(), Post.class);

        assertTrue(posts[0].getTime().before(prevPost.getTime()));
        assertTrue(posts[0].getTime().after(posts[1].getTime()));

        assertEquals(1, posts[0].getAuthorId());
        assertEquals(1, posts[1].getAuthorId());
    }

    @DisplayName("Subfeed with userId and category test")
    @Order(27)
    @Test
    void getSubFeedWithCategory() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPosts(2, 0,3), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }

    @DisplayName("Subfeed with all parameters test")
    @Order(28)
    @Test
    void getSubFeedWithAllParameters() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPosts(2, 3,2), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(posts).count() == 2);
        assertTrue(posts[0].getTime().after(posts[1].getTime()));
        assertEquals("Игры", posts[0].getCategory());
        assertEquals("Игры", posts[1].getCategory());

        message = gson.fromJson(rest.getPost(1, 3), Message.class);
        Post prevPost = gson.fromJson(message.getData(), Post.class);

        assertTrue(posts[0].getTime().before(prevPost.getTime()));
        assertTrue(posts[0].getTime().after(posts[1].getTime()));

        assertEquals(1, posts[0].getAuthorId());
        assertEquals(1, posts[1].getAuthorId());
    }

    @DisplayName("Empty data test")
    @Order(29)
    @Test
    void getFeedNoPosts() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getPosts(1, 0,0), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }

    @DisplayName("Userposts with empty data test")
    @Order(30)
    @Test
    void getEmptyUserPosts() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getUserPosts(2, 0), Message.class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }

    @DisplayName("Userposts with userId test")
    @Order(31)
    @Test
    void getUserPostsWithUserId() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getUserPosts(1, 0), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(posts).count() < 4);
        assertEquals(1, posts[0].getAuthorId());
        assertEquals(1, posts[1].getAuthorId());
        assertEquals(1, posts[2].getAuthorId());
        assertTrue(posts[0].getTime().after(posts[1].getTime()));
        assertTrue(posts[1].getTime().after(posts[2].getTime()));
    }

    @DisplayName("Userposts with all parameters test")
    @Order(32)
    @Test
    void getUserPostsWithAll() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getUserPosts(1, 3), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(posts).count() == 2);
        assertEquals(1, posts[0].getAuthorId());
        assertEquals(1, posts[1].getAuthorId());

        message = gson.fromJson(rest.getPost(1, 3), Message.class);
        Post prevPost = gson.fromJson(message.getData(), Post.class);

        assertTrue(posts[0].getTime().before(prevPost.getTime()));
        assertTrue(posts[0].getTime().after(posts[1].getTime()));
    }

    @DisplayName("Profile success change")
    @Order(33)
    @Test
    void changeProfile() {
        JsonObject json = new JsonObject();

        json.addProperty("id", 1);
        json.addProperty("identificator", "newCoolIdent");
        json.addProperty("name", "someGoodName");
        json.addProperty("info", "No info");
        json.addProperty("imagePath", "iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAA+VBMVEX39/f6AAAncyz6ooJieBkFAwMAAwP/AAD+/P7/pIYjcy1leBfsnnlUdQkAaAze5d6fh0dcdxP6p4b3//9JdiMbbyH6UEF9oX/6knX6blgAZgAUbRuiuqPSAQFddxzQlWiAfzE+dSZSdiBOhVH4z88eAwPD0cP5Z2cydCr38vKTAgLIzbpbcgD42Nj5XFz6HR36Pz/wAQE/fkOyjFSwuZtoAwOqAgL5iYmLAgL4qKj5e3v6QzYtAwOQgz3R29J8AwMAWwBGbwD34ODArJBwfTJdAwP6UFDhAQH4srL6LiX6clsUAwM7AwNPaQBbeS3o7OgvbQpqlmxyj1iAOB7VAAADtUlEQVR4nO3daVPaUBSAYTbFAAlCRCruihsVLW5dsdrNWlu1/f8/pn7jnMzkGjAhJLzvV2ZMHm+YyWG7mQwRERERUdDmdHGfTlRVX6t2VSlVz539ORRdL4uck9SiDwuirVJOtA06PYEGDTpdgQYNOl1NK7o2KL3oL13Z1w1R/9u+bLsqu4z7xF+Qe5SVLdUt0XqtLKo5sqsEr7u750HnB1nrtnyGr6mLvQU6WYEGDRo06CQGGjToaULX0oJ2s4YUOm+p8racucot2VU1bpY59zgwWldRF3tZrbsDevICDRo0aNCgQU9uoFOMdlUaXVQt1VUJRh9kj2XafD6zM2j2ItsblF2sJxntX/F8VnZRlA+mGD0zCDRo0KBBT06gQYMGnUS0GqsyJvT31Nx7d38cyQzo7M2qrKceSxa6bWJ611qmH0ov2hBo0KBBgwYNGjRo0M+k5qquiVI03G0nC91+K/tgMnfeyW6Si3bfm1ZMo2fUBL1qWOsUoXfUayWgQYMGDRo0aNCgQQ8HlU3JvXf7/U+Raa7yoDuyZE1ZbnCmV53ceXp0dPBAgwYNGjRo0KBBgx4KHfz+etLRbVl3z3C2PfUxQNP06On2o2wpfrR7G/TUi6tqZJ4Njv41ad/Ac98MgZYvjuwER0/cdy1BgwYNGjRo0KBBJwotuwsFbZnQrRDRB7KMRvdUHvTdJ9HvkdEV0dNKr4kKJ7JceGjTbyAWP6vV7ChYcdR52vNrkte2rCRrRbVV3DNo+bztjPxKgQkdx++GggYNGjRo0KBBgwY9HrS+jTej/QeO0dGW/35ZhajQVbUVsm3V/VscdZLK+/9N69QW28HVttRclctFhVYb79lW3rf64qir6f8389ap2ppgywMFDRo0aNCgQYMGDTpNaLUPsGfDqijQ+hCnaq7yoKPalbjaUls+b6gq6mxfjZo2z6tD3KvD7yvz9oPagDo0c6bqyMOUCupi1+hwsvrqgl4wXNCR7TTuQZfHjC6DBg0aNGjQoEGDnk701bJMbQNsV6wI6hfkMTS6Ic/FOYkK/bCretyU9ecj6F4dQs1Vjb/6bCIye9+1bKmLvRZF+/4XdKMZ0Schzf8BjV4rhF950/9J/IQeExQ0aNCgQYMGDRr0RKH1zGXLD9apN71e0OOyb0486BXVmerfQig1V/zbjQPtmbl0zUYphJxL0zHiMJt6Qvs/G4PnXMYNGSbQoEGDBg06IYEGnWq00wihVrLQK81QmoDN64bINB0NUdwMIiIiIhpL/wGJY9+ssJDbRQAAAABJRU5ErkJggg==");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.changeProfile(json.toString()), Message.class);

        assertEquals("Success", message.getState());

        Path path = Paths.get("");

        String filePath = path.toAbsolutePath().toString();

        filePath = filePath.substring(0, filePath.indexOf("\\server"));

        File img = new File(filePath + "\\client\\public\\"
                + message.getData().substring(0, message.getData().indexOf("/"))
                + "\\" + message.getData().substring(message.getData().indexOf("/")));

        assertTrue(img.exists());

        message = gson.fromJson(rest.getProfile(1), Message.class);

        Profile profile = gson.fromJson(message.getData(), Profile.class);
        assertEquals("Success", message.getState());
        assertEquals("newCoolIdent", profile.getIdentificator());
        assertEquals("someGoodName", profile.getName());
    }

    @DisplayName("Wrong identificator test")
    @Order(34)
    @Test
    void changeProfileWrongIdent() {
        JsonObject json = new JsonObject();

        json.addProperty("id", 1);
        json.addProperty("identificator", "user123");
        json.addProperty("name", "someGoodName");
        json.addProperty("info", "No info");
        json.addProperty("imagePath", "profilePictures");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.changeProfile(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Идентификатор не может начинаться с 'user'", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Busy identificator test")
    @Order(35)
    @Test
    void changeProfileBusyIdent() {
        JsonObject json = new JsonObject();

        json.addProperty("id", 2);
        json.addProperty("identificator", "newCoolIdent");
        json.addProperty("name", "someGoodName");
        json.addProperty("info", "No info");
        json.addProperty("imagePath", "profilePictures");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.changeProfile(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Данный идентификатор уже занят.", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Change profile wrong image test")
    @Order(36)
    @Test
    void changeProfileWrongImage() {
        JsonObject json = new JsonObject();

        json.addProperty("id", 1);
        json.addProperty("identificator", "newCoolIdent");
        json.addProperty("name", "someGoodName");
        json.addProperty("info", "No info");
        json.addProperty("imagePath", "iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAA+VBMVEX39/f6AAAncyz6ooJiFAwMAAwP/AAD+/P7/pIYjcy1leBfsnnlUdQkAaAze5d6fh0dcdxP6p4b3//9JdiMbbyH6UEF9oX/6knX6blgAZgAUbRuiuqPSAQFddxzQlWiAfzE+dSZSdiBOhVH4z88eAwPD0cP5Z2cydCr38vKTAgLIzbpbcgD42Nj5XFz6HR36Pz/wAQE/fkOyjFSwuZtoAwOqAgL5iYmLAgL4qKj5e3v6QzYtAwOQgz3R29J8AwMAWwBGbwD34ODArJBwfTJdAwP6UFDhAQH4srL6LiX6clsUAwM7AwNPaQBbeS3o7OgvbQpqlmxyj1iAOB7VAAADtUlEQVR4nO3daVPaUBSAYTbFAAlCRCruihsVLW5dsdrNWlu1/f8/pn7jnMzkGjAhJLzvV2ZMHm+YyWG7mQwRERERUdDmdHGfTlRVX6t2VSlVz539ORRdL4uck9SiDwuirVJOtA06PYEGDTpdgQYNOl1NK7o2KL3oL13Z1w1R/9u+bLsqu4z7xF+Qe5SVLdUt0XqtLKo5sqsEr7u750HnB1nrtnyGr6mLvQU6WYEGDRo06CQGGjToaULX0oJ2s4YUOm+p8racucot2VU1bpY59zgwWldRF3tZrbsDevICDRo0aNCgQU9uoFOMdlUaXVQt1VUJRh9kj2XafD6zM2j2ItsblF2sJxntX/F8VnZRlA+mGD0zCDRo0KBBT06gQYMGnUS0GqsyJvT31Nx7d38cyQzo7M2qrKceSxa6bWJ611qmH0ov2hBo0KBBgwYNGjRo0M+k5qquiVI03G0nC91+K/tgMnfeyW6Si3bfm1ZMo2fUBL1qWOsUoXfUayWgQYMGDRo0aNCgQQ8HlU3JvXf7/U+Raa7yoDuyZE1ZbnCmV53ceXp0dPBAgwYNGjRo0KBBgx4KHfz+etLRbVl3z3C2PfUxQNP06On2o2wpfrR7G/TUi6tqZJ4Njv41ad/Ac98MgZYvjuwER0/cdy1BgwYNGjRo0KBBJwotuwsFbZnQrRDRB7KMRvdUHvTdJ9HvkdEV0dNKr4kKJ7JceGjTbyAWP6vV7ChYcdR52vNrkte2rCRrRbVV3DNo+bztjPxKgQkdx++GggYNGjRo0KBBgwY9HrS+jTej/QeO0dGW/35ZhajQVbUVsm3V/VscdZLK+/9N69QW28HVttRclctFhVYb79lW3rf64qir6f8389ap2ppgywMFDRo0aNCgQYMGDTpNaLUPsGfDqijQ+hCnaq7yoKPalbjaUls+b6gq6mxfjZo2z6tD3KvD7yvz9oPagDo0c6bqyMOUCupi1+hwsvrqgl4wXNCR7TTuQZfHjC6DBg0aNGjQoEGDnk701bJMbQNsV6wI6hfkMTS6Ic/FOYkK/bCretyU9ecj6F4dQs1Vjb/6bCIye9+1bKmLvRZF+/4XdKMZ0Schzf8BjV4rhF950/9J/IQeExQ0aNCgQYMGDRr0RKH1zGXLD9apN71e0OOyb0486BXVmerfQig1V/zbjQPtmbl0zUYphJxL0zHiMJt6Qvs/G4PnXMYNGSbQoEGDBg06IYEGnWq00wihVrLQK81QmoDN64bINB0NUdwMIiIiIhpL/wGJY9+ssJDbRQAAAABJRU5ErkJggg==");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.changeProfile(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить изображение", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Free identificator test")
    @Order(37)
    @Test
    void verifyIdentificatorFree() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.verifyIdentificator("somefreeident", 0), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @DisplayName("Busy identificator test")
    @Order(38)
    @Test
    void verifyIdentificatorBusy() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.verifyIdentificator("user2", 0), Message.class);

        assertEquals("Success", message.getState());
        assertFalse(message.getData());
    }

    @DisplayName("Own identificator test")
    @Order(39)
    @Test
    void verifyIdentificatorWithUserId() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.verifyIdentificator("user2", 2), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @DisplayName("Success unfollow")
    @Order(40)
    @Test
    void unfollowUser() {
        JsonObject json = new JsonObject();

        json.addProperty("followerId", 2);
        json.addProperty("userId", 1);

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.unfollowUser(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(0.0, message.getData());
    }

    @DisplayName("Wrong relationships test")
    @Order(41)
    @Test
    void getIsSubscribeWrong() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.getIsSubscribe(2, 1), Message.class);

        assertEquals("Success", message.getState());
        assertFalse(message.getData());
    }

    @DisplayName("Success id by identificator")
    @Order(42)
    @Test
    void getIdByIdentificatorExists() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.getIdByIdentificator("user2"), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(2.0, message.getData());
    }


    @DisplayName("Unsuccess id by identificator")
    @Order(43)
    @Test
    void getIdByIdentificatorNotExist() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.getIdByIdentificator("user3"), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Notifications empty data test")
    @Order(44)
    @Test
    void getNotificationsEmpty() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getNotifications(1, 0), Message.class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }

    @DisplayName("Comment success with tag test")
    @Order(45)
    @Test
    void addCommentWithTag() {
        JsonObject json = new JsonObject();
        JsonObject json2 = new JsonObject();

        json.addProperty("userId", 1);
        json.addProperty("postId", 2);
        json.addProperty("commentText", "someText @user2");

        json2.addProperty("userId", 2);
        json2.addProperty("postId", 2);
        json2.addProperty("commentText", "someText @newCoolIdent");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.addComment(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        message = gson.fromJson(rest.addComment(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        message = gson.fromJson(rest.addComment(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        message = gson.fromJson(rest.addComment(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        message = gson.fromJson(rest.addComment(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        message = gson.fromJson(rest.addComment(json2.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Success add comment test")
    @Order(46)
    @Test
    void addComment() {
        JsonObject json = new JsonObject();

        json.addProperty("userId", 1);
        json.addProperty("postId", 2);
        json.addProperty("commentText", "someText");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }

        Message<Double> message = gson.fromJson(rest.addComment(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Comment with Only userId test")
    @Order(47)
    @Test
    void getComments() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getComments(2, 0), Message.class);

        Comment[] comments = gson.fromJson(message.getData(), Comment[].class);

        assertEquals("Success", message.getState());
        assertTrue(comments[0].getTime().before(comments[1].getTime()));
        assertTrue(comments[1].getTime().before(comments[2].getTime()));
        assertTrue(comments[2].getTime().before(comments[3].getTime()));
        assertTrue(comments[3].getTime().before(comments[4].getTime()));

        assertTrue(Arrays.stream(comments).count() < 6);

        assertEquals(1, comments[0].getAuthorId());
        assertEquals("someText @user2", comments[0].getText());
    }

    @DisplayName("Change comment success test")
    @Order(48)
    @Test
    void changeComment() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.changeComment(4, "someNewText"), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Change comment with tag success test")
    @Order(49)
    @Test
    void changeCommentWithTag() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.changeComment(5, "someNewText @user2"), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Comment with all parameters test")
    @Order(50)
    @Test
    void getCommentsPrevCommentId() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getComments(2, 2), Message.class);

        Comment[] comments = gson.fromJson(message.getData(), Comment[].class);

        assertEquals("Success", message.getState());
        assertTrue(comments[0].getTime().before(comments[1].getTime()));
        assertTrue(comments[2].getTime().before(comments[3].getTime()));
        assertTrue(comments[3].getTime().before(comments[4].getTime()));

        assertTrue(Arrays.stream(comments).count() < 6);

        assertEquals(2, comments[3].getAuthorId());
        assertEquals("someText @newCoolIdent", comments[3].getText());

        assertEquals(1, comments[4].getAuthorId());
        assertEquals("someText", comments[4].getText());

        assertEquals(1, comments[2].getAuthorId());
        assertEquals("someNewText @user2", comments[2].getText());

        assertEquals(1, comments[1].getAuthorId());
        assertEquals("someNewText", comments[1].getText());
    }


    @DisplayName("Empty comments")
    @Order(51)
    @Test
    void getCommentsEmpty() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getComments(1,0), Message.class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }

    @DisplayName("Delete comment test")
    @Order(52)
    @Test
    void deleteComment() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.deleteComment(1), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());

        Message<String> response = gson.fromJson(rest.getComments(2, 0), Message.class);
        Comment[] comments = gson.fromJson(response.getData(), Comment[].class);

        assertEquals("Success", message.getState());
        assertTrue(comments[0].getId() == 2);
    }

    @DisplayName("Notifications only userId test")
    @Order(53)
    @Test
    void getNotifications() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getNotifications(2, 0), Message.class);

        Notification[] notifications = gson.fromJson(message.getData(), Notification[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(notifications).count() < 6);
        assertEquals(2, notifications[0].getUserId());
        assertEquals(2, notifications[1].getUserId());
        assertEquals(2, notifications[2].getUserId());
        assertEquals(2, notifications[3].getUserId());
        assertEquals(2, notifications[4].getUserId());

        assertEquals(2, notifications[0].getPostId());
        assertEquals(2, notifications[1].getPostId());
        assertEquals(2, notifications[2].getPostId());
        assertEquals(2, notifications[3].getPostId());
        assertEquals(2, notifications[4].getPostId());

        assertTrue(notifications[0].getId() < notifications[1].getId());
        assertTrue(notifications[1].getId() < notifications[2].getId());
        assertTrue(notifications[2].getId() < notifications[3].getId());
        assertTrue(notifications[3].getId() < notifications[4].getId());
    }

    @DisplayName("Notifications all parameters test")
    @Order(54)
    @Test
    void getNotificationsAllParams() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getNotifications(2, 1), Message.class);

        Notification[] notifications = gson.fromJson(message.getData(), Notification[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(notifications).count() < 6);
        assertEquals(2, notifications[0].getUserId());
        assertEquals(2, notifications[1].getUserId());
        assertEquals(2, notifications[2].getUserId());
        assertEquals(2, notifications[3].getUserId());
        assertEquals(2, notifications[4].getUserId());
        assertTrue(notifications[0].getId() > 1);
        assertTrue(notifications[0].getId() < notifications[1].getId());
        assertTrue(notifications[1].getId() < notifications[2].getId());
        assertTrue(notifications[2].getId() < notifications[3].getId());
        assertTrue(notifications[3].getId() < notifications[4].getId());
    }

    @DisplayName("Delete notification success test")
    @Order(55)
    @Test
    void deleteNotification() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.deleteNotification(1), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Get notifications test")
    @Order(56)
    @Test
    void getNotificationsCount() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.getNotificationsCount(2), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(5.0, message.getData());
    }

    @DisplayName("Delete all notifications test")
    @Order(57)
    @Test
    void deleteAllNotification() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.deleteAllNotification(2), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());

        message = gson.fromJson(rest.getNotificationsCount(2), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(0.0, message.getData());
    }

    Dotenv dotenv = Dotenv.configure().filename(".testEnv").load();
    RestapiController invalidRest = new RestapiController(dotenv);

    @DisplayName("SQL error test")
    @Order(58)
    @Test
    void changeProfileError() {
        JsonObject json = new JsonObject();

        json.addProperty("id", 1);
        json.addProperty("identificator", "newCoolIdent");
        json.addProperty("name", "someGoodName");
        json.addProperty("info", "No info");
        json.addProperty("imagePath", "iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAA+VBMVEX39/f6AAAncyz6ooJieBkFAwMAAwP/AAD+/P7/pIYjcy1leBfsnnlUdQkAaAze5d6fh0dcdxP6p4b3//9JdiMbbyH6UEF9oX/6knX6blgAZgAUbRuiuqPSAQFddxzQlWiAfzE+dSZSdiBOhVH4z88eAwPD0cP5Z2cydCr38vKTAgLIzbpbcgD42Nj5XFz6HR36Pz/wAQE/fkOyjFSwuZtoAwOqAgL5iYmLAgL4qKj5e3v6QzYtAwOQgz3R29J8AwMAWwBGbwD34ODArJBwfTJdAwP6UFDhAQH4srL6LiX6clsUAwM7AwNPaQBbeS3o7OgvbQpqlmxyj1iAOB7VAAADtUlEQVR4nO3daVPaUBSAYTbFAAlCRCruihsVLW5dsdrNWlu1/f8/pn7jnMzkGjAhJLzvV2ZMHm+YyWG7mQwRERERUdDmdHGfTlRVX6t2VSlVz539ORRdL4uck9SiDwuirVJOtA06PYEGDTpdgQYNOl1NK7o2KL3oL13Z1w1R/9u+bLsqu4z7xF+Qe5SVLdUt0XqtLKo5sqsEr7u750HnB1nrtnyGr6mLvQU6WYEGDRo06CQGGjToaULX0oJ2s4YUOm+p8racucot2VU1bpY59zgwWldRF3tZrbsDevICDRo0aNCgQU9uoFOMdlUaXVQt1VUJRh9kj2XafD6zM2j2ItsblF2sJxntX/F8VnZRlA+mGD0zCDRo0KBBT06gQYMGnUS0GqsyJvT31Nx7d38cyQzo7M2qrKceSxa6bWJ611qmH0ov2hBo0KBBgwYNGjRo0M+k5qquiVI03G0nC91+K/tgMnfeyW6Si3bfm1ZMo2fUBL1qWOsUoXfUayWgQYMGDRo0aNCgQQ8HlU3JvXf7/U+Raa7yoDuyZE1ZbnCmV53ceXp0dPBAgwYNGjRo0KBBgx4KHfz+etLRbVl3z3C2PfUxQNP06On2o2wpfrR7G/TUi6tqZJ4Njv41ad/Ac98MgZYvjuwER0/cdy1BgwYNGjRo0KBBJwotuwsFbZnQrRDRB7KMRvdUHvTdJ9HvkdEV0dNKr4kKJ7JceGjTbyAWP6vV7ChYcdR52vNrkte2rCRrRbVV3DNo+bztjPxKgQkdx++GggYNGjRo0KBBgwY9HrS+jTej/QeO0dGW/35ZhajQVbUVsm3V/VscdZLK+/9N69QW28HVttRclctFhVYb79lW3rf64qir6f8389ap2ppgywMFDRo0aNCgQYMGDTpNaLUPsGfDqijQ+hCnaq7yoKPalbjaUls+b6gq6mxfjZo2z6tD3KvD7yvz9oPagDo0c6bqyMOUCupi1+hwsvrqgl4wXNCR7TTuQZfHjC6DBg0aNGjQoEGDnk701bJMbQNsV6wI6hfkMTS6Ic/FOYkK/bCretyU9ecj6F4dQs1Vjb/6bCIye9+1bKmLvRZF+/4XdKMZ0Schzf8BjV4rhF950/9J/IQeExQ0aNCgQYMGDRr0RKH1zGXLD9apN71e0OOyb0486BXVmerfQig1V/zbjQPtmbl0zUYphJxL0zHiMJt6Qvs/G4PnXMYNGSbQoEGDBg06IYEGnWq00wihVrLQK81QmoDN64bINB0NUdwMIiIiIhpL/wGJY9+ssJDbRQAAAABJRU5ErkJggg==");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.changeProfile(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось изменить информацию профиля", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(59)
    @Test
    void getProfileError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.getProfile(1), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить профиль пользователя", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(60)
    @Test
    void getUserPostsError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.getUserPosts(2, 0), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить посты пользователя", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(61)
    @Test
    void followUserError() {
        JsonObject json = new JsonObject();

        json.addProperty("followerId", 2);
        json.addProperty("userId", 1);

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.followUser(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось подписаться на пользователя", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(62)
    @Test
    void getIsSubscribeError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(invalidRest.getIsSubscribe(2, 1), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось проверить подписку на пользователя", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(63)
    @Test
    void unfollowUserError() {
        JsonObject json = new JsonObject();

        json.addProperty("followerId", 2);
        json.addProperty("userId", 1);

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.unfollowUser(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось отписаться от пользователя", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(64)
    @Test
    void verifyIdentificatorError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.verifyIdentificator("somefreeident", 0), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось проверить доступность идентификатора", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(65)
    @Test
    void getNotificationsError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.getNotifications(1, 0), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить уведомления", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(66)
    @Test
    void addCommentError() {
        JsonObject json = new JsonObject();

        json.addProperty("userId", 1);
        json.addProperty("postId", 2);
        json.addProperty("commentText", "someText");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.addComment(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось добавить комментарий", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(67)
    @Test
    void changeCommentError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.changeComment(1, "someNewText"), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось изменить комментарий", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(68)
    @Test
    void deleteCommentError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.deleteComment(1), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось удалить комментарий", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(69)
    @Test
    void deleteNotificationError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.deleteNotification(1), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось удалить уведомление", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(70)
    @Test
    void getNotificationsCountError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.getNotificationsCount(2), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось получить количество уведомлений", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(71)
    @Test
    void deleteAllNotificationError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.deleteAllNotification(2), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось удалить все уведомления", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(72)
    @Test
    void regUserUnsuccessError(){
        JsonObject json = new JsonObject();

        json.addProperty("name", "testUser");
        json.addProperty("login", "testUser");
        json.addProperty("pass", "testPassword");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.regUser(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось зарегистрировать пользователя", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(73)
    @Test
    void verifyLoginError(){
        JsonObject json = new JsonObject();

        json.addProperty("login", "freefree");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.verifyLogin(json.toString()), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось проверить доступность логина", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(74)
    @Test
    void loginUnsuccessError(){
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.loginUser("wrongUser", "password"), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось выполнить вход", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(75)
    @Test
    void getFeedWithError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.getPosts(1, 6,2), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить посты новостной ленты", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("SQL error test")
    @Order(76)
    @Test
    void getPostUnSuccess() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(invalidRest.getPost(3, 29), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить пост", message.getMessage());
    }

    @DisplayName("SQL error test")
    @Order(77)
    @Test
    void getSubFeedWithError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(invalidRest.getPosts(1, 6,2), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить посты новостной ленты", message.getMessage());
    }

    @DisplayName("SQL error test")
    @Order(78)
    @Test
    void getIdByIdentificatorError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.getIdByIdentificator("user3"), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось проверить идентификатор", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Main class test")
    @Order(79)
    @Test
    public void main(){
        RestapiApplication.main(new String[]{});
    }

    @DisplayName("CommentData class test")
    @Order(80)
    @Test
    public void commentDataTest(){
        CommentData commentData = new CommentData(1,1,"text");
        assertEquals(1, commentData.getUserId());
        assertEquals(1, commentData.getPostId());
        assertEquals("text", commentData.getCommentText());
    }

    @DisplayName("profileData class test")
    @Order(81)
    @Test
    public void profileDataTest(){
        ProfileData profileData = new ProfileData(1, "testUser", "testName", "info","");
        assertEquals(1, profileData.getId());
        assertEquals("testUser", profileData.getIdentificator());
        assertEquals("testName", profileData.getName());
        assertEquals("info", profileData.getInfo());
        assertEquals("", profileData.getImagePath());
    }

    @DisplayName("relationshipsData class test")
    @Order(82)
    @Test
    public void relationshipsDataTest(){
        RelationshipsData relationshipsData = new RelationshipsData(1,2);
        assertEquals(1, relationshipsData.getFollowerId());
        assertEquals(2, relationshipsData.getUserId());
    }

    @DisplayName("userData class test")
    @Order(83)
    @Test
    public void userDataTest(){
        UserData userData = new UserData("testName","testLogin", "testPass");
        assertEquals("testName", userData.getName());
        assertEquals("testLogin", userData.getLogin());
        assertEquals("testPass", userData.getPass());
    }
}