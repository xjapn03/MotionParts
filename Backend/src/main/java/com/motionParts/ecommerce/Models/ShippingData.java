package com.motionParts.ecommerce.Models;

import com.motionParts.ecommerce.dto.ShippingDataDTO;
import jakarta.persistence.Embeddable;

@Embeddable
public class ShippingData {
    private String firstName;
    private String lastName;
    private String address;
    private String addressDetail;
    private String country;
    private String region;
    private String city;
    private String postalCode;
    private String notes;

    // ✅ Constructor vacío (requerido por JPA)
    public ShippingData() {}

    // ✅ Constructor basado en DTO
    public ShippingData(ShippingDataDTO dto) {
        this.firstName = dto.getFirstName();
        this.lastName = dto.getLastName();
        this.address = dto.getAddress();
        this.addressDetail = dto.getAddressDetail();
        this.country = dto.getCountry();
        this.region = dto.getRegion();
        this.city = dto.getCity();
        this.postalCode = dto.getPostalCode();
        this.notes = dto.getNotes();
    }

    // 🔹 Getters y Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAddressDetail() { return addressDetail; }
    public void setAddressDetail(String addressDetail) { this.addressDetail = addressDetail; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
