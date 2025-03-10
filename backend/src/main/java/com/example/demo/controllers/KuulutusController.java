package com.example.demo.controllers;

import com.example.demo.models.Kuulutus;
import com.example.demo.models.User;
import com.example.demo.Repository.KuulutusRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.services.SupabaseStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = {"http://localhost:19006", "http://10.15.16.201:19006"})
public class KuulutusController {

    @Autowired
    private KuulutusRepository kuulutusRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SupabaseStorageService supabaseStorageService;

    @Value("${upload.path:/uploads}")
    private String uploadPath;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createKuulutus(
            @RequestParam("title") String title,
            @RequestParam("price") BigDecimal price,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("user_id") Integer userId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            Kuulutus kuulutus = new Kuulutus();
            kuulutus.setTitle(title);
            kuulutus.setPrice(price);
            kuulutus.setCategory(category);
            kuulutus.setDescription(description);
            kuulutus.setUser(user);

            // Handle image upload to Supabase
            if (image != null) {
                String imageUrl = supabaseStorageService.uploadFile(image);
                kuulutus.setImageUrl(imageUrl);
            }

            Kuulutus savedKuulutus = kuulutusRepository.save(kuulutus);
            
            response.put("success", true);
            response.put("message", "Listing created successfully");
            response.put("kuulutus", savedKuulutus);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<List<Kuulutus>> getAllKuulutused() {
        return ResponseEntity.ok(kuulutusRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Kuulutus> getKuulutusById(@PathVariable Integer id) {
        return kuulutusRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateKuulutus(
            @PathVariable Integer id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String description,
            @RequestParam Integer userId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            Kuulutus kuulutus = kuulutusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
            
            if (!kuulutus.getUser().getId().equals(userId)) {
                throw new RuntimeException("Not authorized to update this listing");
            }

            if (title != null) kuulutus.setTitle(title);
            if (price != null) kuulutus.setPrice(price);
            if (category != null) kuulutus.setCategory(category);
            if (description != null) kuulutus.setDescription(description);

            // Handle image update using Supabase
            if (image != null) {
                // Delete old image if exists
                if (kuulutus.getImageUrl() != null) {
                    try {
                        supabaseStorageService.deleteFile(kuulutus.getImageUrl());
                    } catch (IOException e) {
                        // Log error but continue
                        System.err.println("Failed to delete old image: " + e.getMessage());
                    }
                }
                
                // Upload new image
                String imageUrl = supabaseStorageService.uploadFile(image);
                kuulutus.setImageUrl(imageUrl);
            }

            Kuulutus updatedKuulutus = kuulutusRepository.save(kuulutus);
            
            response.put("success", true);
            response.put("message", "Listing updated successfully");
            response.put("kuulutus", updatedKuulutus);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteKuulutus(
            @PathVariable Integer id,
            @RequestParam Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Kuulutus kuulutus = kuulutusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
            
            if (!kuulutus.getUser().getId().equals(userId)) {
                throw new RuntimeException("Not authorized to delete this listing");
            }

            // Delete image from Supabase if exists
            if (kuulutus.getImageUrl() != null) {
                try {
                    supabaseStorageService.deleteFile(kuulutus.getImageUrl());
                } catch (IOException e) {
                    // Log error but continue with deletion
                    System.err.println("Failed to delete image: " + e.getMessage());
                }
            }

            kuulutusRepository.delete(kuulutus);
            
            response.put("success", true);
            response.put("message", "Listing deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/fix-image-urls")
    public ResponseEntity<Map<String, Object>> fixImageUrls() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Kuulutus> kuulutused = kuulutusRepository.findAll();
            int fixedCount = 0;
            
            for (Kuulutus kuulutus : kuulutused) {
                String imageUrl = kuulutus.getImageUrl();
                if (imageUrl != null && (imageUrl.contains("http:/") && imageUrl.contains("https:/"))) {
                    // Extract the Supabase part of the URL
                    java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("https://isgqnyhkexduycwmcjxa\\.supabase\\.co/storage/v1/object/public/listings/[^/]+\\.[a-zA-Z0-9]+");
                    java.util.regex.Matcher matcher = pattern.matcher(imageUrl);
                    
                    if (matcher.find()) {
                        String fixedUrl = matcher.group(0);
                        kuulutus.setImageUrl(fixedUrl);
                        kuulutusRepository.save(kuulutus);
                        fixedCount++;
                    }
                }
            }
            
            response.put("success", true);
            response.put("message", "Fixed " + fixedCount + " image URLs");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 