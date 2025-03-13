package com.example.demo.controllers;

import com.example.demo.models.Kuulutus;
import com.example.demo.models.User;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:19006", "http://10.15.16.201:19006"}, 
             allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test endpoint working");
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        System.out.println("Fetching all users");
        List<User> users = userService.findAllUsers();
        System.out.println("Found " + users.size() + " users");
        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getUserProfile(@PathVariable String email) {
        System.out.println("Fetching profile for email: " + email);
        User user = userService.findByEmail(email);
        if (user != null) {
            System.out.println("Found user: " + user.getNimi());
            return ResponseEntity.ok(user);
        }
        System.out.println("User not found for email: " + email);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/listings/{userEmail}")
    public ResponseEntity<List<Kuulutus>> getUserListings(@PathVariable String userEmail) {
        System.out.println("Fetching listings for email: " + userEmail);
        List<Kuulutus> listings = userService.findKuulutusByUserEmail(userEmail);
        if (listings != null && !listings.isEmpty()) {
            return ResponseEntity.ok(listings);
        }
        System.out.println("No listings found for email: " + userEmail);
        return ResponseEntity.notFound().build();
    }
} 