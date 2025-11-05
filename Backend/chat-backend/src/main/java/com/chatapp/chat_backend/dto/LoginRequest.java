package com.chatapp.chat_backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String userId;
    private String password;
}