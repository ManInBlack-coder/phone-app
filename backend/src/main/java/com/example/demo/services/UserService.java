package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.models.Kuulutus;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Repository.KuulutusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KuulutusRepository kuulutusRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String email, String password) {
        if (userRepository.findByEmail(email) != null) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.findByNimi(username) != null) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User(username, email, passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        throw new RuntimeException("Invalid email or password");
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<Kuulutus> findKuulutusByUserEmail(String userEmail) {
        return kuulutusRepository.findByUserEmail(userEmail);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}