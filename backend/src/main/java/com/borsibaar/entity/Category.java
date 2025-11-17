package com.borsibaar.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "dynamic_pricing", nullable = false)
    private boolean dynamicPricing;

    @OneToMany(mappedBy = "category")
    private Set<Product> products = new HashSet<>();
}
