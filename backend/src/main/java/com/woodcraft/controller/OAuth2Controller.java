package com.woodcraft.controller;

import com.woodcraft.dto.LoginResponse;
import com.woodcraft.service.OAuth2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/oauth2")
@CrossOrigin(origins = "http://localhost:3000")
public class OAuth2Controller {
    
    @Autowired
    private OAuth2Service oauth2Service;
    
    @GetMapping("/authorize/{provider}")
    public ResponseEntity<?> authorize(@PathVariable String provider, @RequestParam String redirect_uri) {
        try {
            String authUrl = oauth2Service.getAuthorizationUrl(provider, redirect_uri);
            return ResponseEntity.status(302)
                .header("Location", authUrl)
                .build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "authorization_failed", "message", e.getMessage()));
        }
    }
    
    @PostMapping("/callback")
    public ResponseEntity<?> callback(@RequestBody Map<String, String> request) {
        try {
            String code = request.get("code");
            String state = request.get("state");
            String redirectUri = request.get("redirectUri");
            
            if (code == null || code.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "invalid_request", "message", "Authorization code is required"));
            }
            
            LoginResponse response = oauth2Service.handleCallback(code, state, redirectUri);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "callback_failed", "message", e.getMessage()));
        }
    }
}