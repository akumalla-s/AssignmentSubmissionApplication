package com.srinredd.assignmentsubmissionapp.service;

import java.util.Optional;
import java.util.Set;

import com.srinredd.assignmentsubmissionapp.enums.AssignmentStatusEnum;
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
		assignment.setStatus(AssignmentStatusEnum.PENDING_SUBMISSION.getStatus());
		assignment.setNumber(findNextAssignnmentToSubmit(user));
		assignment.setUser(user);

		return assignmentRepository.save(assignment);
	}

	private Integer findNextAssignnmentToSubmit(User user) {
		Set<Assignment> assignmentsByUser = assignmentRepository.findByUser(user);
		if(assignmentsByUser == null){
			return 1;
		}
		 Optional<Integer> nextAssignmentNumber = assignmentsByUser.stream()
				.sorted((a1, a2)-> {
					if (a1.getNumber() == null) return 1;
					if (a2.getNumber() == null) return 1;
					return a2.getNumber().compareTo(a1.getNumber());
				})
				.map(assignment -> {
					if(assignment.getNumber() == null) return 1;
					return assignment.getNumber()+1;
				})
				.findFirst();

		return nextAssignmentNumber.orElse(1);
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
