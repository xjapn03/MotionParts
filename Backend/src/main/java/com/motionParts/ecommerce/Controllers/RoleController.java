package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.RoleDTO;
import com.motionParts.ecommerce.services.RoleService;
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

    // Crear un nuevo rol
    @PostMapping
    public RoleDTO createRole(@RequestBody RoleDTO roleDTO) {
        return roleService.createRole(roleDTO);
    }

    // Actualizar un rol existente
    @PutMapping("/{id}")
    public RoleDTO updateRole(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        return roleService.updateRole(id, roleDTO);
    }

    // Eliminar un rol
    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
    }

    // Asignar un rol a un usuario
    @PostMapping("/assign/{userId}/{roleId}")
    public void assignRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        roleService.assignRoleToUser(userId, roleId);
    }

    // Remover un rol de un usuario
    @PostMapping("/remove/{userId}/{roleId}")
    public void removeRoleFromUser(@PathVariable Long userId, @PathVariable Long roleId) {
        roleService.removeRoleFromUser(userId, roleId);
    }
}
