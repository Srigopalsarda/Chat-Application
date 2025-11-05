package com.chatapp.chat_backend.service;

import com.chatapp.chat_backend.dto.AuthResponse;
import com.chatapp.chat_backend.dto.LoginRequest;
import com.chatapp.chat_backend.dto.SignupRequest;
import com.chatapp.chat_backend.entity.InviteKey;
import com.chatapp.chat_backend.entity.User;
import com.chatapp.chat_backend.repository.InviteKeyRepository;
import com.chatapp.chat_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final InviteKeyRepository inviteKeyRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // Check if userId already exists
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("User ID already exists");
        }

        // Validate invite key
        InviteKey inviteKey = inviteKeyRepository.findByKeyValue(request.getInviteKey())
                .orElseThrow(() -> new RuntimeException("Invalid invite key"));

        if (inviteKey.isUsed()) {
            throw new RuntimeException("Invite key already used");
        }

        // Create new user
        User user = new User();
        user.setUserId(request.getUserId());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        // Mark invite key as used
        inviteKey.setUsed(true);
        inviteKeyRepository.save(inviteKey);

        return new AuthResponse("Signup successful!", user.getUserId(), user.getUsername());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new AuthResponse("Login successful!", user.getUserId(), user.getUsername());
    }
}