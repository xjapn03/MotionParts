package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.Models.ShoppingCart;
import com.motionParts.ecommerce.services.ShoppingCartService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/shopping-carts")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @GetMapping
    public List<ShoppingCart> listAllCarts() { // Cambio de getAllCarts -> listAllCarts
        return shoppingCartService.listAllCarts();
    }

    @GetMapping("/{id}")
    public ShoppingCart findCartById(@PathVariable Long id) { // Cambio de getCartById -> findCartById
        return shoppingCartService.findCartById(id);
    }

    @GetMapping("/client/{clientId}")
    public List<ShoppingCart> findCartsByClient(@PathVariable Long clientId) { // Cambio de getCartsByClientId -> findCartsByClient
        return shoppingCartService.findCartsByClient(clientId);
    }

    @PostMapping
    public ShoppingCart createShoppingCart(@RequestBody ShoppingCart cart) { // Cambio de createCart -> createShoppingCart
        return shoppingCartService.createShoppingCart(cart);
    }

    @DeleteMapping("/{id}")
    public void removeCart(@PathVariable Long id) { // Cambio de deleteCart -> removeCart
        shoppingCartService.removeCart(id);
    }

    @GetMapping("/{cartId}/total")
    public double calculateCartTotal(@PathVariable Long cartId) { // Cambio de getCartTotal -> calculateCartTotal
        return shoppingCartService.calculateCartTotal(cartId);
    }
}
