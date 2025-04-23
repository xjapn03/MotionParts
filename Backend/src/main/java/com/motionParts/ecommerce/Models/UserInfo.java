package com.motionParts.ecommerce.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;



@Entity
@Table(name = "user_info")
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Evitar la serialización recursiva
    private User user;

    @Column(nullable = false)
    private String type;  // Persona Natural o Jurídica

    @Column(nullable = false)
    private String documentType;  // Tipo de documento (Cédula, Pasaporte, etc.)

    @Column(nullable = false)
    private String documentNumber;  // Número de documento

    @Column(name = "document_exp")
    private LocalDate documentExp;  // Fecha de expedición

    @Column(name = "exp_country")
    private String expCountry;  // País de expedición

    @Column(name = "exp_region")
    private String expRegion;  // Región de expedición

    @Column(name = "exp_city")
    private String expCity;  // Ciudad de expedición

    @Column(name = "first_name")
    private String firstName;  // Primer nombre

    @Column(name = "middle_name")
    private String middleName;  // Segundo nombre (opcional)

    @Column(name = "last_name")
    private String lastName;  // Apellido paterno

    @Column(name = "second_last_name")
    private String secondLastName;  // Apellido materno

    @Column(name = "other_names")
    private String otherNames;  // Otros nombres (opcional)

    @Column(name = "legal_name")
    private String legalName;  // Nombre legal (para personas jurídicas)

    @Column(nullable = false)
    private String email;  // Correo electrónico

    @Column(nullable = false)
    private String country;  // País de residencia

    @Column(nullable = false)
    private String region;  // Región de residencia

    @Column(nullable = false)
    private String city;  // Ciudad de residencia

    @Column(nullable = false)
    private String address;  // Dirección de residencia

    @Column(name = "address_detail")
    private String addressDetail;  // Detalle de la dirección (opcional)

    @Column(name = "postal_code")
    private String postalCode;  // Código postal

    @Column(nullable = false)
    private String phone;  // Teléfono principal

    @Column(name = "phone2")
    private String phone2;  // Teléfono secundario (opcional)

    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

    public LocalDate getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

    // Sobrescribir equals y hashCode (si es necesario)
}
