package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.CartItem;
import com.motionParts.ecommerce.Models.ShoppingCart;
import com.motionParts.ecommerce.Models.ShoppingCartStatus;
import com.motionParts.ecommerce.Models.User;
import com.motionParts.ecommerce.dto.CartItemDTO;
import com.motionParts.ecommerce.dto.ShoppingCartDTO;
import com.motionParts.ecommerce.repositories.CartItemRepository;
import com.motionParts.ecommerce.repositories.ShoppingCartRepository;
import com.motionParts.ecommerce.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShoppingCartService {

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Obtener todos los carritos en formato DTO
    public List<ShoppingCartDTO> getAllShoppingCartsDTO() {
        List<ShoppingCart> carts = shoppingCartRepository.findAll();
        return carts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ShoppingCartDTO getShoppingCartByUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
    
        ShoppingCart cart = shoppingCartRepository.findByUserAndStatus(user, ShoppingCartStatus.ACTIVE)
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No se encontró un carrito activo para el usuario " + userId));
    
        return convertToDTO(cart);
    }
    

    public ShoppingCartDTO addToCart(Long userId, CartItemDTO cartItemDto) {
        // Verificar si el usuario existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
    
        // Obtener el carrito activo del usuario o crearlo si no existe
        ShoppingCart cart = shoppingCartRepository.findByUserAndStatus(user, ShoppingCartStatus.ACTIVE)
                .stream().findFirst()
                .orElseGet(() -> {
                    ShoppingCart newCart = new ShoppingCart(user, ShoppingCartStatus.ACTIVE);
                    return shoppingCartRepository.save(newCart);
                });
    
        // Buscar si el producto ya está en el carrito
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(cartItemDto.getProduct().getId()))
                .findFirst()
                .orElse(null);
    
        if (existingItem != null) {
            // Si el producto ya está en el carrito, aumentar la cantidad
            existingItem.setQuantity(existingItem.getQuantity() + cartItemDto.getQuantity());
            existingItem.setTotalPrice(existingItem.getQuantity() * existingItem.getUnitPrice());
        } else {
            // Si no existe, crear un nuevo CartItem y agregarlo al carrito
            CartItem newItem = new CartItem(
                    cart,
                    cartItemDto.getProduct(),
                    cartItemDto.getQuantity(),
                    cartItemDto.getUnitPrice(),
                    cartItemDto.getQuantity() * cartItemDto.getUnitPrice()
            );
            cart.getCartItems().add(newItem);
            cartItemRepository.save(newItem);
        }
    
        // Guardar el carrito actualizado
        shoppingCartRepository.save(cart);
    
        // Retornar el carrito actualizado en formato DTO
        return convertToDTO(cart);
    }

    // ✅ Buscar carrito por ID
    public ShoppingCartDTO getCartById(Long id) {
        ShoppingCart cart = shoppingCartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con ID: " + id));
        return convertToDTO(cart);
    }

    // ✅ Buscar carrito activo del usuario
    public ShoppingCartDTO findActiveCartByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
    
        ShoppingCart cart = shoppingCartRepository.findByUserAndStatus(user, ShoppingCartStatus.ACTIVE)
                .stream().findFirst() // ✅ Tomamos el primer carrito si existe
                .orElseThrow(() -> new RuntimeException("No se encontró un carrito activo para el usuario."));
    
        return convertToDTO(cart);
    }

    // ✅ Crear un nuevo carrito solo si el usuario no tiene uno activo
    public ShoppingCartDTO createShoppingCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
    
        List<ShoppingCart> existingCarts = shoppingCartRepository.findByUserAndStatus(user, ShoppingCartStatus.ACTIVE);
        if (!existingCarts.isEmpty()) { // ✅ Verificamos si la lista tiene elementos
            throw new RuntimeException("El usuario ya tiene un carrito activo.");
        }
    
        ShoppingCart cart = new ShoppingCart(user, ShoppingCartStatus.ACTIVE);
        shoppingCartRepository.save(cart);
        return convertToDTO(cart);
    }

    // ✅ Completar un carrito
    public ShoppingCartDTO completeShoppingCart(Long id) {
        ShoppingCart cart = shoppingCartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con ID: " + id));

        if (!cart.getStatus().equals(ShoppingCartStatus.ACTIVE)) {
            throw new RuntimeException("Solo se pueden completar carritos activos.");
        }

        cart.setStatus(ShoppingCartStatus.COMPLETED);
        shoppingCartRepository.save(cart);
        return convertToDTO(cart);
    }

    // ✅ Cancelar un carrito
    public ShoppingCartDTO cancelShoppingCart(Long id) {
        ShoppingCart cart = shoppingCartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con ID: " + id));

        if (!cart.getStatus().equals(ShoppingCartStatus.ACTIVE)) {
            throw new RuntimeException("Solo se pueden cancelar carritos activos.");
        }

        cart.setStatus(ShoppingCartStatus.CANCELLED);
        shoppingCartRepository.save(cart);
        return convertToDTO(cart);
    }

    // ✅ Eliminar un carrito solo si está cancelado
    public void removeCart(Long id) {
        ShoppingCart cart = shoppingCartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con ID: " + id));

        if (!cart.getStatus().equals(ShoppingCartStatus.CANCELLED)) {
            throw new RuntimeException("Solo se pueden eliminar carritos cancelados.");
        }

        shoppingCartRepository.deleteById(id);
    }

    // ✅ Calcular el total del carrito
    public double calculateCartTotal(Long cartId) {
        List<CartItem> cartItems = cartItemRepository.findByShoppingCartId(cartId);
        return cartItems.stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
                .sum();
    }

    // ✅ Convertir ShoppingCart en ShoppingCartDTO
    private ShoppingCartDTO convertToDTO(ShoppingCart cart) {
        List<CartItemDTO> cartItemDTOs = cart.getCartItems().stream()
                .map(item -> new CartItemDTO(
                    item.getId(),
                    cart.getId(),
                    item.getProduct(), // ✅ Pasamos el objeto `Product`
                    item.getQuantity(),
                    item.getUnitPrice(),
                    item.getTotalPrice()
                )).collect(Collectors.toList());

        double totalCartPrice = cartItemDTOs.stream().mapToDouble(CartItemDTO::getTotalPrice).sum();

        return new ShoppingCartDTO(
                cart.getId(),
                cart.getUser().getUsername(),
                cartItemDTOs,
                cart.getStatus().name(),
                totalCartPrice
        );
    }


    public ShoppingCartDTO removeCartItem(Long userId, Long productId) {
        // Buscar al usuario
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
    
        // Buscar el carrito activo del usuario
        ShoppingCart cart = shoppingCartRepository.findByUserAndStatus(user, ShoppingCartStatus.ACTIVE)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado para el usuario " + userId));
    
        // Eliminar el producto del carrito
        cart.getCartItems().removeIf(item -> item.getProduct().getId().equals(productId));
    
        // Guardar el carrito actualizado
        shoppingCartRepository.save(cart);
    
        // Convertir a DTO sin usar mappers
        return convertToDTO(cart);
    }

    public ShoppingCartDTO updateCartItemQuantity(Long userId, Long productId, int newQuantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
    
        ShoppingCart cart = shoppingCartRepository.findByUserAndStatus(user, ShoppingCartStatus.ACTIVE)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No se encontró un carrito activo para el usuario " + userId));
    
        CartItem itemToUpdate = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Producto no encontrado en el carrito"));
    
        if (newQuantity <= 0) {
            cart.getCartItems().remove(itemToUpdate);
            cartItemRepository.delete(itemToUpdate);
        } else {
            itemToUpdate.setQuantity(newQuantity);
            itemToUpdate.setTotalPrice(itemToUpdate.getQuantity() * itemToUpdate.getUnitPrice());
    
            // Asegura que la relación se mantenga
            cart.getCartItems().remove(itemToUpdate);
            cart.getCartItems().add(itemToUpdate);
    
            cartItemRepository.save(itemToUpdate);
        }
    
        // 🔹 Guarda el carrito actualizado
        shoppingCartRepository.save(cart);
    
        return convertToDTO(cart);
    }

    public void clearUserCart(Long userId) {
        // ✅ Busca el carrito activo del usuario
        ShoppingCart cart = shoppingCartRepository.findByUserIdAndStatus(userId, ShoppingCartStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No se encontró un carrito activo para el usuario"));

        // ✅ Limpia los productos en el carrito
        cart.getCartItems().clear();

        // ✅ Guarda el carrito vacío en la base de datos
        shoppingCartRepository.save(cart);
    }
    
        

}
