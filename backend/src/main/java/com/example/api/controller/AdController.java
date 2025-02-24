package com.example.restfulapi.controller;

import com.example.restfulapi.model.Ad;
import com.example.restfulapi.service.AdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ads")
public class AdController {

    private final AdService adService;

    @Autowired
    public AdController(AdService adService) {
        this.adService = adService;
    }

    @GetMapping
    public List<Ad> getAllAds() {
        return adService.getAllAds();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ad> getAdById(@PathVariable Long id) {
        Optional<Ad> ad = adService.getAdById(id);
        return ad.map(ResponseEntity::ok)
                 .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ad createAd(@RequestBody Ad ad) {
        return adService.createAd(ad);
    }

    // Update existing ad (if needed)
    @PutMapping("/{id}")
    public ResponseEntity<Ad> updateAd(@PathVariable Long id, @RequestBody Ad ad) {
        Optional<Ad> existingAd = adService.getAdById(id);
        if (existingAd.isPresent()) {
            ad.setId(id);  // Ensure the ID is set to the path variable for updating
            Ad updatedAd = adService.createAd(ad);
            return ResponseEntity.ok(updatedAd);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete ad
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAd(@PathVariable Long id) {
        Optional<Ad> existingAd = adService.getAdById(id);
        if (existingAd.isPresent()) {
            adService.deleteAd(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
