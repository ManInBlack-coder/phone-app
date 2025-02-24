package com.example.api;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestDatabaseConnection {

    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/phone_app?useSSL=false&serverTimezone=UTC";
        String user = "javauser";
        String password = "password123";

        try (Connection connection = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connection successful!");
        } catch (SQLException e) {
            System.err.println("Connection failed: " + e.getMessage());
        }
    }
}
