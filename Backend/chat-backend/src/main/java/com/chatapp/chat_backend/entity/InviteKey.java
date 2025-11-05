package com.chatapp.chat_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invite_keys")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviteKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "key_value", unique = true, nullable = false)
    private String keyValue;

    @Column(nullable = false)
    private boolean used = false;
}