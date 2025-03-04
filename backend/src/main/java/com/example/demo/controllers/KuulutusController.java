package com.example.demo.controllers;

import com.example.demo.models.Kuulutus;
import com.example.demo.models.User;
import com.example.demo.Repository.KuulutusRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kuulutused")
public class KuulutusController {

    @Autowired
    private KuulutusRepository kuulutusRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createKuulutus(@RequestBody Kuulutus kuulutus, @RequestParam Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            kuulutus.setUser(user);
            Kuulutus savedKuulutus = kuulutusRepository.save(kuulutus);
            
            response.put("success", true);
            response.put("message", "Kuulutus created successfully");
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
            @RequestBody Kuulutus kuulutusDetails,
            @RequestParam Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Kuulutus kuulutus = kuulutusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kuulutus not found"));
            
            // Check if the user owns this kuulutus
            if (!kuulutus.getUser().getId().equals(userId)) {
                throw new RuntimeException("Not authorized to update this kuulutus");
            }

            kuulutus.setTitle(kuulutusDetails.getTitle());
            kuulutus.setPrice(kuulutusDetails.getPrice());
            kuulutus.setCategory(kuulutusDetails.getCategory());
            kuulutus.setImageUrl(kuulutusDetails.getImageUrl());

            Kuulutus updatedKuulutus = kuulutusRepository.save(kuulutus);
            
            response.put("success", true);
            response.put("message", "Kuulutus updated successfully");
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
                .orElseThrow(() -> new RuntimeException("Kuulutus not found"));
            
            // Check if the user owns this kuulutus
            if (!kuulutus.getUser().getId().equals(userId)) {
                throw new RuntimeException("Not authorized to delete this kuulutus");
            }

            kuulutusRepository.delete(kuulutus);
            
            response.put("success", true);
            response.put("message", "Kuulutus deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 