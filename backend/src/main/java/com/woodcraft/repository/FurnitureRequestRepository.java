package com.woodcraft.repository;

import com.woodcraft.model.FurnitureRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FurnitureRequestRepository extends JpaRepository<FurnitureRequest, Long> {
    List<FurnitureRequest> findByCustomerId(Long customerId);
    List<FurnitureRequest> findByStatus(String status);
    List<FurnitureRequest> findByStatusOrderByCreatedAtDesc(String status);
}
