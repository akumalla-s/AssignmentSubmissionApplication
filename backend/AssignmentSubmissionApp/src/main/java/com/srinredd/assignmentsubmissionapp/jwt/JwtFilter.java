package com.srinredd.assignmentsubmissionapp.jwt;

import java.io.IOException;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.srinredd.assignmentsubmissionapp.service.UserDetailsServiceImpl;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private UserDetailsServiceImpl userDetailsServiceImpl;

	@Autowired
	private JwtUtil jwtUtil;
	
	private String jwtToken = null;
	private String usernameFromToken = null;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		// Get authorization header and validate
		final String requestTokenHeader = request.getHeader("Authorization");		

		// check if the requestTokenHeader is not null and it start with Bearer
		// if it passes the check store it in a jwtToken
		if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
			jwtToken = requestTokenHeader.substring(7);
		} else {
			System.out.println("The token is " + requestTokenHeader);
			System.out.println("JWT Token does not start with Bearer");
		}

		// get username from the token using jwtUtil class
		if (jwtToken != null) {
			try {
				usernameFromToken = jwtUtil.getUsernameFromToken(jwtToken);
			} catch (Exception e) {
				System.out.println("com.srinredd.assignmentsubmissionapp.jwt.JwtFilter.class: JWT Token format is invalid");
			}
		}

		// using the usernameFromToken get UserDetails
		if (usernameFromToken != null) {
			UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(usernameFromToken);
			
			// if token is valid configure Spring Security to manually set authentication
			if (jwtUtil.validateToken(jwtToken, userDetails)
					&& SecurityContextHolder.getContext().getAuthentication() == null) {

				UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails == null ? List.of() : userDetails.getAuthorities());
				
				usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				// After setting the Authentication in the context, we specify that the current user is authenticated. So it passes the
				// Spring Security Configurations successfully.
				// this is where authentication happens and the user is now valid
				SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
			}
		}

		chain.doFilter(request, response);
	}

}
