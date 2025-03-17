package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.CartItem;
import com.motionParts.ecommerce.Models.ShoppingCart;
import com.motionParts.ecommerce.repositories.CartItemRepository;
import com.motionParts.ecommerce.repositories.ShoppingCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShoppingCartService {
    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    public double getTotalCartPrice(Long cartId) {
        List<CartItem> cartItems = cartItemRepository.findByShoppingCartId(cartId);
        return cartItems.stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnit_price())
                .sum();
    }
}

