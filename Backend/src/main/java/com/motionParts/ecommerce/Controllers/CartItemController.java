package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.CartItemDTO;
import com.motionParts.ecommerce.services.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getAllCartItems() {
        return ResponseEntity.ok(cartItemService.getAllCartItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartItemDTO> getCartItemById(@PathVariable Long id) {
        return ResponseEntity.ok(cartItemService.getCartItemById(id));
    }

    @GetMapping("/cart/{cartId}")
    public ResponseEntity<List<CartItemDTO>> getCartItemsByCartId(@PathVariable Long cartId) {
        return ResponseEntity.ok(cartItemService.getCartItemsByCartId(cartId));
    }

    @PostMapping
    public ResponseEntity<CartItemDTO> createCartItem(
            @RequestParam Long cartId,
            @RequestParam Long productId,
            @RequestParam int quantity) {

        CartItemDTO cartItem = cartItemService.addProductToCart(cartId, productId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemDTO> updateCartItem(@PathVariable Long id, @RequestParam int quantity) {
        CartItemDTO updatedCartItem = cartItemService.updateCartItemQuantity(id, quantity);
        return ResponseEntity.ok(updatedCartItem);
    }
}
