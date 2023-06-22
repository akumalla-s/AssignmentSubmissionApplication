package com.srinredd.assignmentsubmissionapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.srinredd.assignmentsubmissionapp.model.Assignment;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long>{

}
