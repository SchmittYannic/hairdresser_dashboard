package com.example.backend.user.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class UserDTO {
    private String id;
    private String email;
    private List<String> roles;
    private String title;
    private String lastname;
    private String firstname;
    private Date birthday;
    private String phonenumber;
    private boolean validated;
    private boolean reminderemail;
    private boolean birthdayemail;
    private boolean newsletter;
    private Date createdAt;
    private Date updatedAt;
}
