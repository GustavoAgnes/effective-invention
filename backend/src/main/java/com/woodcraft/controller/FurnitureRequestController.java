package com.woodcraft.controller;

import com.woodcraft.dto.FurnitureRequestDTO;
import com.woodcraft.model.FurnitureRequest;
import com.woodcraft.model.User;
import com.woodcraft.repository.FurnitureRequestRepository;
import com.woodcraft.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:3000")
public class FurnitureRequestController {
    
    private static final Logger logger = LoggerFactory.getLogger(FurnitureRequestController.class);
    
    @Autowired
    private FurnitureRequestRepository requestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody FurnitureRequestDTO dto, @RequestParam String email) {
        try {
            logger.info("Creating furniture request for user: {}", email);
            
            // Find user by email
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create furniture request
            FurnitureRequest request = new FurnitureRequest();
            request.setCustomerId(user.getId());
            request.setFurnitureType(dto.getFurnitureType());
            request.setMaterial(dto.getMaterial());
            request.setWoodType(dto.getWoodType());
            request.setColor(dto.getColor());
            request.setThickness(dto.getThickness());
            request.setDimensions(dto.getDimensions());
            request.setDescription(dto.getDescription());
            request.setBudget(dto.getBudget());
            request.setAiPreviewImage(dto.getAiPreviewImage());
            request.setStatus("ACTIVE");
            request.setCreatedAt(LocalDateTime.now());
            
            FurnitureRequest savedRequest = requestRepository.save(request);
            
            logger.info("Furniture request created successfully with ID: {}", savedRequest.getId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Solicitação publicada com sucesso!",
                "requestId", savedRequest.getId()
            ));
            
        } catch (Exception e) {
            logger.error("Error creating furniture request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<?> getActiveRequests() {
        try {
            List<FurnitureRequest> requests = requestRepository.findByStatusOrderByCreatedAtDesc("ACTIVE");
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching active requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyRequests(@RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<FurnitureRequest> requests = requestRepository.findByCustomerId(user.getId());
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching user requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
