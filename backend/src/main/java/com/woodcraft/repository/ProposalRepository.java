package com.woodcraft.repository;

import com.woodcraft.model.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByRequestIdOrderByCreatedAtDesc(Long requestId);
    List<Proposal> findByWoodworkerIdOrderByCreatedAtDesc(Long woodworkerId);
    List<Proposal> findByWoodworkerIdAndStatusOrderByCreatedAtDesc(Long woodworkerId, String status);
}
