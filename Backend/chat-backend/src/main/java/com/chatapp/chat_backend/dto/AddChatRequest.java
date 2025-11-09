package com.chatapp.chat_backend.dto;

public class AddChatRequest {
    private String userId;
    private String contactUserId;

    public String getUserId() { return userId; }
    public String getContactUserId() { return contactUserId; }
}
