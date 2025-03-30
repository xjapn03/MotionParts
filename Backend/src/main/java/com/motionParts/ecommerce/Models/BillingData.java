package com.motionParts.ecommerce.Models; // 🔹 Paquete en minúscula (convención estándar en Java)

import com.motionParts.ecommerce.dto.BillingDataDTO;
import jakarta.persistence.Embeddable;

@Embeddable
public class BillingData {
    private String firstName;
    private String lastName;
    private String idType;
    private String idNumber;
    private String address;
    private String addressDetail;
    private String country;
    private String region;
    private String city;
    private String postalCode;
    private String phone;
    private String email;

    // ✅ Constructor vacío (requerido por JPA)
    public BillingData() {}

    // ✅ Constructor basado en DTO
    public BillingData(BillingDataDTO dto) {
        this.firstName = dto.getFirstName();
        this.lastName = dto.getLastName();
        this.idType = dto.getIdType();
        this.idNumber = dto.getIdNumber();
        this.address = dto.getAddress();
        this.addressDetail = dto.getAddressDetail();
        this.country = dto.getCountry();
        this.region = dto.getRegion();
        this.city = dto.getCity();
        this.postalCode = dto.getPostalCode();
        this.phone = dto.getPhone();
        this.email = dto.getEmail();
    }

    // 🔹 Getters y Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getIdType() { return idType; }
    public void setIdType(String idType) { this.idType = idType; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

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

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
