package com.motionParts.ecommerce.dto;

import com.motionParts.ecommerce.Models.BillingData;

public class BillingDataDTO {
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

    // ✅ Constructor vacío
    public BillingDataDTO() {}

    // ✅ Constructor que recibe `BillingData`
    public BillingDataDTO(BillingData billingData) {
        this.firstName = billingData.getFirstName(); // ✅ Antes getNombre(), ahora getFirstName()
        this.lastName = billingData.getLastName(); // ✅ Antes getApellidos(), ahora getLastName()
        this.idType = billingData.getIdType(); // ✅ Antes getTipoIdentificacion(), ahora getIdType()
        this.idNumber = billingData.getIdNumber(); // ✅ Antes getNumeroIdentificacion(), ahora getIdNumber()
        this.address = billingData.getAddress(); // ✅ Antes getDireccion(), ahora getAddress()
        this.addressDetail = billingData.getAddressDetail(); // ✅ Antes getDireccionDetalle(), ahora getAddressDetail()
        this.country = billingData.getCountry(); // ✅ Antes getPais(), ahora getCountry()
        this.region = billingData.getRegion(); // ✅ Antes getDepartamento(), ahora getRegion()
        this.city = billingData.getCity(); // ✅ Antes getCiudad(), ahora getCity()
        this.postalCode = billingData.getPostalCode(); // ✅ Antes getCodigoPostal(), ahora getPostalCode()
        this.phone = billingData.getPhone(); // ✅ Antes getTelefono(), ahora getPhone()
        this.email = billingData.getEmail(); // ✅ Antes getEmail(), ahora getEmail()
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
