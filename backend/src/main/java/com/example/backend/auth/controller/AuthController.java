package com.example.backend.auth.controller;

import com.example.backend.auth.dto.*;
import com.example.backend.auth.service.AuthService;
import com.example.backend.auth.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Value("${cookie.refreshTokenMaxAge:604800}")
    private int refreshTokenMaxAge;

    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/signin")
    public AccessTokenResponse signin(@RequestBody SigninRequest request,
                                     HttpServletResponse response) {

        AccessTokenResponse accessTokenResponse = authService.signin(request);

        // generate refresh token
        String refreshToken = jwtService.generateRefreshToken(request.getEmail());

        // set refresh token as HttpOnly cookie
        Cookie refreshTokenCookie = new Cookie(REFRESH_TOKEN_COOKIE, refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false); // Set true in production with HTTPS!
        refreshTokenCookie.setPath("/auth/refresh");
        refreshTokenCookie.setMaxAge(refreshTokenMaxAge);

        response.addCookie(refreshTokenCookie);

        return accessTokenResponse;
    }

    @PostMapping("/refresh")
    public AccessTokenResponse refreshToken(@CookieValue(value = REFRESH_TOKEN_COOKIE, required = false) String refreshToken,
                                            HttpServletResponse response) {
        if (refreshToken == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token missing");
        }

        AccessTokenResponse newAccessToken = authService.refreshAccessToken(refreshToken);

        // Optionally: renew refresh token cookie expiration if you want sliding sessions
        Cookie refreshTokenCookie = new Cookie(REFRESH_TOKEN_COOKIE, refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false); // true on production + HTTPS
        refreshTokenCookie.setPath("/auth/refresh");
        refreshTokenCookie.setMaxAge(refreshTokenMaxAge);
        response.addCookie(refreshTokenCookie);

        return newAccessToken;
    }

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        Cookie deleteCookie = new Cookie(REFRESH_TOKEN_COOKIE, null);
        deleteCookie.setHttpOnly(true);
        deleteCookie.setSecure(false); // true on production + HTTPS
        deleteCookie.setPath("/auth/refresh");
        deleteCookie.setMaxAge(0);
        response.addCookie(deleteCookie);
    }
}