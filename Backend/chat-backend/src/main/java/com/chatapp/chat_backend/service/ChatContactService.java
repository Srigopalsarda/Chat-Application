package com.chatapp.chat_backend.service;

import com.chatapp.chat_backend.dto.ContactDTO;
import com.chatapp.chat_backend.entity.ChatContact;
import com.chatapp.chat_backend.entity.User;
import com.chatapp.chat_backend.repository.ChatContactRepository;
import com.chatapp.chat_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatContactService {

    private final ChatContactRepository repository;
    private final UserRepository userRepository;

    public ChatContactService(ChatContactRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public String addContact(String userId, String contactUserId) {

        // ✅ Check if user exists
        Optional<User> contactUser = userRepository.findByUserId(contactUserId);
        if (contactUser == null) {
            return "User does not exist.";
        }

        // ✅ Prevent duplicates
        if (repository.existsByUserIdAndContactUserId(userId, contactUserId)) {
            return "Chat already exists.";
        }

        // ✅ Save one-way link
        repository.save(new ChatContact(userId, contactUserId));

        // ✅ Optional: save two-way link (for symmetric chat list)
        if (!repository.existsByUserIdAndContactUserId(contactUserId, userId)) {
            repository.save(new ChatContact(contactUserId, userId));
        }

        return "Chat user added successfully.";
    }

    public List<ContactDTO> getContacts(String userId) {
        return repository.findContactsOfUser(userId);
    }

}
