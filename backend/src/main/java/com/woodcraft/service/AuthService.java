package com.woodcraft.service;

import com.woodcraft.dto.LoginRequest;
import com.woodcraft.dto.LoginResponse;
import com.woodcraft.model.User;
import com.woodcraft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());
        
        // Create user info
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName()
        );
        
        return new LoginResponse(token, "Login successful", userInfo);
    }
}