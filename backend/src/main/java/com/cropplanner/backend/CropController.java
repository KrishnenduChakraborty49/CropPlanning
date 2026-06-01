package com.cropplanner.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CropController {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private OptimizationService optimizationService;

    @GetMapping("/crops")
    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    @PostMapping("/crops")
    public Crop addCrop(@RequestBody Crop crop) {
        return cropRepository.save(crop);
    }

    @DeleteMapping("/crops/{id}")
    public void deleteCrop(@PathVariable Long id) {
        cropRepository.deleteById(id);
    }

    @PostMapping("/optimize")
    public OptimizationResult runOptimization(@RequestBody OptimizationRequest request) {
        List<Crop> crops = cropRepository.findAll();
        return optimizationService.optimize(crops, request.getTotalLand(), request.getTotalWater());
    }
}
