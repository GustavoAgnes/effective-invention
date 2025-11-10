package com.woodcraft.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TranslationService {
    
    private static final Map<String, String> TRANSLATIONS = new HashMap<>();
    
    static {
        // Common furniture terms
        TRANSLATIONS.put("gaveta", "drawer");
        TRANSLATIONS.put("gavetas", "drawers");
        TRANSLATIONS.put("prateleira", "shelf");
        TRANSLATIONS.put("prateleiras", "shelves");
        TRANSLATIONS.put("porta", "door");
        TRANSLATIONS.put("portas", "doors");
        TRANSLATIONS.put("pé", "leg");
        TRANSLATIONS.put("pés", "legs");
        TRANSLATIONS.put("tampo", "top");
        TRANSLATIONS.put("assento", "seat");
        TRANSLATIONS.put("encosto", "backrest");
        TRANSLATIONS.put("braço", "arm");
        TRANSLATIONS.put("braços", "arms");
        
        // Styles
        TRANSLATIONS.put("moderno", "modern");
        TRANSLATIONS.put("moderna", "modern");
        TRANSLATIONS.put("rústico", "rustic");
        TRANSLATIONS.put("rústica", "rustic");
        TRANSLATIONS.put("clássico", "classic");
        TRANSLATIONS.put("clássica", "classic");
        TRANSLATIONS.put("minimalista", "minimalist");
        TRANSLATIONS.put("industrial", "industrial");
        TRANSLATIONS.put("contemporâneo", "contemporary");
        TRANSLATIONS.put("contemporânea", "contemporary");
        TRANSLATIONS.put("tradicional", "traditional");
        TRANSLATIONS.put("vintage", "vintage");
        TRANSLATIONS.put("retrô", "retro");
        
        // Characteristics
        TRANSLATIONS.put("simples", "simple");
        TRANSLATIONS.put("elegante", "elegant");
        TRANSLATIONS.put("sofisticado", "sophisticated");
        TRANSLATIONS.put("sofisticada", "sophisticated");
        TRANSLATIONS.put("robusto", "robust");
        TRANSLATIONS.put("robusta", "robust");
        TRANSLATIONS.put("delicado", "delicate");
        TRANSLATIONS.put("delicada", "delicate");
        TRANSLATIONS.put("grande", "large");
        TRANSLATIONS.put("pequeno", "small");
        TRANSLATIONS.put("pequena", "small");
        TRANSLATIONS.put("médio", "medium");
        TRANSLATIONS.put("média", "medium");
        TRANSLATIONS.put("alto", "tall");
        TRANSLATIONS.put("alta", "tall");
        TRANSLATIONS.put("baixo", "low");
        TRANSLATIONS.put("baixa", "low");
        TRANSLATIONS.put("largo", "wide");
        TRANSLATIONS.put("larga", "wide");
        TRANSLATIONS.put("estreito", "narrow");
        TRANSLATIONS.put("estreita", "narrow");
        
        // Features
        TRANSLATIONS.put("com", "with");
        TRANSLATIONS.put("sem", "without");
        TRANSLATIONS.put("para", "for");
        TRANSLATIONS.put("de", "of");
        TRANSLATIONS.put("em", "in");
        TRANSLATIONS.put("e", "and");
        TRANSLATIONS.put("ou", "or");
        TRANSLATIONS.put("muito", "very");
        TRANSLATIONS.put("pouco", "little");
        TRANSLATIONS.put("mais", "more");
        TRANSLATIONS.put("menos", "less");
        
        // Actions/Verbs
        TRANSLATIONS.put("preciso", "I need");
        TRANSLATIONS.put("quero", "I want");
        TRANSLATIONS.put("gostaria", "I would like");
        TRANSLATIONS.put("desejo", "I wish");
        TRANSLATIONS.put("deve", "should");
        TRANSLATIONS.put("devem", "should");
        TRANSLATIONS.put("ser", "be");
        TRANSLATIONS.put("ter", "have");
        TRANSLATIONS.put("tenha", "have");
        TRANSLATIONS.put("tenham", "have");
        
        // Additional terms
        TRANSLATIONS.put("toda", "all");
        TRANSLATIONS.put("todo", "all");
        TRANSLATIONS.put("todos", "all");
        TRANSLATIONS.put("todas", "all");
        TRANSLATIONS.put("cada", "each");
        TRANSLATIONS.put("uma", "a");
        TRANSLATIONS.put("um", "a");
        TRANSLATIONS.put("na", "in the");
        TRANSLATIONS.put("no", "in the");
        TRANSLATIONS.put("da", "of the");
        TRANSLATIONS.put("do", "of the");
        TRANSLATIONS.put("que", "that");
        TRANSLATIONS.put("arredondada", "rounded");
        TRANSLATIONS.put("arredondado", "rounded");
        TRANSLATIONS.put("quinas", "edges");
        TRANSLATIONS.put("vivas", "sharp");
        TRANSLATIONS.put("dupla", "double");
        TRANSLATIONS.put("duplas", "double");
        TRANSLATIONS.put("perna", "leg");
        TRANSLATIONS.put("pernas", "legs");
        TRANSLATIONS.put("verdade", "actually");
        TRANSLATIONS.put("testando", "testing");
        TRANSLATIONS.put("funcionalidade", "functionality");
        TRANSLATIONS.put("tradução", "translation");
        
        // Materials (additional)
        TRANSLATIONS.put("vidro", "glass");
        TRANSLATIONS.put("metal", "metal");
        TRANSLATIONS.put("ferro", "iron");
        TRANSLATIONS.put("aço", "steel");
        TRANSLATIONS.put("alumínio", "aluminum");
        
        // Colors
        TRANSLATIONS.put("branco", "white");
        TRANSLATIONS.put("branca", "white");
        TRANSLATIONS.put("preto", "black");
        TRANSLATIONS.put("preta", "black");
        TRANSLATIONS.put("cinza", "gray");
        TRANSLATIONS.put("marrom", "brown");
        TRANSLATIONS.put("bege", "beige");
        TRANSLATIONS.put("natural", "natural");
        
        // Common phrases
        TRANSLATIONS.put("estilo", "style");
        TRANSLATIONS.put("design", "design");
        TRANSLATIONS.put("acabamento", "finish");
        TRANSLATIONS.put("detalhes", "details");
        TRANSLATIONS.put("decoração", "decoration");
    }
    
    /**
     * Translates Portuguese text to English using keyword replacement.
     * This is a simple approach for common furniture-related terms.
     */
    public String translateToEnglish(String portugueseText) {
        if (portugueseText == null || portugueseText.trim().isEmpty()) {
            return "";
        }
        
        String translated = portugueseText.toLowerCase();
        
        // Replace Portuguese words with English equivalents
        // Sort by length (longest first) to avoid partial replacements
        java.util.List<Map.Entry<String, String>> sortedEntries = TRANSLATIONS.entrySet().stream()
            .sorted((e1, e2) -> Integer.compare(e2.getKey().length(), e1.getKey().length()))
            .collect(java.util.stream.Collectors.toList());
        
        for (Map.Entry<String, String> entry : sortedEntries) {
            String pattern = "\\b" + entry.getKey() + "\\b";
            translated = translated.replaceAll(pattern, entry.getValue());
        }
        
        // If translation didn't work well, provide a simplified English version
        // focusing on key furniture terms
        if (translated.matches(".*[àáâãäåèéêëìíîïòóôõöùúûüýÿñç].*")) {
            // Still has Portuguese characters, do basic cleanup
            translated = translated
                .replaceAll("[àáâãäå]", "a")
                .replaceAll("[èéêë]", "e")
                .replaceAll("[ìíîï]", "i")
                .replaceAll("[òóôõö]", "o")
                .replaceAll("[ùúûü]", "u")
                .replaceAll("ç", "c")
                .replaceAll("ñ", "n");
        }
        
        return translated;
    }
}
