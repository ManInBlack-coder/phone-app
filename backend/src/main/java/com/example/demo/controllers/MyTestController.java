package com.example.demo.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class MyTestController {
    @GetMapping("/test")
    public String test() {
        return "Test changed at " + System.currentTimeMillis(); // Muuda siin midagi
    }
}


