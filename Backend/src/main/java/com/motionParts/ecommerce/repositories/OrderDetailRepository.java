package com.motionParts.ecommerce.repositories;

import com.motionParts.ecommerce.Models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;  // ✅ Importación correcta

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderId(Long orderId);
    Optional<OrderDetail> findById(Long id);
}
