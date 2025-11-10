package com.woodcraft.repository;

import com.woodcraft.model.RejectedRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RejectedRequestRepository extends JpaRepository<RejectedRequest, Long> {
    List<RejectedRequest> findByWoodworkerId(Long woodworkerId);
    Optional<RejectedRequest> findByWoodworkerIdAndRequestId(Long woodworkerId, Long requestId);
    boolean existsByWoodworkerIdAndRequestId(Long woodworkerId, Long requestId);
}
