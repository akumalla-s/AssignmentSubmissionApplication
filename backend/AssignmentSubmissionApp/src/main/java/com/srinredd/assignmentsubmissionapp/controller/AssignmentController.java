package com.srinredd.assignmentsubmissionapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.srinredd.assignmentsubmissionapp.model.Assignment;
import com.srinredd.assignmentsubmissionapp.model.User;
import com.srinredd.assignmentsubmissionapp.service.AssignmentService;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

	@Autowired
	private AssignmentService assignmentService;

	@PostMapping("")
	public ResponseEntity<?> createAssignment(@AuthenticationPrincipal User user) {

		Assignment newAssignment = assignmentService.save(user);
		return ResponseEntity.ok(newAssignment);
	}

}
