package com.woodcraft.dto;

public class LoginResponse {
    private String token;
    private String message;
    private UserInfo user;
    
    // Constructors
    public LoginResponse() {}
    
    public LoginResponse(String token, String message, UserInfo user) {
        this.token = token;
        this.message = message;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }
    
    public static class UserInfo {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        
        public UserInfo() {}
        
        public UserInfo(Long id, String email, String firstName, String lastName) {
            this.id = id;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
    }
}