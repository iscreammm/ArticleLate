package com.articlelate.restapi;

import com.articlelate.restapi.utils.AuthData;
import com.articlelate.restapi.utils.DataBase;
import com.articlelate.restapi.utils.Message;
import com.articlelate.restapi.utils.UserData;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@RestController
public class RestapiController {

    private static final String DB_URL = "jdbc:postgresql://localhost:5432/articlelate";
    private static final String USER = "postgres";
    private static final String PASS = "qwerty";

    @GetMapping("/verifyLogin")
    public String verifyLogin(@RequestParam String login) {
        String data = "-1";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        try {
            DataBase db = new DataBase(DB_URL, USER, PASS);

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "SELECT * FROM auth_data WHERE login = \'" + login + "\'";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            if (rs.next()) {
                data = "false";
            } else {
                data = "true";
            }
        } catch (SQLException e) {
            return gson.toJson(new Message("Error", "Не удалось проверить доступность логина", data));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message("Success", "", data));
    }

    @PostMapping("/regUser")
    public String regUser(@RequestBody String dataJson) {
        String data = "-1";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        UserData user = gson.fromJson(dataJson, UserData.class);

        try {
            DataBase db = new DataBase(DB_URL, USER, PASS);

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "SELECT * FROM auth_data WHERE login = \'" + user.getLogin() + "\'";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            if (rs.next()) {
                return gson.toJson(new Message("Error", "Логин занят", data));
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

            Integer userId = 0;

            sql = "SELECT id FROM user_info WHERE loginid = " + loginId;

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            rs = statement.executeQuery(sql);

            while (rs.next()) {
                userId = rs.getInt("id");
            }

            data = userId.toString();
        } catch (SQLException e) {
            return gson.toJson(new Message("Error", "Не удалось зарегистрировать пользователя", data));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message("Success", "", data));
    }

    @GetMapping("/loginUser")
    public String loginUser(@RequestBody String dataJson) {
        String data = "-1";

        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        AuthData auth = gson.fromJson(dataJson, AuthData.class);

        try {
            DataBase db = new DataBase(DB_URL, USER, PASS);

            Connection dbConnection = null;
            Statement statement = null;

            String sql = "SELECT * FROM auth_data WHERE login = \'" + auth.getLogin() + "\'";

            dbConnection = db.getDBConnection();
            statement = dbConnection.createStatement();

            ResultSet rs = statement.executeQuery(sql);

            if (!rs.next()) {
                return gson.toJson(new Message("Error", "Неверный логин", data));
            }

            Integer userId = 0;

            sql = "SELECT user_info.id FROM user_info"
                    + " JOIN auth_data ON user_info.loginid = auth_data.id"
                    + " WHERE auth_data.login = \'" + auth.getLogin() + "\'"
                    + " AND auth_data.pass = \'" + auth.getPass() + "\'";

            dbConnection = db.getDBConnection();

            statement = dbConnection.createStatement();

            rs = statement.executeQuery(sql);

            if (!rs.next()) {
                return gson.toJson(new Message("Error", "Неверный пароль", data));
            }

            userId = rs.getInt("id");
            data = userId.toString();
        } catch (SQLException e) {
            return gson.toJson(new Message("Error", "Не удалось выполнить вход", data));
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC Driver is not found");
            e.printStackTrace();
        }

        return gson.toJson(new Message("Success", "", data));
    }
}
