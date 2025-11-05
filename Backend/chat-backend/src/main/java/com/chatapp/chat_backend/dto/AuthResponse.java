package com.chatapp.chat_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String message;
    private String userId;
    private String username;
    private String token;  // JWT token

    // Constructor without token (for backward compatibility)
    public AuthResponse(String message, String userId, String username) {
        this.message = message;
        this.userId = userId;
        this.username = username;
    }
}