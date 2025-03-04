package com.example.demo.services;

import com.example.demo.Repository.KuulutusRepository;
import com.example.demo.models.Kuulutus;
import com.example.demo.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KuulutusService {

    @Autowired
    private KuulutusRepository kuulutusRepository;

    @Autowired
    private UserService userService;

    public Kuulutus createKuulutus(Kuulutus kuulutus, String userEmail) {
        User user = userService.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        kuulutus.setUser(user);
        return kuulutusRepository.save(kuulutus);
    }

    public Kuulutus getKuulutus(Integer id) {
        return kuulutusRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Kuulutus not found"));
    }
} 