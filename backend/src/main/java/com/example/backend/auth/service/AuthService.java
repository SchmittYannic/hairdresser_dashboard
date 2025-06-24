package com.example.backend.auth.service;

import com.example.backend.auth.dto.*;
import com.example.backend.auth.model.User;
import com.example.backend.auth.repository.UserRepository;
import com.example.backend.auth.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already taken");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(List.of("User", "Employee"))
                .build();

        userRepository.save(user);
    }

    public AccessTokenResponse signin(SigninRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        boolean hasAccess = user.getRoles().stream()
                .anyMatch(role -> role.equalsIgnoreCase("Employee") || role.equalsIgnoreCase("Admin"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        if (!hasAccess) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: not an employee or admin");
        }

        String accessToken = jwtService.generateAccessToken(user.getEmail());
        return new AccessTokenResponse(accessToken);
    }

    public User getUserFromRefreshToken(String refreshToken) {
        if (!jwtService.isRefreshTokenValid(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }
        String email = jwtService.extractEmailFromRefreshToken(refreshToken);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    public AccessTokenResponse refreshAccessToken(String refreshToken) {
        User user = getUserFromRefreshToken(refreshToken);
        String newAccessToken = jwtService.generateAccessToken(user.getEmail());
        return new AccessTokenResponse(newAccessToken);
    }
}