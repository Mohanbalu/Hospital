package com.hms.serviceImpl;

import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.LoginRequest;
import com.hms.dto.LoginResponse;
import com.hms.dto.RegisterRequest;
import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.exception.InvalidCredentialsException;
import com.hms.exception.ResourceNotFoundException;
import com.hms.exception.UserAlreadyExistsException;
import com.hms.repository.RoleRepository;
import com.hms.repository.UserRepository;
import com.hms.security.CustomUserDetailsService;
import com.hms.security.JwtService;
import com.hms.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new UserAlreadyExistsException("User already exists with email: " + email);
        }

        String roleName = normalizeRole(request.getRole());
        Role role = roleRepository.findByNameIgnoreCase(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        User user = User.builder()
                .username(email)
                .email(email)
                .fullName(request.getName().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(Boolean.TRUE)
                .build();

        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        } catch (AuthenticationException exception) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        String token = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .role(normalizeRole(user.getRole().getName()))
                .message("Login successful")
                .build();
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeRole(String role) {
        if (role == null) {
            return null;
        }

        String normalizedRole = role.trim().toUpperCase(Locale.ROOT);
        return normalizedRole.startsWith("ROLE_") ? normalizedRole.substring("ROLE_".length()) : normalizedRole;
    }
}
