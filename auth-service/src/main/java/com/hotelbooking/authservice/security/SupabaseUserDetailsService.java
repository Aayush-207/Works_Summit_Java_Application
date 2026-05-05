package com.hotelbooking.authservice.security;

import com.hotelbooking.authservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SupabaseUserDetailsService implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            Map<String, Object> user = userService.getUserByUsername(username);
            
            if (user == null) {
                throw new UsernameNotFoundException("User not found: " + username);
            }

            String passwordHash = (String) user.get("password_hash");
            String role = (String) user.getOrDefault("role", "USER");

            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role));

            return User.builder()
                    .username(username)
                    .password(passwordHash)
                    .authorities(authorities)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        } catch (Exception e) {
            throw new UsernameNotFoundException("Failed to load user: " + username, e);
        }
    }
}
