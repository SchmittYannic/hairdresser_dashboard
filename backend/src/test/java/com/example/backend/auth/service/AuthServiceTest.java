package com.example.backend.auth.service;

import com.example.backend.auth.repository.UserRepository;
import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.auth.dto.SigninRequest;
import com.example.backend.auth.dto.AccessTokenResponse;
import com.example.backend.auth.security.JwtService;
import com.example.backend.common.domain.model.User;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    private AutoCloseable mocks;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        mocks.close();
    }

    @Test
    void register_shouldThrow_ifEmailIsTaken() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existinguser@test.de");
        request.setPassword("password");

        when(userRepository.existsByEmail("existinguser@test.de")).thenReturn(true);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.register(request));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertEquals("Email already taken", ex.getReason());
    }

    @Test
    void register_shouldSucceed() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@test.de");
        request.setPassword("password");

        when(userRepository.existsByEmail("newuser@test.de")).thenReturn(false);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        authService.register(request);

        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();

        assertEquals("newuser@test.de", savedUser.getEmail());
        assertNotEquals("password", savedUser.getPassword());
        assertTrue(passwordEncoder.matches("password", savedUser.getPassword()));
        assertTrue(savedUser.getRoles().contains("User"));
        assertFalse(savedUser.getRoles().contains("Employee"));
        assertFalse(savedUser.getRoles().contains("Admin"));
    }

    @Test
    void signin_shouldThrow_ifUserNotFound() {
        SigninRequest request = new SigninRequest();
        request.setEmail("notfound@test.de");
        request.setPassword("irrelevant");
        request.setSaveDetails(false);

        when(userRepository.findByEmail("notfound@test.de")).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.signin(request));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        assertEquals("User not found", ex.getReason());
    }

    @Test
    void signin_shouldThrow_ifPasswordInvalid() {
        SigninRequest request = new SigninRequest();
        request.setEmail("existinguser@test.de");
        request.setPassword("wrongpassword");

        String correctPassword = "correctpassword";
        String encodedCorrectPassword = passwordEncoder.encode(correctPassword);

        User user = User.builder()
                .email("existinguser@test.de")
                .password(encodedCorrectPassword)
                .roles(List.of("Employee", "User"))
                .build();

        when(userRepository.findByEmail("existinguser@test.de")).thenReturn(Optional.of(user));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.signin(request));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        assertEquals("Invalid credentials", ex.getReason());
    }

    @Test
    void signin_shouldThrow_ifRoleInsufficient() {
        SigninRequest request = new SigninRequest();
        request.setEmail("existinguser@test.de");
        request.setPassword("correctpassword");

        String encodedPassword = passwordEncoder.encode("correctpassword");

        User user = User.builder()
                .email("existinguser@test.de")
                .password(encodedPassword)
                .roles(List.of("User"))
                .build();

        when(userRepository.findByEmail("existinguser@test.de")).thenReturn(Optional.of(user));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.signin(request));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        assertEquals("Access denied: not an employee or admin", ex.getReason());
    }

    @Test
    void signin_shouldReturnAccessToken_ifCredentialsAndRoleAreValid() {
        SigninRequest request = new SigninRequest();
        request.setEmail("existinguser@test.de");
        request.setPassword("correctpassword");

        String encodedPassword = passwordEncoder.encode("correctpassword");

        User user = User.builder()
                .email("existinguser@test.de")
                .password(encodedPassword)
                .roles(List.of("Employee", "User"))
                .build();

        when(userRepository.findByEmail("existinguser@test.de")).thenReturn(Optional.of(user));

        when(jwtService.generateAccessToken("existinguser@test.de")).thenReturn("mocked-access-token");

        AccessTokenResponse response = authService.signin(request);

        assertNotNull(response);
        assertEquals("mocked-access-token", response.getAccessToken());

        verify(userRepository).findByEmail("existinguser@test.de");
        verify(jwtService).generateAccessToken("existinguser@test.de");
    }

    @Test
    void getUserFromRefreshToken_shouldThrow_ifTokenInvalid() {
        String invalidToken = "invalidRefreshToken";

        when(jwtService.isRefreshTokenValid(invalidToken)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.getUserFromRefreshToken(invalidToken));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        assertEquals("Invalid refresh token", ex.getReason());
    }

    @Test
    void getUserFromRefreshToken_shouldThrow_ifUserNotFound() {
        String validToken = "validRefreshToken";
        String email = "user@test.de";

        when(jwtService.isRefreshTokenValid(validToken)).thenReturn(true);
        when(jwtService.extractEmailFromRefreshToken(validToken)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.getUserFromRefreshToken(validToken));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        assertEquals("User not found", ex.getReason());
    }

    @Test
    void getUserFromRefreshToken_shouldReturnUser_ifTokenValidAndUserExists() {
        String validToken = "validRefreshToken";
        String email = "user@test.de";

        User user = User.builder()
                .email(email)
                .build();

        when(jwtService.isRefreshTokenValid(validToken)).thenReturn(true);
        when(jwtService.extractEmailFromRefreshToken(validToken)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        User returnedUser = authService.getUserFromRefreshToken(validToken);

        assertEquals(email, returnedUser.getEmail());
    }

    @Test
    void refreshAccessToken_shouldThrow_ifRefreshTokenInvalid() {
        String refreshToken = "invalidToken";

        when(jwtService.isRefreshTokenValid(refreshToken)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.refreshAccessToken(refreshToken));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        assertEquals("Invalid refresh token", ex.getReason());
    }

    @Test
    void refreshAccessToken_shouldReturnNewToken_ifRefreshTokenValid() {
        String refreshToken = "validRefreshToken";
        String email = "user@test.de";
        String newAccessToken = "newAccessToken";

        User user = User.builder()
                .email(email)
                .build();

        when(jwtService.isRefreshTokenValid(refreshToken)).thenReturn(true);
        when(jwtService.extractEmailFromRefreshToken(refreshToken)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(email)).thenReturn(newAccessToken);

        AccessTokenResponse response = authService.refreshAccessToken(refreshToken);

        assertNotNull(response);
        assertEquals(newAccessToken, response.getAccessToken());
    }
}