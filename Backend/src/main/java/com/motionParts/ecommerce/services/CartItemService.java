package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.CartItem;
import com.motionParts.ecommerce.repositories.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemService {
    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    public CartItem getCartItemById(Long id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item no encontrado con ID: " + id));
    }

    public List<CartItem> getCartItemsByCartId(Long cartId) {
        return cartItemRepository.findByShoppingCartId(cartId);
    }

    public CartItem saveCartItem(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateCartItem(Long id, CartItem cartItemDetails) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item no encontrado con ID: " + id));

        cartItem.setQuantity(cartItemDetails.getQuantity());
        cartItem.setUnitPrice(cartItemDetails.getUnitPrice());

        return cartItemRepository.save(cartItem);
    }

    public void deleteCartItem(Long id) {
        if (!cartItemRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Item no encontrado con ID: " + id);
        }
        cartItemRepository.deleteById(id);
    }
}
