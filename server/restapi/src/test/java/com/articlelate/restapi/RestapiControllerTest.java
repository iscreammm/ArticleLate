package com.articlelate.restapi;

import com.articlelate.restapi.utils.Message;
import com.articlelate.restapi.utils.Post;
import com.articlelate.restapi.utils.Profile;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.*;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class RestapiControllerTest {

    RestapiController rest = new RestapiController();

    @DisplayName("Success test")
    @Order(1)
    @Test
    void getProfile() {
        Response response = RestAssured
                .get("/getProfile?userId=1")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(response.getBody().asString(), Message.class);

        Profile profile = gson.fromJson(message.getData(), Profile.class);

        assertEquals("Success", message.getState());
        assertEquals("newCoolIdent", profile.getIdentificator());
    }

    @DisplayName("Empty data test")
    @Order(2)
    @Test
    void getEmptyUserPosts() {
        Response response = RestAssured
                .get("/getUserPosts?userId=2")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }

    @DisplayName("Only userId test")
    @Order(3)
    @Test
    void getUserPostsWithUserId() {
        Response response = RestAssured
                .get("/getUserPosts?userId=1")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(response.getBody().asString(), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertEquals(1, posts[0].getAuthorId());
        assertTrue(posts[0].getTime().after(posts[1].getTime()));
        assertTrue(Arrays.stream(posts).count() < 4);
    }

    @DisplayName("All parameters test")
    @Order(4)
    @Test
    void getUserPostsWithAll() {
        Response response = RestAssured
                .get("/getUserPosts?userId=1&prevPostId=6")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(response.getBody().asString(), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertEquals(1, posts[0].getAuthorId());
        assertTrue(posts[0].getTime().before(Timestamp.valueOf("2023-02-19 18:08:24.358")));
        assertTrue(posts[0].getTime().after(posts[1].getTime()));
        assertTrue(Arrays.stream(posts).count() < 4);
    }

    @DisplayName("Right relationships test")
    @Order(5)
    @Test
    void getIsSubscribeRight() {
        Response response = RestAssured
                .get("/getIsSubscribe?followerId=1&userId=2")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @DisplayName("Wrong relationships test")
    @Order(6)
    @Test
    void getIsSubscribeWrong() {
        Response response = RestAssured
                .get("/getIsSubscribe?followerId=2&userId=1")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Success", message.getState());
        assertFalse(message.getData());
    }

    //???
    @DisplayName("Success follow")
    @Order(7)
    @Test
    void followUser() {
        RestAssured.baseURI = "http://localhost:8080";
        RequestSpecification request = RestAssured.given();

        JsonObject json = new JsonObject();

        json.addProperty("followerId", 2);
        json.addProperty("userId", 1);

        request.header("Content-Type", "text/plain");
        request.body(json.toString());

        Response response = request.post("/followUser")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    //???
    @DisplayName("Success unfollow")
    @Order(8)
    @Test
    void unfollowUser() {
        RestAssured.baseURI = "http://localhost:8080";
        RequestSpecification request = RestAssured.given();

        JsonObject json = new JsonObject();

        json.addProperty("followerId", 2);
        json.addProperty("userId", 1);

        request.header("Content-Type", "text/plain");
        request.body(json.toString());

        Response response = request.delete("/unfollowUser")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(0.0, message.getData());
    }

    @DisplayName("Success change")
    @Order(9)
    @Test
    void changeProfile() {
        RestAssured.baseURI = "http://localhost:8080";
        RequestSpecification request = RestAssured.given();

        JsonObject json = new JsonObject();

        json.addProperty("id", 1);
        json.addProperty("identificator", "newCoolIdent");
        json.addProperty("name", "someGoodName");
        json.addProperty("info", "No info");
        json.addProperty("imagePath", "iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAA+VBMVEX39/f6AAAncyz6ooJieBkFAwMAAwP/AAD+/P7/pIYjcy1leBfsnnlUdQkAaAze5d6fh0dcdxP6p4b3//9JdiMbbyH6UEF9oX/6knX6blgAZgAUbRuiuqPSAQFddxzQlWiAfzE+dSZSdiBOhVH4z88eAwPD0cP5Z2cydCr38vKTAgLIzbpbcgD42Nj5XFz6HR36Pz/wAQE/fkOyjFSwuZtoAwOqAgL5iYmLAgL4qKj5e3v6QzYtAwOQgz3R29J8AwMAWwBGbwD34ODArJBwfTJdAwP6UFDhAQH4srL6LiX6clsUAwM7AwNPaQBbeS3o7OgvbQpqlmxyj1iAOB7VAAADtUlEQVR4nO3daVPaUBSAYTbFAAlCRCruihsVLW5dsdrNWlu1/f8/pn7jnMzkGjAhJLzvV2ZMHm+YyWG7mQwRERERUdDmdHGfTlRVX6t2VSlVz539ORRdL4uck9SiDwuirVJOtA06PYEGDTpdgQYNOl1NK7o2KL3oL13Z1w1R/9u+bLsqu4z7xF+Qe5SVLdUt0XqtLKo5sqsEr7u750HnB1nrtnyGr6mLvQU6WYEGDRo06CQGGjToaULX0oJ2s4YUOm+p8racucot2VU1bpY59zgwWldRF3tZrbsDevICDRo0aNCgQU9uoFOMdlUaXVQt1VUJRh9kj2XafD6zM2j2ItsblF2sJxntX/F8VnZRlA+mGD0zCDRo0KBBT06gQYMGnUS0GqsyJvT31Nx7d38cyQzo7M2qrKceSxa6bWJ611qmH0ov2hBo0KBBgwYNGjRo0M+k5qquiVI03G0nC91+K/tgMnfeyW6Si3bfm1ZMo2fUBL1qWOsUoXfUayWgQYMGDRo0aNCgQQ8HlU3JvXf7/U+Raa7yoDuyZE1ZbnCmV53ceXp0dPBAgwYNGjRo0KBBgx4KHfz+etLRbVl3z3C2PfUxQNP06On2o2wpfrR7G/TUi6tqZJ4Njv41ad/Ac98MgZYvjuwER0/cdy1BgwYNGjRo0KBBJwotuwsFbZnQrRDRB7KMRvdUHvTdJ9HvkdEV0dNKr4kKJ7JceGjTbyAWP6vV7ChYcdR52vNrkte2rCRrRbVV3DNo+bztjPxKgQkdx++GggYNGjRo0KBBgwY9HrS+jTej/QeO0dGW/35ZhajQVbUVsm3V/VscdZLK+/9N69QW28HVttRclctFhVYb79lW3rf64qir6f8389ap2ppgywMFDRo0aNCgQYMGDTpNaLUPsGfDqijQ+hCnaq7yoKPalbjaUls+b6gq6mxfjZo2z6tD3KvD7yvz9oPagDo0c6bqyMOUCupi1+hwsvrqgl4wXNCR7TTuQZfHjC6DBg0aNGjQoEGDnk701bJMbQNsV6wI6hfkMTS6Ic/FOYkK/bCretyU9ecj6F4dQs1Vjb/6bCIye9+1bKmLvRZF+/4XdKMZ0Schzf8BjV4rhF950/9J/IQeExQ0aNCgQYMGDRr0RKH1zGXLD9apN71e0OOyb0486BXVmerfQig1V/zbjQPtmbl0zUYphJxL0zHiMJt6Qvs/G4PnXMYNGSbQoEGDBg06IYEGnWq00wihVrLQK81QmoDN64bINB0NUdwMIiIiIhpL/wGJY9+ssJDbRQAAAABJRU5ErkJggg==");
        request.header("Content-Type", "text/plain");
        request.body(json.toString());

        Response response = request.put("/changeProfile")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Success", message.getState());

        Path path = Paths.get("");

        String filePath = path.toAbsolutePath().toString();

        filePath = filePath.substring(0, filePath.indexOf("\\server"));

        File img = new File(filePath + "\\client\\public\\"
                + message.getData().substring(0, message.getData().indexOf("/"))
                + "\\" + message.getData().substring(message.getData().indexOf("/")));

        assertTrue(img.exists());
    }

    @DisplayName("Wrong identificator test")
    @Order(10)
    @Test
    void changeProfileWrongIdent() {
        RestAssured.baseURI = "http://localhost:8080";
        RequestSpecification request = RestAssured.given();

        JsonObject json = new JsonObject();

        json.addProperty("id", 1);
        json.addProperty("identificator", "user123");
        json.addProperty("name", "someGoodName");
        json.addProperty("info", "No info");
        json.addProperty("imagePath", "profilePictures");
        request.header("Content-Type", "text/plain");
        request.body(json.toString());

        Response response = request.put("/changeProfile")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Идентификатор не может начинаться с 'user'", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Busy identificator test")
    @Order(11)
    @Test
    void changeProfileBusyIdent() {

        Path path = Paths.get("");

        RestAssured.baseURI = "http://localhost:8080";
        RequestSpecification request = RestAssured.given();

        JsonObject json = new JsonObject();

        json.addProperty("id", 2);
        json.addProperty("identificator", "newCoolIdent");
        json.addProperty("name", "someGoodName");
        json.addProperty("info", "No info");
        json.addProperty("imagePath", "profilePictures");
        request.header("Content-Type", "text/plain");
        request.body(json.toString());

        Response response = request.put("/changeProfile")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Данный идентификатор уже занят.", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Wrong image test")
    @Order(12)
    @Test
    void changeProfileWrongImage() {
        RestAssured.baseURI = "http://localhost:8080";
        RequestSpecification request = RestAssured.given();

        JsonObject json = new JsonObject();

        json.addProperty("id", 1);
        json.addProperty("identificator", "newCoolIdent");
        json.addProperty("name", "someGoodName");
        json.addProperty("info", "No info");
        json.addProperty("imagePath", "iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAA+VBMVEX39/f6AAAncyz6ooJiFAwMAAwP/AAD+/P7/pIYjcy1leBfsnnlUdQkAaAze5d6fh0dcdxP6p4b3//9JdiMbbyH6UEF9oX/6knX6blgAZgAUbRuiuqPSAQFddxzQlWiAfzE+dSZSdiBOhVH4z88eAwPD0cP5Z2cydCr38vKTAgLIzbpbcgD42Nj5XFz6HR36Pz/wAQE/fkOyjFSwuZtoAwOqAgL5iYmLAgL4qKj5e3v6QzYtAwOQgz3R29J8AwMAWwBGbwD34ODArJBwfTJdAwP6UFDhAQH4srL6LiX6clsUAwM7AwNPaQBbeS3o7OgvbQpqlmxyj1iAOB7VAAADtUlEQVR4nO3daVPaUBSAYTbFAAlCRCruihsVLW5dsdrNWlu1/f8/pn7jnMzkGjAhJLzvV2ZMHm+YyWG7mQwRERERUdDmdHGfTlRVX6t2VSlVz539ORRdL4uck9SiDwuirVJOtA06PYEGDTpdgQYNOl1NK7o2KL3oL13Z1w1R/9u+bLsqu4z7xF+Qe5SVLdUt0XqtLKo5sqsEr7u750HnB1nrtnyGr6mLvQU6WYEGDRo06CQGGjToaULX0oJ2s4YUOm+p8racucot2VU1bpY59zgwWldRF3tZrbsDevICDRo0aNCgQU9uoFOMdlUaXVQt1VUJRh9kj2XafD6zM2j2ItsblF2sJxntX/F8VnZRlA+mGD0zCDRo0KBBT06gQYMGnUS0GqsyJvT31Nx7d38cyQzo7M2qrKceSxa6bWJ611qmH0ov2hBo0KBBgwYNGjRo0M+k5qquiVI03G0nC91+K/tgMnfeyW6Si3bfm1ZMo2fUBL1qWOsUoXfUayWgQYMGDRo0aNCgQQ8HlU3JvXf7/U+Raa7yoDuyZE1ZbnCmV53ceXp0dPBAgwYNGjRo0KBBgx4KHfz+etLRbVl3z3C2PfUxQNP06On2o2wpfrR7G/TUi6tqZJ4Njv41ad/Ac98MgZYvjuwER0/cdy1BgwYNGjRo0KBBJwotuwsFbZnQrRDRB7KMRvdUHvTdJ9HvkdEV0dNKr4kKJ7JceGjTbyAWP6vV7ChYcdR52vNrkte2rCRrRbVV3DNo+bztjPxKgQkdx++GggYNGjRo0KBBgwY9HrS+jTej/QeO0dGW/35ZhajQVbUVsm3V/VscdZLK+/9N69QW28HVttRclctFhVYb79lW3rf64qir6f8389ap2ppgywMFDRo0aNCgQYMGDTpNaLUPsGfDqijQ+hCnaq7yoKPalbjaUls+b6gq6mxfjZo2z6tD3KvD7yvz9oPagDo0c6bqyMOUCupi1+hwsvrqgl4wXNCR7TTuQZfHjC6DBg0aNGjQoEGDnk701bJMbQNsV6wI6hfkMTS6Ic/FOYkK/bCretyU9ecj6F4dQs1Vjb/6bCIye9+1bKmLvRZF+/4XdKMZ0Schzf8BjV4rhF950/9J/IQeExQ0aNCgQYMGDRr0RKH1zGXLD9apN71e0OOyb0486BXVmerfQig1V/zbjQPtmbl0zUYphJxL0zHiMJt6Qvs/G4PnXMYNGSbQoEGDBg06IYEGnWq00wihVrLQK81QmoDN64bINB0NUdwMIiIiIhpL/wGJY9+ssJDbRQAAAABJRU5ErkJggg==");
        request.header("Content-Type", "text/plain");
        request.body(json.toString());

        Response response = request.put("/changeProfile")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось загрузить изображение", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Free identificator test")
    @Order(13)
    @Test
    void verifyIdentificatorFree() {
        Response response = RestAssured
                .get("/verifyIdentificator?identificator=somefreeident")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @DisplayName("Busy identificator test")
    @Order(14)
    @Test
    void verifyIdentificatorBusy() {
        Response response = RestAssured
                .get("/verifyIdentificator?identificator=user2")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Success", message.getState());
        assertFalse(message.getData());
    }

    @DisplayName("His identificator test")
    @Order(14)
    @Test
    void verifyIdentificatorWithUserId() {
        Response response = RestAssured
                .get("/verifyIdentificator?identificator=user2&userId=2")
                .thenReturn();

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(response.getBody().asString(), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @Order(8)
    @Test
    void addComment() {
    }

    @Order(9)
    @Test
    void changeComment() {
    }

    @Order(10)
    @Test
    void deleteComment() {
    }

    @Order(11)
    @Test
    void getNotifications() {
    }

    @Order(12)
    @Test
    void getNotificationsCount() {
    }

    @Order(13)
    @Test
    void deleteNotification() {
    }

    @Order(14)
    @Test
    void deleteAllNotification() {
    }
}