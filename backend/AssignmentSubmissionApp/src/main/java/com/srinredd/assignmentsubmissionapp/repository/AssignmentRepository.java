package com.srinredd.assignmentsubmissionapp.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.srinredd.assignmentsubmissionapp.model.Assignment;
import com.srinredd.assignmentsubmissionapp.model.User;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long>{

	Set<Assignment> findByUser(User user);
}
