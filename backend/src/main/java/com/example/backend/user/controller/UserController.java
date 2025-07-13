package com.example.backend.user.controller;

import com.example.backend.common.domain.model.User;
import com.example.backend.user.dto.UserDTO;
import com.example.backend.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "lastname") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(required = false) String lastname,
            @RequestParam(required = false) String firstname,
            @RequestParam(required = false) List<String> roles
    ) {
        Page<UserDTO> page = userService.getUsers(offset, limit, sortField, sortOrder, lastname, firstname, roles);

        Map<String, Object> response = new HashMap<>();
        response.put("users", page.getContent());
        response.put("total", page.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getProfile(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Error in getProfile");
        }

        User user = (User) principal;

        UserDTO profile = UserDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .roles(user.getRoles())
                .title(user.getTitle())
                .birthday(user.getBirthday())
                .phonenumber(user.getPhonenumber())
                .validated(user.isValidated())
                .reminderemail(user.isReminderemail())
                .birthdayemail(user.isBirthdayemail())
                .newsletter(user.isNewsletter())
                .createdAt(Date.from(user.getCreatedAt()))
                .updatedAt(Date.from(user.getUpdatedAt()))
                .build();

        return ResponseEntity.ok(profile);
    }
}
