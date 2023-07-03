package com.srinredd.assignmentsubmissionapp.jwt;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.util.StringUtils;

@Component
public class JwtUtil implements Serializable {

	private static final long serialVersionUID = -1632717224675515594L;

	// Current validity of the token is set to 5 hours: days * hours * minutes * seconds
	public static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60;

	//This value is set in application.properties file
	@Value("${jwt.secret}")
	private String secret;

	// Generate Jwt Token
	public String generateToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		return doGenerateToken(claims, userDetails.getUsername());
	}

	private String doGenerateToken(Map<String, Object> claims, String subject) {
		return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000)) // Token expiration
																									// time
				.signWith(SignatureAlgorithm.HS512, secret).compact();
	}

	// validate token
	public boolean validateToken(String token, UserDetails user) {
//		if(!StringUtils.hasText(token)){
//			return false;
//		}
		final String username = getUsernameFromToken(token);
		return (user != null && username.equals(user.getUsername()) && !isTokenExpired(token));
	}

	// for retrieveing any information from token we will need the secret key
	private Claims getAllClaimsFromToken(String token) {
		return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
	}

	// retrieve username from jwt token
	public String getUsernameFromToken(String token) {
		return getAllClaimsFromToken(token).getSubject();
	}

	// retrieve expiration date from jwt token
	public Date getExpirationDateFromToken(String token) {
		return getAllClaimsFromToken(token).getExpiration();
	}

	public boolean isTokenExpired(String token) {
		Date expiration = getExpirationDateFromToken(token);
		return expiration.before(new Date());
	}

	private boolean ignoreTokenExpiration(String token) {
		return false;
	}

	public Boolean canTokenBeRefreshed(String token) {
		return (isTokenExpired(token)) || ignoreTokenExpiration(token);
	}

}
