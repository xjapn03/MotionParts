package Controllers;


public class Users {
    int idUser;
    int rol; 
    int age;
    String phone; 
    String name;
    String lastName;
    String email;
    String password;
    String registerDate;

    public Users(int idUser, int rol, int age, String phone, String name, String lastName, String email, String password, String registerDate) {
        this.idUser = idUser;
        this.rol = rol;
        this.age = age;
        this.phone = phone;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.registerDate = registerDate;
    }

    // Getters y setters para todos los atributos

    public int getIdUser() {
        return idUser;
    }

    public void setIdUser(int idUser) {
        this.idUser = idUser;
    }

    public int getRol() {
        return rol;
    }

    public void setRol(int rol) {
        this.rol = rol;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}


