package com.hotelbooking.authservice.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelbooking.authservice.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    
    @Value("${supabase.url:https://yytgzdqkautnpfqxfomj.supabase.co}")
    private String supabaseUrl;
    
    @Value("${supabase.api-key:sb_publishable_ZeXbsrLCcGDZzXziWFdaFw_wlXGcWzk}")
    private String supabaseApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean userExists(String username) {
        try {
            String url = supabaseUrl + "/rest/v1/users?username=eq." + username;
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>("", headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            List<Map<String, Object>> users = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
            
            return !users.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public void registerUser(RegisterRequest request) throws Exception {
        // Check if user already exists
        if (userExists(request.getUsername())) {
            throw new Exception("Username already exists");
        }

        // Hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Prepare request body
        Map<String, Object> body = new HashMap<>();
        body.put("username", request.getUsername());
        body.put("email", request.getEmail());
        body.put("password_hash", hashedPassword);
        body.put("role", "USER");

        // Make HTTP POST request to Supabase
        String url = supabaseUrl + "/rest/v1/users";
        HttpHeaders headers = createHeaders();
        headers.set("Prefer", "return=minimal");
        
        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(body), headers);
        restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    }

    public String getUserRole(String username) {
        try {
            String url = supabaseUrl + "/rest/v1/users?username=eq." + username;
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>("", headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            List<Map<String, Object>> users = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
            
            if (!users.isEmpty()) {
                return (String) users.get(0).getOrDefault("role", "USER");
            }
            return "USER";
        } catch (Exception e) {
            return "USER";
        }
    }

    public Map<String, Object> getUserByUsername(String username) {
        try {
            String url = supabaseUrl + "/rest/v1/users?username=eq." + username;
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>("", headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            List<Map<String, Object>> users = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
            
            if (!users.isEmpty()) {
                return users.get(0);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseApiKey);
        headers.set("Authorization", "Bearer " + supabaseApiKey);
        headers.set("Content-Type", "application/json");
        return headers;
    }
}
