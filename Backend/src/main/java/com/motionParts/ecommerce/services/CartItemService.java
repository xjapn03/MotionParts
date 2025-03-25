package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.CartItem;
import com.motionParts.ecommerce.Models.ShoppingCart;
import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.dto.CartItemDTO;
import com.motionParts.ecommerce.repositories.CartItemRepository;
import com.motionParts.ecommerce.repositories.ShoppingCartRepository;
import com.motionParts.ecommerce.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItemDTO> getAllCartItems() {
        List<CartItem> cartItems = cartItemRepository.findAll();
        return cartItems.stream().map(this::convertToDTO).toList();
    }

    public CartItemDTO getCartItemById(Long id) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item no encontrado con ID: " + id));
        return convertToDTO(cartItem);
    }

    public List<CartItemDTO> getCartItemsByCartId(Long cartId) {
        List<CartItem> cartItems = cartItemRepository.findByShoppingCartId(cartId);
        return cartItems.stream().map(this::convertToDTO).toList();
    }

    @Transactional
    public CartItemDTO addProductToCart(Long cartId, Long productId, int quantity) {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con ID: " + cartId));
    
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productId));
    
        if (product.getStock() < quantity) {
            throw new RuntimeException("Stock insuficiente para el producto ID: " + productId);
        }
    
        Optional<CartItem> existingCartItem = cartItemRepository.findByShoppingCartAndProduct(shoppingCart, product);
    
        CartItem cartItem;
        if (existingCartItem.isPresent()) {
            cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            double unitPrice = product.getPrice();
            double totalPrice = unitPrice * quantity;
            cartItem = new CartItem(shoppingCart, product, quantity, unitPrice, totalPrice);
        }
    
        cartItemRepository.save(cartItem);
    
        // 🔹 No necesitas setTotal, simplemente guarda el carrito si deseas persistir cambios
        shoppingCartRepository.save(shoppingCart);
    
        return convertToDTO(cartItem);
    }
    

    @Transactional
    public CartItemDTO updateCartItemQuantity(Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado con ID: " + cartItemId));

        if (quantity <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0");
        }

        cartItem.setQuantity(quantity);
        cartItem.setTotalPrice(cartItem.getUnitPrice() * quantity);
        cartItemRepository.save(cartItem);

        // Actualiza el total del carrito al cambiar la cantidad de un ítem
        ShoppingCart shoppingCart = cartItem.getShoppingCart();
        updateCartTotal(shoppingCart);

        shoppingCartRepository.save(shoppingCart);

        return convertToDTO(cartItem);
    }

    @Transactional
    public void deleteCartItem(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("No se puede eliminar. Item no encontrado con ID: " + cartItemId));

        ShoppingCart shoppingCart = cartItem.getShoppingCart();
        cartItemRepository.delete(cartItem);

        // 🔥 Actualizar el total del carrito después de eliminar un ítem
        updateCartTotal(shoppingCart);
        shoppingCartRepository.save(shoppingCart);
    }

    private void updateCartTotal(ShoppingCart shoppingCart) {
        shoppingCartRepository.save(shoppingCart);
    }
    

    private CartItemDTO convertToDTO(CartItem cartItem) {
        return new CartItemDTO(
                cartItem.getId(),
                cartItem.getShoppingCart().getId(),
                cartItem.getProduct(),
                cartItem.getQuantity(),
                cartItem.getUnitPrice(),
                cartItem.getTotalPrice()
        );
    }
}
