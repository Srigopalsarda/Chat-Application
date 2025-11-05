package com.chatapp.chat_backend.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String userId;
    private String username;
    private String password;
    private String inviteKey;
}