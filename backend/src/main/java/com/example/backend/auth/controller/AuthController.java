package com.example.backend.auth.controller;

import com.example.backend.auth.dto.AuthResponse;
import com.example.backend.auth.dto.SigninRequest;
import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.auth.model.User;
import com.example.backend.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/signin")
    public AuthResponse signin(@RequestBody SigninRequest request) {
        return authService.signin(request);
    }

    @GetMapping("/me")
    public User getCurrentUser(@RequestHeader("Authorization") String token) {
        return authService.getCurrentUser(token);
    }
}