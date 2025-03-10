package com.example.demo.controllers;

import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.demo.models.User;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");

            userService.registerUser(username, email, password);
            response.put("success", true);
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = request.get("email");
            String password = request.get("password");

            userService.authenticateUser(email, password);
            response.put("success", true);
            response.put("message", "Sign in successful");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User user = userService.findByEmail(userEmail);
        
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}