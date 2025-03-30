package com.motionParts.ecommerce.dto;

import com.motionParts.ecommerce.Models.ShippingData;

public class ShippingDataDTO {
    private String firstName;
    private String lastName;
    private String address;
    private String addressDetail;
    private String country;
    private String region;
    private String city;
    private String postalCode;
    private String notes;

    // ✅ Constructor vacío
    public ShippingDataDTO() {}

    // ✅ Constructor que recibe `ShippingData`
    public ShippingDataDTO(ShippingData shippingData) {
        this.firstName = shippingData.getFirstName(); // ✅ Antes getNombre(), ahora getFirstName()
        this.lastName = shippingData.getLastName(); // ✅ Antes getApellidos(), ahora getLastName()
        this.address = shippingData.getAddress(); // ✅ Antes getDireccion(), ahora getAddress()
        this.addressDetail = shippingData.getAddressDetail(); // ✅ Antes getDireccionDetalle(), ahora getAddressDetail()
        this.country = shippingData.getCountry(); // ✅ Antes getPais(), ahora getCountry()
        this.region = shippingData.getRegion(); // ✅ Antes getDepartamento(), ahora getRegion()
        this.city = shippingData.getCity(); // ✅ Antes getCiudad(), ahora getCity()
        this.postalCode = shippingData.getPostalCode(); // ✅ Antes getCodigoPostal(), ahora getPostalCode()
        this.notes = shippingData.getNotes(); // ✅ Antes getNotas(), ahora getNotes()
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
