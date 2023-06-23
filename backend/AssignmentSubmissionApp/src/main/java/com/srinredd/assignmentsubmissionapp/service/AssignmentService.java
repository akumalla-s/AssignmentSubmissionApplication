package com.srinredd.assignmentsubmissionapp.service;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.srinredd.assignmentsubmissionapp.model.Assignment;
import com.srinredd.assignmentsubmissionapp.model.User;
import com.srinredd.assignmentsubmissionapp.repository.AssignmentRepository;

@Service
public class AssignmentService {

	@Autowired
	AssignmentRepository assignmentRepository;

	public Assignment save(User user) {
		Assignment assignment = new Assignment();
		assignment.setStatus("Needs to be submitted");
		assignment.setUser(user);

		return assignmentRepository.save(assignment);
	}

	public Set<Assignment> findByUser(User user) {
		return assignmentRepository.findByUser(user);
	}

	public Optional<Assignment> findById(Long assignmentId) {
		return assignmentRepository.findById(assignmentId);
	}

	public Assignment save(Assignment assignment) {
		return assignmentRepository.save(assignment);
	}

}
