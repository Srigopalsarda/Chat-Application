package com.chatapp.chat_backend.controller;

import com.chatapp.chat_backend.dto.AddChatRequest;
import com.chatapp.chat_backend.dto.ContactDTO;
import com.chatapp.chat_backend.service.ChatContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatContactService chatContactService;

    public ChatController(ChatContactService chatContactService) {
        this.chatContactService = chatContactService;
    }

    @PostMapping("/addContact")
    public String addContact(@RequestBody AddChatRequest request) {
        chatContactService.addContact(request.getUserId(), request.getContactUserId());
        return "Chat user added successfully";
    }

    @GetMapping("/contacts/{userId}")
    public List<ContactDTO> getContacts(@PathVariable String userId) {
        return chatContactService.getContacts(userId);
    }


    @PostMapping("/add-contact")
    public ResponseEntity<String> addContact(@RequestParam String userId, @RequestParam String contactUserId) {
        String result = chatContactService.addContact(userId, contactUserId);

        if (result.equals("Chat user added successfully.")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

}
