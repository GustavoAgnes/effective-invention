package com.woodcraft.service;

import com.woodcraft.dto.FurniturePreviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PromptBuilderService {

    @Autowired
    private TranslationService translationService;

    private static final Map<String, String> FURNITURE_TRANSLATIONS = new HashMap<>();
    private static final Map<String, String> MATERIAL_TRANSLATIONS = new HashMap<>();
    private static final Map<String, String> WOOD_TYPE_TRANSLATIONS = new HashMap<>();

    static {
        // Furniture type translations
        FURNITURE_TRANSLATIONS.put("mesa", "dining table");
        FURNITURE_TRANSLATIONS.put("cadeira", "dining chair");
        FURNITURE_TRANSLATIONS.put("estante", "bookshelf");
        FURNITURE_TRANSLATIONS.put("armario", "cabinet");
        FURNITURE_TRANSLATIONS.put("rack", "TV stand");

        // Material translations
        MATERIAL_TRANSLATIONS.put("madeira", "natural wood");
        MATERIAL_TRANSLATIONS.put("mdf", "MDF board");
        MATERIAL_TRANSLATIONS.put("mdp", "particle board");
        MATERIAL_TRANSLATIONS.put("compensado", "plywood");

        // Wood type translations
        WOOD_TYPE_TRANSLATIONS.put("pinus", "pine wood");
        WOOD_TYPE_TRANSLATIONS.put("carvalho", "oak wood");
        WOOD_TYPE_TRANSLATIONS.put("mogno", "mahogany wood");
        WOOD_TYPE_TRANSLATIONS.put("cedro", "cedar wood");
        WOOD_TYPE_TRANSLATIONS.put("imbuia", "Brazilian walnut wood");
    }

    public String buildPrompt(FurniturePreviewRequest request) {
        StringBuilder prompt = new StringBuilder();
        
        // Check if customer provided detailed description
        boolean hasCustomDescription = request.getDescription() != null && 
                                       !request.getDescription().trim().isEmpty();
        
        if (hasCustomDescription) {
            // Use customer's description for more customized preview
            // Translate customer's description from Portuguese to English
            String translatedDescription = translationService.translateToEnglish(request.getDescription());
            
            // Build concise prompt
            prompt.append(translateFurnitureType(request.getFurnitureType()));
            prompt.append(", ");
            prompt.append(translateMaterial(request.getMaterial()));
            
            // Add wood type or color
            if ("madeira".equals(request.getMaterial()) && request.getWoodType() != null) {
                prompt.append(", ").append(translateWoodType(request.getWoodType()));
            } else if (request.getColor() != null && !request.getColor().isEmpty()) {
                prompt.append(", ").append(getColorDescription(request.getColor()));
            }
            
            // Include customer's specific requirements (translated)
            prompt.append(", ").append(translatedDescription);
            prompt.append(", white background, product photo");
            
        } else {
            // Generate SIMPLE and STANDARD furniture to avoid false expectations
            prompt.append("simple ");
            prompt.append(translateFurnitureType(request.getFurnitureType()));
            prompt.append(", ");
            prompt.append(translateMaterial(request.getMaterial()));
            
            // Add wood type or color
            if ("madeira".equals(request.getMaterial()) && request.getWoodType() != null) {
                prompt.append(", ").append(translateWoodType(request.getWoodType()));
            } else if (request.getColor() != null && !request.getColor().isEmpty()) {
                prompt.append(", ").append(getColorDescription(request.getColor()));
            }
            
            // Emphasize simplicity - shorter prompt for faster generation
            prompt.append(", basic design, straight legs, clean lines, white background");
        }
        
        return prompt.toString();
    }

    private String translateFurnitureType(String type) {
        return FURNITURE_TRANSLATIONS.getOrDefault(type.toLowerCase(), "furniture piece");
    }

    private String translateMaterial(String material) {
        return MATERIAL_TRANSLATIONS.getOrDefault(material.toLowerCase(), "wood");
    }

    private String translateWoodType(String woodType) {
        return WOOD_TYPE_TRANSLATIONS.getOrDefault(woodType.toLowerCase(), "natural wood");
    }

    private String getColorDescription(String hexColor) {
        // Convert hex color to descriptive name
        if (hexColor == null || hexColor.isEmpty()) {
            return "natural";
        }
        
        hexColor = hexColor.toLowerCase().replace("#", "");
        
        // Common color mappings
        if (hexColor.equals("ffffff")) return "white";
        if (hexColor.equals("000000")) return "black";
        if (hexColor.equals("f5f5dc")) return "beige";
        if (hexColor.startsWith("d2b") || hexColor.startsWith("8b4")) return "light brown wood tone";
        if (hexColor.startsWith("654")) return "dark brown wood tone";
        if (hexColor.startsWith("2f4")) return "dark gray";
        
        // Default to generic description
        return "custom color";
    }
}
