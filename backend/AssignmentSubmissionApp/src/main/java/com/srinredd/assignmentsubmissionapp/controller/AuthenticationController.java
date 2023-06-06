package com.srinredd.assignmentsubmissionapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.srinredd.assignmentsubmissionapp.dto.AuthCredentialRequest;
import com.srinredd.assignmentsubmissionapp.jwt.JwtUtil;
import com.srinredd.assignmentsubmissionapp.model.User;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtil jwtUtil;

	@GetMapping("/test")
	public String hello() {
		return "Application Running..";
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody AuthCredentialRequest request) {
		try {
			Authentication authenticate = 
					authenticationManager.authenticate(
							new UsernamePasswordAuthenticationToken(
									request.getUsername(), request.getPassword()
							)
					);

			User user = (User) authenticate.getPrincipal();
			
			//setting password to null so that it won't be eposed in public before 
			//sending it in response body.
			user.setPassword(null);
			return ResponseEntity.ok()
					.header(
							HttpHeaders.AUTHORIZATION,
							jwtUtil.generateToken(user)
					)
					.body(user);
			
		} catch (BadCredentialsException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}	
}
