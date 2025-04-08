package com.motionParts.ecommerce.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class UserInfoDTO {
    private Long id;

    @NotNull(message = "Type is required")
    private String type;  // Persona natural o Jurídica

    @NotNull(message = "Document type is required")
    private String documentType;  // Tipo de documento

    @NotNull(message = "Document number is required")
    private String documentNumber;  // Número de documento

    private LocalDate documentExp;  // Fecha de expedición del documento

    private String expCountry;  // País de expedición

    private String expRegion;  // Región de expedición

    private String expCity;  // Ciudad de expedición

    private String firstName;  // Primer nombre

    private String middleName;  // Segundo nombre (si aplica)

    private String lastName;  // Apellido

    private String secondLastName;  // Segundo apellido

    private String otherNames;  // Otros nombres (si aplica)

    private String legalName;  // Nombre legal (si aplica, para Persona Jurídica)

    @Email(message = "Email should be valid")
    private String email;  // Correo electrónico

    private String country;  // País

    private String region;  // Región

    private String city;  // Ciudad

    private String address;  // Dirección

    private String addressDetail;  // Detalle de la dirección

    private String postalCode;  // Código postal

    private String phone;  // Teléfono principal

    private String phone2;  // Teléfono secundario (si aplica)

    // Getters y Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public LocalDate getDocumentExp() { return documentExp; }
    public void setDocumentExp(LocalDate documentExp) { this.documentExp = documentExp; }

    public String getExpCountry() { return expCountry; }
    public void setExpCountry(String expCountry) { this.expCountry = expCountry; }

    public String getExpRegion() { return expRegion; }
    public void setExpRegion(String expRegion) { this.expRegion = expRegion; }

    public String getExpCity() { return expCity; }
    public void setExpCity(String expCity) { this.expCity = expCity; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getSecondLastName() { return secondLastName; }
    public void setSecondLastName(String secondLastName) { this.secondLastName = secondLastName; }

    public String getOtherNames() { return otherNames; }
    public void setOtherNames(String otherNames) { this.otherNames = otherNames; }

    public String getLegalName() { return legalName; }
    public void setLegalName(String legalName) { this.legalName = legalName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAddressDetail() { return addressDetail; }
    public void setAddressDetail(String addressDetail) { this.addressDetail = addressDetail; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPhone2() { return phone2; }
    public void setPhone2(String phone2) { this.phone2 = phone2; }

    public UserInfoDTO() {}

    // Constructor con todos los campos
    public UserInfoDTO(Long id, String type, String documentType, String documentNumber, LocalDate documentExp, 
                       String expCountry, String expRegion, String expCity, String firstName, String middleName, 
                       String lastName, String secondLastName, String otherNames, String legalName, String email, 
                       String country, String region, String city, String address, String addressDetail, 
                       String postalCode, String phone, String phone2) {
        this.id = id;
        this.type = type;
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.documentExp = documentExp;
        this.expCountry = expCountry;
        this.expRegion = expRegion;
        this.expCity = expCity;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.secondLastName = secondLastName;
        this.otherNames = otherNames;
        this.legalName = legalName;
        this.email = email;
        this.country = country;
        this.region = region;
        this.city = city;
        this.address = address;
        this.addressDetail = addressDetail;
        this.postalCode = postalCode;
        this.phone = phone;
        this.phone2 = phone2;
    }
}
