package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.Models.UserInfo;
import com.motionParts.ecommerce.Models.User;
import com.motionParts.ecommerce.repositories.UserRepository;
import com.motionParts.ecommerce.repositories.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-info")
public class UserInfoController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    // Endpoint para obtener la info del usuario autenticado
    @GetMapping("/me")
    public ResponseEntity<UserInfo> getMyUserInfo(Authentication authentication) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

        UserInfo userInfo = userInfoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Información de usuario no encontrada para: " + username));

        return ResponseEntity.ok(userInfo);
    }
}
