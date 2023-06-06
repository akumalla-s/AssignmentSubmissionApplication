package com.srinredd.assignmentsubmissionapp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.srinredd.assignmentsubmissionapp.model.User;
import com.srinredd.assignmentsubmissionapp.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		Optional<User> userOptional = userRepository.findByUsername(username);

		return userOptional.orElseThrow(() -> new UsernameNotFoundException("Invalid Credentials"));

	}

}
