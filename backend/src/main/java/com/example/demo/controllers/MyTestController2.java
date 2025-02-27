package com.example.demo.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController  // Add this annotation
public class MyTestController2 {

    @GetMapping("/test24")
    public String test() {
        return "This is controller test  niger!";

    }

}
