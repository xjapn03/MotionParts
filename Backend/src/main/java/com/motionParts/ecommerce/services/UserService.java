package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.dto.UserDTO;
import com.motionParts.ecommerce.dto.UserInfoDTO;
import com.motionParts.ecommerce.Models.Role;
import com.motionParts.ecommerce.Models.User;
import com.motionParts.ecommerce.Models.UserInfo;
//import com.motionParts.ecommerce.Models.UserRole;
import com.motionParts.ecommerce.repositories.RoleRepository;
import com.motionParts.ecommerce.repositories.UserInfoRepository;
import com.motionParts.ecommerce.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // Para encriptar la contraseña

    // Crear un nuevo usuario
    @Transactional
    public User createUser(UserDTO userDTO, UserInfoDTO userInfoDTO) {
        // Crear y guardar el User (tabla users)
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
    
        // Si no se proporcionan roles, asignar el rol por defecto (id = 2)
        if (userDTO.getRoleId() == null || userDTO.getRoleId().isEmpty()) {
            // Asignar el rol 'USER' con id = 2 por defecto
            Role defaultRole = roleRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Rol 'USER' no encontrado"));
            user.getRoles().add(defaultRole);
        } else {
            // Asignación de roles proporcionados
            for (Long roleId : userDTO.getRoleId()) {
                Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));
                user.getRoles().add(role);  // Añadimos el rol directamente al Set de roles del usuario
            }
        }

        user = userRepository.save(user); // Guardamos el usuario en la tabla `users`
        
        // Crear y guardar la información adicional en la tabla user_info
        UserInfo userInfo = new UserInfo();
        userInfo.setUser(user);  // Relacionamos el User con el UserInfo (foreign key)
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
        
        userInfoRepository.save(userInfo);  // Guardamos la información adicional en la tabla `user_info`

        return user;
    }


    // Actualizar un usuario existente
    @Transactional
    public User updateUser(Long userId, UserDTO userDTO) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    
    user.setUsername(userDTO.getUsername());
    user.setEmail(userDTO.getEmail());
    user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Encriptar la nueva contraseña

    // Limpiar y actualizar los roles
    user.getRoles().clear(); // Limpiar roles existentes
    for (Long roleId : userDTO.getRoleId()) {  // Asegúrate de que 'getRoleId()' sea el nombre correcto
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));
        user.getRoles().add(role);  // Agregar un nuevo rol
    }

    return userRepository.save(user);
    }


    // Obtener todos los usuarios
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Obtener un usuario por ID
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    // Eliminar un usuario
    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
