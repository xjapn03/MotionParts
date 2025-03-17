package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.Models.ShoppingCart;
import com.motionParts.ecommerce.services.ShoppingCartService; // <-- IMPORTANTE
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/shoppingCarts")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @GetMapping
    public List<ShoppingCart> getAllCarts() {
        return shoppingCartService.getAllCarts();
    }

    @GetMapping("/{id}")
    public ShoppingCart getCartById(@PathVariable Long id) {
        return shoppingCartService.getCartById(id);
    }

    @GetMapping("/client/{clientId}")
    public List<ShoppingCart> getCartsByClientId(@PathVariable Long clientId) {
        return shoppingCartService.getCartsByClientId(clientId);
    }

    @PostMapping
    public ShoppingCart createCart(@RequestBody ShoppingCart cart) {
        return shoppingCartService.saveCart(cart);
    }

    @DeleteMapping("/{id}")
    public void deleteCart(@PathVariable Long id) {
        shoppingCartService.deleteCart(id);
    }

    @GetMapping("/{cartId}/total")
    public double getCartTotal(@PathVariable Long cartId) {
        return shoppingCartService.getTotalCartPrice(cartId);
    }

}