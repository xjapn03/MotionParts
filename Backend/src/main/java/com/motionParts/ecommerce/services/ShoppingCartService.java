package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.CartItem;
import com.motionParts.ecommerce.Models.ShoppingCart;
import com.motionParts.ecommerce.repositories.CartItemRepository;
import com.motionParts.ecommerce.repositories.ShoppingCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartService {

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    // Obtener todos los carritos
    public List<ShoppingCart> listAllCarts() {
        return shoppingCartRepository.findAll();
    }

    // Obtener carrito por ID
    public ShoppingCart findCartById(Long id) {
        return shoppingCartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con ID: " + id));
    }

    // Obtener carritos por ID de cliente
    public List<ShoppingCart> findCartsByClient(Long clientId) {
        return shoppingCartRepository.findByClientId(clientId);
    }

    // Crear o actualizar carrito
    public ShoppingCart createShoppingCart(ShoppingCart cart) {
        return shoppingCartRepository.save(cart);
    }

    // Eliminar carrito por ID
    public void removeCart(Long id) {
        if (!shoppingCartRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Carrito no encontrado con ID: " + id);
        }
        shoppingCartRepository.deleteById(id);
    }

    // Calcular el total del carrito
    public double calculateCartTotal(Long cartId) {
        Optional<ShoppingCart> cart = shoppingCartRepository.findById(cartId);
        if (cart.isEmpty()) {
            throw new RuntimeException("Carrito no encontrado con ID: " + cartId);
        }

        List<CartItem> cartItems = cartItemRepository.findByShoppingCartId(cartId);
        return cartItems.stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
                .sum();
    }
}

