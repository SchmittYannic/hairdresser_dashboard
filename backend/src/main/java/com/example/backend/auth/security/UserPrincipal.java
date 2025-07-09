package com.example.backend.auth.security;

import com.example.backend.common.domain.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {

    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // adjust as needed
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // adjust as needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // adjust as needed
    }

    @Override
    public boolean isEnabled() {
        return true; // or something like user.isValidated()
    }
}
