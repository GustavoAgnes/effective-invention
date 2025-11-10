package com.woodcraft.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OAuth2Config {
    
    // Google OAuth2 Configuration
    @Value("${oauth2.google.client-id:}")
    private String googleClientId;
    
    @Value("${oauth2.google.client-secret:}")
    private String googleClientSecret;
    
    @Value("${oauth2.google.redirect-uri:http://localhost:3000/auth/callback}")
    private String googleRedirectUri;
    

    
    // Getters
    public String getGoogleClientId() { return googleClientId; }
    public String getGoogleClientSecret() { return googleClientSecret; }
    public String getGoogleRedirectUri() { return googleRedirectUri; }
}