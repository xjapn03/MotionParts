package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.dto.UserDTO;
import com.motionParts.ecommerce.Models.Role;
import com.motionParts.ecommerce.Models.User;
import com.motionParts.ecommerce.Models.UserRole;
import com.motionParts.ecommerce.repositories.RoleRepository;
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
    private BCryptPasswordEncoder passwordEncoder; // Para encriptar la contraseña

    // Crear un nuevo usuario
    @Transactional
    public User createUser(UserDTO userDTO) {
    User user = new User();
    user.setUsername(userDTO.getUsername());
    user.setEmail(userDTO.getEmail());
    user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

    // Asignación de roles
    for (Long roleId : userDTO.getRoleId()) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));
        user.getRoles().add(role);  // Añadimos el rol directamente al Set de roles del usuario
    }

    return userRepository.save(user);
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
