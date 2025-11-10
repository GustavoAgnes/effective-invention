package com.woodcraft.service;

import com.woodcraft.config.OAuth2Config;
import com.woodcraft.dto.LoginResponse;
import com.woodcraft.model.User;
import com.woodcraft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class OAuth2Service {
    
    @Autowired
    private OAuth2Config oauth2Config;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    public String getAuthorizationUrl(String provider, String redirectUri) {
        switch (provider.toLowerCase()) {
            case "google":
                return UriComponentsBuilder.fromHttpUrl("https://accounts.google.com/o/oauth2/v2/auth")
                    .queryParam("client_id", oauth2Config.getGoogleClientId())
                    .queryParam("redirect_uri", redirectUri)
                    .queryParam("response_type", "code")
                    .queryParam("scope", "openid email profile")
                    .queryParam("state", generateState())
                    .build().toUriString();
                    
            default:
                throw new IllegalArgumentException("Unsupported OAuth2 provider: " + provider);
        }
    }
    
    public LoginResponse handleCallback(String code, String state, String redirectUri) {
        // Only Google OAuth is supported now
        try {
            return processGoogleCallback(code, redirectUri);
        } catch (Exception e) {
            throw new RuntimeException("Google OAuth2 callback processing failed: " + e.getMessage());
        }
    }
    
    private LoginResponse processGoogleCallback(String code, String redirectUri) {
        // Exchange code for access token
        String tokenUrl = "https://oauth2.googleapis.com/token";
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", oauth2Config.getGoogleClientId());
        params.add("client_secret", oauth2Config.getGoogleClientSecret());
        params.add("code", code);
        params.add("grant_type", "authorization_code");
        params.add("redirect_uri", redirectUri);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        
        try {
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, request, Map.class);
            Map<String, Object> tokenData = tokenResponse.getBody();
            
            if (tokenData == null || !tokenData.containsKey("access_token")) {
                throw new RuntimeException("Failed to obtain access token");
            }
            
            String accessToken = (String) tokenData.get("access_token");
            
            // Get user info from Google
            String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken;
            ResponseEntity<Map> userResponse = restTemplate.getForEntity(userInfoUrl, Map.class);
            Map<String, Object> userData = userResponse.getBody();
            
            if (userData == null) {
                throw new RuntimeException("Failed to obtain user information");
            }
            
            // Create or update user
            String email = (String) userData.get("email");
            String firstName = (String) userData.get("given_name");
            String lastName = (String) userData.get("family_name");
            
            User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirstName(firstName != null ? firstName : "Usuário");
                    newUser.setLastName(lastName != null ? lastName : "Google");
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random password for OAuth users
                    return userRepository.save(newUser);
                });
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Generate JWT token
            String jwtToken = jwtService.generateToken(user.getEmail());
            
            // Create user info
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
            );
            
            return new LoginResponse(jwtToken, "Login with Google successful", userInfo);
            
        } catch (Exception e) {
            throw new RuntimeException("Google OAuth2 processing failed: " + e.getMessage());
        }
    }
    
    private String generateState() {
        return UUID.randomUUID().toString();
    }
}