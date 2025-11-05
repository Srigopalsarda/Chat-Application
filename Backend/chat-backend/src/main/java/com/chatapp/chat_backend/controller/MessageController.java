package com.chatapp.chat_backend.controller;

import com.chatapp.chat_backend.entity.Message;
import com.chatapp.chat_backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> payload) {
        try {
            String senderId = payload.get("senderId");
            String receiverId = payload.get("receiverId");
            String content = payload.get("content");

            Message message = messageService.sendTextMessage(senderId, receiverId, content);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("senderId") String senderId,
            @RequestParam("receiverId") String receiverId,
            @RequestParam("file") MultipartFile file) {
        try {
            Message message = messageService.sendFileMessage(senderId, receiverId, file);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/chat")
    public ResponseEntity<?> getChatMessages(
            @RequestParam("senderId") String senderId,
            @RequestParam("receiverId") String receiverId) {
        try {
            List<Message> messages = messageService.getChatMessages(senderId, receiverId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}