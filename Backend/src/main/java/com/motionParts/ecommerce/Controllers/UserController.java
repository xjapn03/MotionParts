package com.motionParts.ecommerce.Controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.motionParts.ecommerce.Models.User;
import com.motionParts.ecommerce.services.UserService;
import com.motionParts.ecommerce.services.RoleService;
import com.motionParts.ecommerce.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import javax.validation.Valid;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    // Obtener todos los usuarios
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Obtener un usuario por ID
    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return ResponseEntity.ok(user);
    }

    // Crear un nuevo usuario
    @PostMapping
    public User createUser(@RequestBody @Valid UserDTO userDTO) {
        return userService.createUser(userDTO);  // Llamamos a createUser, no a updateUser
    }

    // Actualizar un usuario existente
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody @Valid UserDTO userDTO) {
        return userService.updateUser(id, userDTO);  // Llamamos a updateUser pasando el id y el DTO
    }

    // Eliminar un usuario por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();  // Retorna respuesta no content al eliminar
    }
}