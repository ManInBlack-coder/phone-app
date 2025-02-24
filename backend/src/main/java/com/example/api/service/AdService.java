package com.example.restfulapi.service;

import com.example.restfulapi.model.Ad;
import com.example.restfulapi.repository.AdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdService {

    private final AdRepository adRepository;

    @Autowired
    public AdService(AdRepository adRepository) {
        this.adRepository = adRepository;
    }

    public List<Ad> getAllAds() {
        return adRepository.findAll();
    }

    public Optional<Ad> getAdById(Long id) {
        return adRepository.findById(id);
    }

    public Ad createAd(Ad ad) {
        return adRepository.save(ad);
    }

    // Add this method to delete an ad
    public void deleteAd(Long id) {
        adRepository.deleteById(id);
    }
}
