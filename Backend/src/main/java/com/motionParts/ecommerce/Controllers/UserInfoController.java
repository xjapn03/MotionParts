package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.Models.UserInfo;
import com.motionParts.ecommerce.services.UserInfoService;
import com.motionParts.ecommerce.dto.UserInfoDTO;
import com.motionParts.ecommerce.Models.User;
import com.motionParts.ecommerce.repositories.UserRepository;
import com.motionParts.ecommerce.repositories.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

//import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;


@RestController
@RequestMapping("/api/user-info")
public class UserInfoController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private UserInfoService userInfoService;

    // Endpoint para obtener la info del usuario autenticado
    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> getMyUserInfo(Authentication authentication) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

        Optional<UserInfo> optionalUserInfo = userInfoRepository.findByUserId(user.getId());

        if (optionalUserInfo.isPresent()) {
            // Convertir la entidad UserInfo a UserInfoDTO y devolver
            return ResponseEntity.ok(userInfoService.convertToDTO(optionalUserInfo.get()));
        } else {
            return ResponseEntity.ok(null); // Devuelve 200 OK con cuerpo null
        }
    }

    @PutMapping("/admin/{userId}")
    public ResponseEntity<UserInfoDTO> updateUserInfo(@PathVariable Long userId, @RequestBody UserInfoDTO dto) {
        // Buscar el user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + userId));

        // Obtener o crear el UserInfo
        UserInfo userInfo = userInfoRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                UserInfo newInfo = new UserInfo();
                newInfo.setUser(user); // ¡clave!
                return newInfo;
            });

        // Guardar temporalmente el ID de UserInfo si existe
        Long userInfoId = userInfo.getId();

        // Si ya existe, llama a tu método actual
        if (userInfoId != null) {
            return ResponseEntity.ok(userInfoService.convertToDTO( userInfoService.updateUserInfo(userInfoId, dto) 
            ));}

        userInfo.setType(dto.getType());
        userInfo.setDocumentType(dto.getDocumentType());
        userInfo.setDocumentNumber(dto.getDocumentNumber());
        userInfo.setDocumentExp(dto.getDocumentExp());
        userInfo.setExpCountry(dto.getExpCountry());
        userInfo.setExpRegion(dto.getExpRegion());
        userInfo.setExpCity(dto.getExpCity());
        userInfo.setFirstName(dto.getFirstName());
        userInfo.setMiddleName(dto.getMiddleName());
        userInfo.setLastName(dto.getLastName());
        userInfo.setSecondLastName(dto.getSecondLastName());
        userInfo.setOtherNames(dto.getOtherNames());
        userInfo.setLegalName(dto.getLegalName());
        userInfo.setEmail(dto.getEmail());
        userInfo.setCountry(dto.getCountry());
        userInfo.setRegion(dto.getRegion());
        userInfo.setCity(dto.getCity());
        userInfo.setAddress(dto.getAddress());
        userInfo.setAddressDetail(dto.getAddressDetail());
        userInfo.setPostalCode(dto.getPostalCode());
        userInfo.setPhone(dto.getPhone());
        userInfo.setPhone2(dto.getPhone2());

        return ResponseEntity.ok(userInfoService.convertToDTO(userInfoRepository.save(userInfo)));
    }

        //actualizar user info personal
    @PutMapping("/me")
    public ResponseEntity<UserInfoDTO> updateMyUserInfo(Authentication authentication, @RequestBody UserInfoDTO userInfoDTO) {
        System.out.println("Datos recibidos en el DTO: " + userInfoDTO);
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

        // Buscar o crear el UserInfo
        UserInfo userInfo = userInfoRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserInfo newUser = new UserInfo();
                    newUser.setUser(user); // muy importante para vincular
                    return newUser;
                });

        // Setear los valores desde el DTO
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
        userInfo.setUpdatedAt(LocalDateTime.now());

        // Guardar
        UserInfo updatedUserInfo = userInfoRepository.save(userInfo);

        // Convertir a DTO antes de devolver
        return ResponseEntity.ok(userInfoService.convertToDTO(updatedUserInfo));
    }

    // Endpoint para crear la información de usuario (solo si aún no existe)
    @PostMapping
    public ResponseEntity<UserInfoDTO> createUserInfo(Authentication authentication, @RequestBody UserInfoDTO userInfoDTO) {
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
        userInfo.setCreatedAt(LocalDateTime.now());
        userInfo.setUpdatedAt(LocalDateTime.now());

        UserInfo savedUserInfo = userInfoRepository.save(userInfo);

        // Convertir a DTO antes de devolver
        return ResponseEntity.ok(userInfoService.convertToDTO(savedUserInfo));
    }
}

