package com.srinredd.assignmentsubmissionapp.filter;

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

import com.srinredd.assignmentsubmissionapp.service.UserDetailServiceImpl;
import com.srinredd.assignmentsubmissionapp.util.JwtUtil;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private UserDetailServiceImpl userDetailServiceImpl;

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		// Get authorization header and validate
		final String requestTokenHeader = request.getHeader("Authorization");

		String jwtToken = null;
		String usernameFromToken = null;

		if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
			jwtToken = requestTokenHeader.substring(7);
		} else {
			System.out.println("The token is " + requestTokenHeader);
			System.out.println("JWT Token does not start with Bearer");
		}

		if (jwtToken != null) {
			try {
				usernameFromToken = jwtUtil.getUsernameFromToken(jwtToken);
			} catch (IllegalArgumentException e) {
				System.out.println("JWT Token format is invalid");
			}
		}

		if (usernameFromToken != null) {
			UserDetails userDetails = userDetailServiceImpl.loadUserByUsername(usernameFromToken);
			
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