package com.woodcraft.config;

import com.woodcraft.model.User;
import com.woodcraft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create test user if it doesn't exist
        if (!userRepository.existsByEmail("test@woodcraft.com")) {
            User testUser = new User();
            testUser.setEmail("test@woodcraft.com");
            testUser.setPassword(passwordEncoder.encode("password123"));
            testUser.setFirstName("John");
            testUser.setLastName("Carpenter");
            
            userRepository.save(testUser);
            System.out.println("Test user created:");
            System.out.println("Email: test@woodcraft.com");
            System.out.println("Password: password123");
        }
        
        // Create another test user
        if (!userRepository.existsByEmail("woodworker@example.com")) {
            User woodworker = new User();
            woodworker.setEmail("woodworker@example.com");
            woodworker.setPassword(passwordEncoder.encode("wood2024"));
            woodworker.setFirstName("Sarah");
            woodworker.setLastName("Woodsmith");
            
            userRepository.save(woodworker);
            System.out.println("Second test user created:");
            System.out.println("Email: woodworker@example.com");
            System.out.println("Password: wood2024");
        }
    }
}