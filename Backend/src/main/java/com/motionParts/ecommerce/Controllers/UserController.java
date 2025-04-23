package com.motionParts.ecommerce.Controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.motionParts.ecommerce.Models.User;
import com.motionParts.ecommerce.services.UserService;
import com.motionParts.ecommerce.services.RoleService;
import com.motionParts.ecommerce.dto.RegisterRequest;
import com.motionParts.ecommerce.dto.RoleDTO;
import com.motionParts.ecommerce.dto.UserDTO;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    // ✅ Obtener todos los usuarios
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return ResponseEntity.ok(user);
    }

    // ✅ Crear un nuevo usuario
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid RegisterRequest request) {
        User user = userService.createUser(request.getUser(), request.getUserInfo());
        return ResponseEntity.ok(user);
    }

    // ✅ Actualizar un usuario existente
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody @Valid UserDTO userDTO, Authentication authentication) {
        Long currentUserId = (Long) authentication.getDetails(); // 👉🏼 Igual que en OrderController

        // Log para depurar (opcional)
        System.out.println("UserId from Authentication: " + currentUserId);

        if (currentUserId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        boolean isAdmin = authentication.getAuthorities().stream()
            .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN")); // 👈🏼 Cuidado: ROLE_ADMIN

        if (!currentUserId.equals(id) && !isAdmin) {
            return ResponseEntity.status(403).build(); // Forbidden si no es él mismo o admin
        }

        User updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    // ✅ Eliminar un usuario por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Authentication authentication) {
        Long currentUserId = (Long) authentication.getDetails();

        if (currentUserId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        boolean isAdmin = authentication.getAuthorities().stream()
            .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        if (!currentUserId.equals(id) && !isAdmin) {
            return ResponseEntity.status(403).build(); // Forbidden si no es él mismo o admin
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();  // Retorna respuesta no content al eliminar
    }

    // ✅ Obtener todos los roles
    @GetMapping("/roles")
    public List<RoleDTO> getAllRoles() {
        return roleService.getAllRoles();
    }
}
