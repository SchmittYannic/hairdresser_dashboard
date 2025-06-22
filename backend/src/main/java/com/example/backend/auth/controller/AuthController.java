package com.example.backend.auth.controller;

import com.example.backend.auth.dto.SigninRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/signin")
    public void signin(@RequestBody SigninRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        logger.info("Login attempt - username: {}, password length: {}", username, password != null ? password.length() : 0);
    }
}