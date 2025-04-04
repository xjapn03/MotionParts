package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.dto.RoleDTO;
import com.motionParts.ecommerce.Models.Role;
import com.motionParts.ecommerce.Models.User;
import com.motionParts.ecommerce.repositories.RoleRepository;
import com.motionParts.ecommerce.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;

@Service
public class RoleService {
    
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    public RoleService(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    // Convertir Role a RoleDTO
    private RoleDTO convertToDto(Role role) {
        Set<Long> userIds = role.getUsers().stream()
            .map(User::getId)  // Mejor usar el ID del usuario
            .collect(Collectors.toSet());
    
        return new RoleDTO(role.getId(), role.getName(), userIds);
    }

    // Convertir RoleDTO a Role
    private Role convertToEntity(RoleDTO roleDTO) {
    Role role = new Role(roleDTO.getName());  // Aquí solo pasamos el nombre
    role.setId(roleDTO.getId()); // Si necesitas el id
    return role;
}

    // Obtener todos los roles (devuelve lista de DTOs)
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Obtener un rol por ID
    public RoleDTO getRoleById(Long id) {
        return roleRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));  // Usando RuntimeException
    }

    // Buscar rol por nombre
    public RoleDTO findByName(String name) {
        return roleRepository.findByName(name)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));  // Usando RuntimeException
    }

    // Crear un nuevo rol
    public RoleDTO createRole(RoleDTO roleDTO) {
        Role role = convertToEntity(roleDTO);
        return convertToDto(roleRepository.save(role));
    }

    // Editar un rol existente
    public RoleDTO updateRole(Long id, RoleDTO updatedRoleDTO) {
        return roleRepository.findById(id)
                .map(role -> {
                    role.setName(updatedRoleDTO.getName());
                    return convertToDto(roleRepository.save(role));
                })
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));  // Usando RuntimeException
    }

    // Eliminar un rol
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("El rol no existe");  // Usando RuntimeException
        }
        roleRepository.deleteById(id);
    }

    // Asignar un rol a un usuario
    public void assignRoleToUser(Long userId, Long roleId) {
        User user = getUserAndRole(userId, roleId);
        user.getRoles().add(roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Rol no encontrado")));  // Usando RuntimeException
        userRepository.save(user);
    }

    // Remover un rol de un usuario
    public void removeRoleFromUser(Long userId, Long roleId) {
        User user = getUserAndRole(userId, roleId);
        user.getRoles().remove(roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Rol no encontrado")));  // Usando RuntimeException
        userRepository.save(user);
    }

    //comprobar si el rol con ese id existe antes de actualizarlo
    public boolean existsById(Long id) {
        return roleRepository.existsById(id);
    }    

    // Método común para obtener el usuario y rol
    private User getUserAndRole(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));  // Usando RuntimeException
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));  // Usando RuntimeException
        return user;
    }
}
