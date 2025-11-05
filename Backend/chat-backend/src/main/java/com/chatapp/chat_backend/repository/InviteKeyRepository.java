package com.chatapp.chat_backend.repository;

import com.chatapp.chat_backend.entity.InviteKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InviteKeyRepository extends JpaRepository<InviteKey, Long> {
    Optional<InviteKey> findByKeyValue(String keyValue);
}