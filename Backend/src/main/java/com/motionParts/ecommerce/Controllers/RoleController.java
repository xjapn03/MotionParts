package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.RoleDTO;
import com.motionParts.ecommerce.services.RoleService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:4200") // Permite peticiones desde Angular
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // Obtener todos los roles
    @GetMapping
    public List<RoleDTO> getAllRoles() {
        return roleService.getAllRoles();
    }

    // Obtener un rol por ID
    @GetMapping("/{id}")
    public RoleDTO getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id);
    }

    @PostMapping
    public ResponseEntity<RoleDTO> createRole(@RequestBody RoleDTO roleDTO) {
        if (roleDTO.getName() == null || roleDTO.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(roleService.createRole(roleDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleDTO> updateRole(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        if (!roleService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(roleService.updateRole(id, roleDTO));
    }

    // Eliminar un rol
    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
    }

    // Asignar un rol a un usuario
    public ResponseEntity<String> assignRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
    try {
        roleService.assignRoleToUser(userId, roleId);
        return ResponseEntity.ok("Rol asignado correctamente.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al asignar el rol.");
    }
    }

    // Remover un rol de un usuario
    public ResponseEntity<String> removeRoleFromUser(@PathVariable Long userId, @PathVariable Long roleId) {
        try {
            roleService.removeRoleFromUser(userId, roleId);
            return ResponseEntity.ok("Rol removido correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al remover el rol.");
        }
    }
}
