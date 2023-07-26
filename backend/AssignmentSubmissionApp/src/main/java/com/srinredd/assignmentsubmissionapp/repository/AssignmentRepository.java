package com.srinredd.assignmentsubmissionapp.repository;

import java.util.Set;

import com.srinredd.assignmentsubmissionapp.enums.AssignmentStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.srinredd.assignmentsubmissionapp.model.Assignment;
import com.srinredd.assignmentsubmissionapp.model.User;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long>{

   Set<Assignment> findByUser(User user);

    @Query("select a from Assignment a " +
            "where (a.status = 'submitted' and (a.codeReviewer is null or a.codeReviewer = :codeReviewer))"
            + "or a.codeReviewer = :codeReviewer"
    )
    Set<Assignment> findByCodeReviewer(User codeReviewer);
}
