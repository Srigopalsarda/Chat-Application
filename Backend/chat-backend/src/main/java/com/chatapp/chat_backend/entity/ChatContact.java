package com.chatapp.chat_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "chat_contacts")
public class ChatContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String contactUserId;

    public ChatContact() {}

    public ChatContact(String userId, String contactUserId) {
        this.userId = userId;
        this.contactUserId = contactUserId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getContactUserId() {
        return contactUserId;
    }

    public void setContactUserId(String contactUserId) {
        this.contactUserId = contactUserId;
    }
}
