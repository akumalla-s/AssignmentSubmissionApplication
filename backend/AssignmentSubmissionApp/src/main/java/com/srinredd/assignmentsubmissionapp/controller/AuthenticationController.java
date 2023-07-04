package com.srinredd.assignmentsubmissionapp.controller;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
	
	// api to check whether the application is running or not: http://localhost:8080/api/auth/test
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
			
			//setting password to null so that it won't be exposed in public before 
			//sending it in response body.
			user.setPassword(null);
			
			//generating jwt token 
			final String jwtToken = jwtUtil.generateToken(user);
			//System.out.println(user.getUsername()+" Token is: "+ jwtToken);
			return ResponseEntity.ok()
					.header(
							HttpHeaders.AUTHORIZATION,
							jwtToken
					)
					.body(user);
			
		} catch (BadCredentialsException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@GetMapping("/validate")
	public ResponseEntity<?> validateToken(@RequestParam String token,
										   @AuthenticationPrincipal User user) {
		try {
			Boolean isValidToken = jwtUtil.validateToken(token, user);
			return ResponseEntity.ok(isValidToken);
		} catch (ExpiredJwtException e) {
			return ResponseEntity.ok(false);
		}
	}

}
