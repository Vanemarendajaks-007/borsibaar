package com.borsibaar.repository;

import com.borsibaar.entity.Role;
import com.borsibaar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    /**
     * Find user by email with role eagerly fetched.
     * Used by JWT authentication filter to avoid LazyInitializationException.
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.role WHERE u.email = :email")
    Optional<User> findByEmailWithRole(@Param("email") String email);

    List<User> findByOrganizationId(Long organizationId);

    List<User> findByOrganizationIdAndRole(Long organizationId, Role adminRole);
}
