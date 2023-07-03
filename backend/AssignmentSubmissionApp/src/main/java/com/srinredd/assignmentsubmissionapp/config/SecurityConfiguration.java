package com.srinredd.assignmentsubmissionapp.config;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.srinredd.assignmentsubmissionapp.jwt.JwtFilter;


@EnableWebSecurity
@Configuration
public class SecurityConfiguration {

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private JwtFilter jwtFilter;

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setPasswordEncoder(passwordEncoder());
		provider.setUserDetailsService(userDetailsService);

		return provider;
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		
		//disable cors and csrf
		http = http.csrf().disable();
		http = http.cors().disable();
		
		//set session management to stateless
		http = http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and();

		//set unauthorized requests exception handler
		http = http.exceptionHandling().
					authenticationEntryPoint(
							(request, response, ex) -> {
								response.sendError(
										HttpServletResponse.SC_UNAUTHORIZED,
										ex.getMessage()
								);
							}
					)
					.and();

		//set permissions on end points
		http.authorizeHttpRequests()
			//Our public end points
			.antMatchers("/api/auth/**").permitAll()
			.antMatchers("/api").permitAll();
		
		//Our private end points
		http.authorizeHttpRequests().anyRequest().authenticated();
		
		http.authenticationProvider(authenticationProvider());		
		
		//Add jwt token filter
		http.addFilterBefore(
				jwtFilter,
				UsernamePasswordAuthenticationFilter.class
			);
		
		
		return http.build();
	}

}
