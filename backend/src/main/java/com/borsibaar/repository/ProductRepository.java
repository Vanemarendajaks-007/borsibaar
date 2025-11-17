package com.borsibaar.repository;

import com.borsibaar.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
  boolean existsByOrganizationIdAndNameIgnoreCase(Long organizationId, String name);

  @Query(value = """
        SELECT DISTINCT p.*
        FROM products p
        JOIN inventory inv ON inv.product_id = p.id
        JOIN categories cat ON p.category_id = cat.id
        WHERE
          cat.dynamic_pricing = TRUE
          -- Org had at least one SALE in the last minute
          AND EXISTS (
            SELECT 1
            FROM inventory_transactions it_org
            JOIN inventory i_org ON i_org.id = it_org.inventory_id
            WHERE i_org.organization_id = inv.organization_id
              AND it_org.transaction_type = 'SALE'
              AND it_org.created_at >= (CURRENT_TIMESTAMP - INTERVAL '1 minute')
          )
          -- This product had no SALE in the last minute
          AND NOT EXISTS (
            SELECT 1
            FROM inventory_transactions it_self
            WHERE it_self.inventory_id = inv.id
              AND it_self.transaction_type = 'SALE'
              AND it_self.created_at >= (CURRENT_TIMESTAMP - INTERVAL '1 minute')
          )
      """, nativeQuery = true)
  List<Product> findByActiveOrgAndInactiveSalesLastMinute();
}
