package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.Models.UserInfo;
import com.motionParts.ecommerce.dto.UserInfoDTO;
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

// Endpoint para actualizar la información del usuario autenticado / el admin puede actualizar cualquier usuario
    @PutMapping("/me")
    public ResponseEntity<UserInfo> updateMyUserInfo(Authentication authentication, @RequestBody UserInfoDTO userInfoDTO) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

        // Verificar si el usuario tiene información asociada
        UserInfo userInfo = userInfoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Información de usuario no encontrada para: " + username));

        // Actualizar la información de usuario con los valores del DTO
        userInfo.setType(userInfoDTO.getType());
        userInfo.setDocumentType(userInfoDTO.getDocumentType());
        userInfo.setDocumentNumber(userInfoDTO.getDocumentNumber());
        userInfo.setDocumentExp(userInfoDTO.getDocumentExp());
        userInfo.setExpCountry(userInfoDTO.getExpCountry());
        userInfo.setExpRegion(userInfoDTO.getExpRegion());
        userInfo.setExpCity(userInfoDTO.getExpCity());
        userInfo.setFirstName(userInfoDTO.getFirstName());
        userInfo.setMiddleName(userInfoDTO.getMiddleName());
        userInfo.setLastName(userInfoDTO.getLastName());
        userInfo.setSecondLastName(userInfoDTO.getSecondLastName());
        userInfo.setOtherNames(userInfoDTO.getOtherNames());
        userInfo.setLegalName(userInfoDTO.getLegalName());
        userInfo.setEmail(userInfoDTO.getEmail());
        userInfo.setCountry(userInfoDTO.getCountry());
        userInfo.setRegion(userInfoDTO.getRegion());
        userInfo.setCity(userInfoDTO.getCity());
        userInfo.setAddress(userInfoDTO.getAddress());
        userInfo.setAddressDetail(userInfoDTO.getAddressDetail());
        userInfo.setPostalCode(userInfoDTO.getPostalCode());
        userInfo.setPhone(userInfoDTO.getPhone());
        userInfo.setPhone2(userInfoDTO.getPhone2());

        // Actualizar la fecha de modificación
        userInfo.setUpdatedAt(java.time.LocalDate.now());

        // Guardar los cambios en la base de datos
        UserInfo updatedUserInfo = userInfoRepository.save(userInfo);

        return ResponseEntity.ok(updatedUserInfo);
    }

    // Endpoint para que el administrador pueda actualizar la información de cualquier usuario
    @PutMapping("/{userId}")
    public ResponseEntity<UserInfo> updateUserInfo(@PathVariable Long userId, @RequestBody UserInfoDTO userInfoDTO) {
        // Verificar si el administrador o el usuario tiene acceso para modificar esta información
        UserInfo userInfo = userInfoRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Información de usuario no encontrada para el usuario con ID: " + userId));

        // Actualizar la información del usuario
        userInfo.setType(userInfoDTO.getType());
        userInfo.setDocumentType(userInfoDTO.getDocumentType());
        userInfo.setDocumentNumber(userInfoDTO.getDocumentNumber());
        userInfo.setDocumentExp(userInfoDTO.getDocumentExp());
        userInfo.setExpCountry(userInfoDTO.getExpCountry());
        userInfo.setExpRegion(userInfoDTO.getExpRegion());
        userInfo.setExpCity(userInfoDTO.getExpCity());
        userInfo.setFirstName(userInfoDTO.getFirstName());
        userInfo.setMiddleName(userInfoDTO.getMiddleName());
        userInfo.setLastName(userInfoDTO.getLastName());
        userInfo.setSecondLastName(userInfoDTO.getSecondLastName());
        userInfo.setOtherNames(userInfoDTO.getOtherNames());
        userInfo.setLegalName(userInfoDTO.getLegalName());
        userInfo.setEmail(userInfoDTO.getEmail());
        userInfo.setCountry(userInfoDTO.getCountry());
        userInfo.setRegion(userInfoDTO.getRegion());
        userInfo.setCity(userInfoDTO.getCity());
        userInfo.setAddress(userInfoDTO.getAddress());
        userInfo.setAddressDetail(userInfoDTO.getAddressDetail());
        userInfo.setPostalCode(userInfoDTO.getPostalCode());
        userInfo.setPhone(userInfoDTO.getPhone());
        userInfo.setPhone2(userInfoDTO.getPhone2());

        // Actualizar la fecha de modificación
        userInfo.setUpdatedAt(java.time.LocalDate.now());

        // Guardar los cambios en la base de datos
        UserInfo updatedUserInfo = userInfoRepository.save(userInfo);

        return ResponseEntity.ok(updatedUserInfo);
    }

    // Endpoint para crear la información de usuario (solo si aún no existe)
@PostMapping
public ResponseEntity<UserInfo> createUserInfo(Authentication authentication, @RequestBody UserInfoDTO userInfoDTO) {
    String username = authentication.getName();

    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

    // Verificar si ya existe información para este usuario
    if (userInfoRepository.findByUserId(user.getId()).isPresent()) {
        return ResponseEntity.badRequest().body(null); // O puedes lanzar una excepción personalizada
    }

    UserInfo userInfo = new UserInfo();
    userInfo.setUser(user);
    userInfo.setType(userInfoDTO.getType());
    userInfo.setDocumentType(userInfoDTO.getDocumentType());
    userInfo.setDocumentNumber(userInfoDTO.getDocumentNumber());
    userInfo.setDocumentExp(userInfoDTO.getDocumentExp());
    userInfo.setExpCountry(userInfoDTO.getExpCountry());
    userInfo.setExpRegion(userInfoDTO.getExpRegion());
    userInfo.setExpCity(userInfoDTO.getExpCity());
    userInfo.setFirstName(userInfoDTO.getFirstName());
    userInfo.setMiddleName(userInfoDTO.getMiddleName());
    userInfo.setLastName(userInfoDTO.getLastName());
    userInfo.setSecondLastName(userInfoDTO.getSecondLastName());
    userInfo.setOtherNames(userInfoDTO.getOtherNames());
    userInfo.setLegalName(userInfoDTO.getLegalName());
    userInfo.setEmail(userInfoDTO.getEmail());
    userInfo.setCountry(userInfoDTO.getCountry());
    userInfo.setRegion(userInfoDTO.getRegion());
    userInfo.setCity(userInfoDTO.getCity());
    userInfo.setAddress(userInfoDTO.getAddress());
    userInfo.setAddressDetail(userInfoDTO.getAddressDetail());
    userInfo.setPostalCode(userInfoDTO.getPostalCode());
    userInfo.setPhone(userInfoDTO.getPhone());
    userInfo.setPhone2(userInfoDTO.getPhone2());

    // Fecha de creación
    userInfo.setCreatedAt(java.time.LocalDate.now());
    userInfo.setUpdatedAt(java.time.LocalDate.now());

    UserInfo savedUserInfo = userInfoRepository.save(userInfo);

    return ResponseEntity.ok(savedUserInfo);
}

}
