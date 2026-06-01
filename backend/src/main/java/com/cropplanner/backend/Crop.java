package com.cropplanner.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Crop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int landRequired;
    private int waterRequired;
    private int profit;

    public Crop() {}

    public Crop(String name, int landRequired, int waterRequired, int profit) {
        this.name = name;
        this.landRequired = landRequired;
        this.waterRequired = waterRequired;
        this.profit = profit;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getLandRequired() { return landRequired; }
    public void setLandRequired(int landRequired) { this.landRequired = landRequired; }
    public int getWaterRequired() { return waterRequired; }
    public void setWaterRequired(int waterRequired) { this.waterRequired = waterRequired; }
    public int getProfit() { return profit; }
    public void setProfit(int profit) { this.profit = profit; }
}
