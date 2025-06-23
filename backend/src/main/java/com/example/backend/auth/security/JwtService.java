package com.example.backend.auth.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    private final Key accessTokenKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final Key refreshTokenKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private final long accessTokenExpirationMs = 1000 * 60 * 15; // 15 minutes
    private final long refreshTokenExpirationMs = 1000L * 60 * 60 * 24 * 7; // 7 days

    // Access Token
    public String generateAccessToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpirationMs))
                .signWith(accessTokenKey)
                .compact();
    }

    // Refresh Token
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpirationMs))
                .signWith(refreshTokenKey)
                .compact();
    }

    public boolean isAccessTokenValid(String token) {
        return validateToken(token, accessTokenKey);
    }

    public boolean isRefreshTokenValid(String token) {
        return validateToken(token, refreshTokenKey);
    }

    private boolean validateToken(String token, Key key) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractEmailFromAccessToken(String token) {
        return extractEmail(token, accessTokenKey);
    }

    public String extractEmailFromRefreshToken(String token) {
        return extractEmail(token, refreshTokenKey);
    }

    private String extractEmail(String token, Key key) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}