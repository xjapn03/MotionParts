package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.ShoppingCartDTO;
import com.motionParts.ecommerce.dto.CartItemDTO;
import com.motionParts.ecommerce.services.ShoppingCartService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/shopping-carts")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    // ✅ Obtener el carrito activo del usuario autenticado 
    @PostMapping("/users/{userId}/add")
    public ResponseEntity<ShoppingCartDTO> addToCart(
            @PathVariable Long userId,
            @RequestBody CartItemDTO cartItemDto) { // ✅ Ahora usa CartItemDTO
        ShoppingCartDTO updatedCart = shoppingCartService.addToCart(userId, cartItemDto);
        return ResponseEntity.ok(updatedCart);
    }
    
    @GetMapping("/users/{userId}")
    public ResponseEntity<ShoppingCartDTO> getShoppingCartByUser(@PathVariable Long userId) {
        ShoppingCartDTO cartDTO = shoppingCartService.getShoppingCartByUser(userId);
        return ResponseEntity.ok(cartDTO);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ShoppingCartDTO> findCartById(@PathVariable Long id) {
        ShoppingCartDTO cartDTO = shoppingCartService.getCartById(id);
        return ResponseEntity.ok(cartDTO);
    }

    @PostMapping
    public ResponseEntity<ShoppingCartDTO> createShoppingCart(@RequestParam Long userId) {
        ShoppingCartDTO cartDTO = shoppingCartService.createShoppingCart(userId);
        return ResponseEntity.ok(cartDTO);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ShoppingCartDTO> completeShoppingCart(@PathVariable Long id) {
        shoppingCartService.completeShoppingCart(id);
        return ResponseEntity.ok(shoppingCartService.getCartById(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ShoppingCartDTO> cancelShoppingCart(@PathVariable Long id) {
        shoppingCartService.cancelShoppingCart(id);
        return ResponseEntity.ok(shoppingCartService.getCartById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeCart(@PathVariable Long id) {
        shoppingCartService.removeCart(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{cartId}/total")
    public ResponseEntity<Double> calculateCartTotal(@PathVariable Long cartId) {
        return ResponseEntity.ok(shoppingCartService.calculateCartTotal(cartId));
    }
}
