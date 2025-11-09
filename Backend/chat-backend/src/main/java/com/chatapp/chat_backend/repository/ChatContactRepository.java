package com.chatapp.chat_backend.repository;

import com.chatapp.chat_backend.dto.ContactDTO;
import com.chatapp.chat_backend.entity.ChatContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatContactRepository extends JpaRepository<ChatContact, Long> {

    @Query("""
    SELECT new com.chatapp.chat_backend.dto.ContactDTO(u.userId, u.username)
    FROM ChatContact c
    JOIN User u ON c.contactUserId = u.userId
    WHERE c.userId = :userId
    """)
    List<ContactDTO> findContactsOfUser(String userId);


    boolean existsByUserIdAndContactUserId(String userId, String contactUserId);
}
