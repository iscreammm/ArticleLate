package com.articlelate.restapi;

import com.articlelate.restapi.utils.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.*;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class RestapiControllerTest {

    RestapiController rest = new RestapiController();

    @DisplayName("Success change")
    @Order(1)
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
    }

    @DisplayName("Success test")
    @Order(2)
    @Test
    void getProfile() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getProfile(1), Message.class);

        Profile profile = gson.fromJson(message.getData(), Profile.class);

        assertEquals("Success", message.getState());
        assertEquals("newCoolIdent", profile.getIdentificator());
        assertEquals("someGoodName", profile.getName());
        assertEquals(0, profile.getFollows());
        assertEquals(1, profile.getFollowers());
    }

    @DisplayName("Wrong identificator test")
    @Order(3)
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
    @Order(4)
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

    @DisplayName("Wrong image test")
    @Order(5)
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

    @DisplayName("Empty data test")
    @Order(6)
    @Test
    void getEmptyUserPosts() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getUserPosts(2, 0), Message.class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }

    @DisplayName("Only userId test")
    @Order(7)
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

    @DisplayName("All parameters test")
    @Order(8)
    @Test
    void getUserPostsWithAll() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getUserPosts(1, 6), Message.class);

        Post[] posts = gson.fromJson(message.getData(), Post[].class);

        assertEquals("Success", message.getState());
        assertTrue(Arrays.stream(posts).count() < 4);
        assertEquals(1, posts[0].getAuthorId());
        assertEquals(1, posts[1].getAuthorId());
        assertEquals(1, posts[2].getAuthorId());

        message = gson.fromJson(rest.getPost(1, 6), Message.class);
        Post prevPost = gson.fromJson(message.getData(), Post.class);

        assertTrue(posts[0].getTime().before(prevPost.getTime()));
        assertTrue(posts[0].getTime().after(posts[1].getTime()));
        assertTrue(posts[1].getTime().after(posts[2].getTime()));
    }

    @DisplayName("Success follow")
    @Order(9)
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
    @Order(10)
    @Test
    void getIsSubscribeRight() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.getIsSubscribe(2, 1), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @DisplayName("Success unfollow")
    @Order(11)
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
    @Order(12)
    @Test
    void getIsSubscribeWrong() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.getIsSubscribe(2, 1), Message.class);

        assertEquals("Success", message.getState());
        assertFalse(message.getData());
    }

    @DisplayName("Free identificator test")
    @Order(13)
    @Test
    void verifyIdentificatorFree() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.verifyIdentificator("somefreeident", 0), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @DisplayName("Busy identificator test")
    @Order(14)
    @Test
    void verifyIdentificatorBusy() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.verifyIdentificator("user2", 0), Message.class);

        assertEquals("Success", message.getState());
        assertFalse(message.getData());
    }

    @DisplayName("His identificator test")
    @Order(15)
    @Test
    void verifyIdentificatorWithUserId() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Boolean> message = gson.fromJson(rest.verifyIdentificator("user2", 2), Message.class);

        assertEquals("Success", message.getState());
        assertTrue(message.getData());
    }

    @DisplayName("Empty data test")
    @Order(16)
    @Test
    void getNotificationsEmpty() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<String> message = gson.fromJson(rest.getNotifications(1, 0), Message.class);

        assertEquals("Success", message.getState());
        assertEquals("[]", message.getData());
    }

    @DisplayName("Success test")
    @Order(17)
    @Test
    void addComment() {
        JsonObject json = new JsonObject();

        json.addProperty("userId", 1);
        json.addProperty("postId", 2);
        json.addProperty("commentText", "someText");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.addComment(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Success with tag test")
    @Order(18)
    @Test
    void addCommentWithTag() {
        JsonObject json = new JsonObject();

        json.addProperty("userId", 1);
        json.addProperty("postId", 2);
        json.addProperty("commentText", "someText @user2");

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.addComment(json.toString()), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Success test")
    @Order(19)
    @Test
    void changeComment() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.changeComment(1, "someNewText"), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Success with tag test")
    @Order(20)
    @Test
    void changeCommentWithTag() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.changeComment(1, "someNewText @user2"), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Success test")
    @Order(21)
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

    @DisplayName("Only userId test")
    @Order(22)
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
        assertTrue(notifications[0].getId() < notifications[1].getId());
        assertTrue(notifications[1].getId() < notifications[2].getId());
        assertTrue(notifications[2].getId() < notifications[3].getId());
        assertTrue(notifications[3].getId() < notifications[4].getId());
    }

    @DisplayName("All parameters test")
    @Order(23)
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

    @DisplayName("Success test")
    @Order(24)
    @Test
    void deleteNotification() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.deleteNotification(1), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(1.0, message.getData());
    }

    @DisplayName("Success test")
    @Order(25)
    @Test
    void getNotificationsCount() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(rest.getNotificationsCount(2), Message.class);

        assertEquals("Success", message.getState());
        assertEquals(5.0, message.getData());
    }

    @DisplayName("Success test")
    @Order(26)
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
    @Order(27)
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
    @Order(28)
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
    @Order(29)
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
    @Order(30)
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
    @Order(31)
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
    @Order(32)
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
    @Order(33)
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
    @Order(34)
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
    @Order(35)
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
    @Order(36)
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
    @Order(37)
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
    @Order(38)
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
    @Order(39)
    @Test
    void getNotificationsCountError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.getNotificationsCount(2), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось получить количество уведомлений", message.getMessage());
        assertEquals(-1.0, message.getData());
    }

    @DisplayName("Success test")
    @Order(40)
    @Test
    void deleteAllNotificationError() {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        Message<Double> message = gson.fromJson(invalidRest.deleteAllNotification(2), Message.class);

        assertEquals("Error", message.getState());
        assertEquals("Не удалось удалить все уведомления", message.getMessage());
        assertEquals(-1.0, message.getData());
    }
}