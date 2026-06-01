package com.cropplanner.backend;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class OptimizationService {

    public OptimizationResult optimize(List<Crop> crops, int totalLand, int totalWater) {
        int n = crops.size();
        if (n == 0 || totalLand <= 0 || totalWater <= 0) {
            return new OptimizationResult(new ArrayList<>(), 0, 0, 0);
        }

        int[][][] dp = new int[n + 1][totalLand + 1][totalWater + 1];

        for (int i = 1; i <= n; i++) {
            Crop crop = crops.get(i - 1);
            int lReq = crop.getLandRequired();
            int wReq = crop.getWaterRequired();
            int profit = crop.getProfit();

            for (int l = 0; l <= totalLand; l++) {
                for (int w = 0; w <= totalWater; w++) {
                    if (lReq <= l && wReq <= w) {
                        dp[i][l][w] = Math.max(
                                dp[i - 1][l][w],
                                dp[i - 1][l - lReq][w - wReq] + profit
                        );
                    } else {
                        dp[i][l][w] = dp[i - 1][l][w];
                    }
                }
            }
        }

        List<Crop> selectedCrops = new ArrayList<>();
        int l = totalLand;
        int w = totalWater;
        int maxProfit = dp[n][totalLand][totalWater];
        
        int totalLandUsed = 0;
        int totalWaterUsed = 0;

        for (int i = n; i > 0 && maxProfit > 0; i--) {
            if (maxProfit != dp[i - 1][l][w]) {
                Crop crop = crops.get(i - 1);
                selectedCrops.add(crop);
                maxProfit -= crop.getProfit();
                l -= crop.getLandRequired();
                w -= crop.getWaterRequired();
                
                totalLandUsed += crop.getLandRequired();
                totalWaterUsed += crop.getWaterRequired();
            }
        }

        return new OptimizationResult(selectedCrops, totalLandUsed, totalWaterUsed, dp[n][totalLand][totalWater]);
    }
}
