package com.woodcraft.controller;

import com.woodcraft.dto.ProposalDTO;
import com.woodcraft.model.Proposal;
import com.woodcraft.model.User;
import com.woodcraft.repository.ProposalRepository;
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
@RequestMapping("/api/proposals")
@CrossOrigin(origins = "http://localhost:3000")
public class ProposalController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProposalController.class);
    
    @Autowired
    private ProposalRepository proposalRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/create")
    public ResponseEntity<?> createProposal(@RequestBody ProposalDTO dto, @RequestParam String email) {
        try {
            logger.info("Creating proposal for request {} by user: {}", dto.getRequestId(), email);
            
            // Find user by email
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create proposal
            Proposal proposal = new Proposal();
            proposal.setRequestId(dto.getRequestId());
            proposal.setWoodworkerId(user.getId());
            proposal.setWoodworkerName(user.getFirstName() + " " + user.getLastName());
            proposal.setPrice(dto.getPrice());
            proposal.setMessage(dto.getMessage());
            proposal.setImageUrls(dto.getImageUrls());
            proposal.setStatus("PENDING");
            proposal.setCreatedAt(LocalDateTime.now());
            
            Proposal savedProposal = proposalRepository.save(proposal);
            
            logger.info("Proposal created successfully with ID: {}", savedProposal.getId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Proposta enviada com sucesso!",
                "proposalId", savedProposal.getId()
            ));
            
        } catch (Exception e) {
            logger.error("Error creating proposal", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    @GetMapping("/by-request/{requestId}")
    public ResponseEntity<?> getProposalsByRequest(@PathVariable Long requestId) {
        try {
            List<Proposal> proposals = proposalRepository.findByRequestIdOrderByCreatedAtDesc(requestId);
            return ResponseEntity.ok(proposals);
        } catch (Exception e) {
            logger.error("Error fetching proposals for request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/my-proposals")
    public ResponseEntity<?> getMyProposals(@RequestParam String email, @RequestParam(required = false) String status) {
        try {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Proposal> proposals;
            if (status != null && !status.isEmpty()) {
                proposals = proposalRepository.findByWoodworkerIdAndStatusOrderByCreatedAtDesc(user.getId(), status);
            } else {
                proposals = proposalRepository.findByWoodworkerIdOrderByCreatedAtDesc(user.getId());
            }
            return ResponseEntity.ok(proposals);
        } catch (Exception e) {
            logger.error("Error fetching user proposals", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{proposalId}/accept")
    public ResponseEntity<?> acceptProposal(@PathVariable Long proposalId) {
        try {
            Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));
            
            proposal.setStatus("ACCEPTED");
            proposalRepository.save(proposal);
            
            logger.info("Proposal {} accepted", proposalId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Proposta aceita com sucesso!"
            ));
        } catch (Exception e) {
            logger.error("Error accepting proposal", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    @PutMapping("/{proposalId}/reject")
    public ResponseEntity<?> rejectProposal(@PathVariable Long proposalId) {
        try {
            Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));
            
            proposal.setStatus("REJECTED");
            proposalRepository.save(proposal);
            
            logger.info("Proposal {} rejected", proposalId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Proposta rejeitada"
            ));
        } catch (Exception e) {
            logger.error("Error rejecting proposal", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
