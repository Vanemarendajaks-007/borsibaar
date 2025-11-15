package com.borsibaar.util;

import com.borsibaar.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

/**
 * Utility class for accessing security context and authenticated user
 * information.
 */
public class SecurityUtils {

    /**
     * Gets the currently authenticated user from the SecurityContext.
     *
     * @return The authenticated User
     * @throws ResponseStatusException if user is not authenticated or not a User
     *                                 instance
     */
    public static User getCurrentUser() {
        return getCurrentUser(true);
    }

    /**
     * Gets the currently authenticated user from the SecurityContext.
     *
     * @param requireOrganization If true, throws exception if user has no
     *                            organization
     * @return The authenticated User
     * @throws ResponseStatusException if user is not authenticated or not a User
     *                                 instance
     */
    public static User getCurrentUser(boolean requireOrganization) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication");
        }

        User user = (User) principal;

        if (requireOrganization && user.getOrganizationId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User has no organization");
        }

        return user;
    }

    /**
     * Checks if the currently authenticated user has the ADMIN role.
     *
     * @param user The user to check
     * @throws ResponseStatusException if user is not an admin
     */
    public static void requireAdminRole(User user) {
        if (user.getRole() == null || !"ADMIN".equals(user.getRole().getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
    }

    /**
     * Checks if the currently authenticated user has the ADMIN role.
     * Gets the user from the SecurityContext.
     *
     * @throws ResponseStatusException if user is not authenticated or not an admin
     */
    public static void requireAdminRole() {
        User user = getCurrentUser();
        requireAdminRole(user);
    }
}
