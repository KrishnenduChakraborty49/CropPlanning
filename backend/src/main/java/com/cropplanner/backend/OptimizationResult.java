package com.cropplanner.backend;

import java.util.List;

public class OptimizationResult {
    private List<Crop> selectedCrops;
    private int totalLandUsed;
    private int totalWaterUsed;
    private int maxProfit;

    public OptimizationResult(List<Crop> selectedCrops, int totalLandUsed, int totalWaterUsed, int maxProfit) {
        this.selectedCrops = selectedCrops;
        this.totalLandUsed = totalLandUsed;
        this.totalWaterUsed = totalWaterUsed;
        this.maxProfit = maxProfit;
    }

    public List<Crop> getSelectedCrops() { return selectedCrops; }
    public int getTotalLandUsed() { return totalLandUsed; }
    public int getTotalWaterUsed() { return totalWaterUsed; }
    public int getMaxProfit() { return maxProfit; }
}
