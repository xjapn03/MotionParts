export interface LocationData {
  [key: string]: {
    regiones: {
      [key: string]: string[];
    };
  };
}

export const LOCATIONS: LocationData = {
  Colombia: {
    regiones: {
      Antioquia: ["Medellín", "Bello", "Envigado"],
      Cundinamarca: ["Bogotá", "Soacha", "Zipaquirá"],
      "Valle del Cauca": ["Cali", "Palmira", "Buenaventura"]
    }
  },
  Argentina: {
    regiones: {
      "Buenos Aires": ["La Plata", "Mar del Plata", "Bahía Blanca"],
      Córdoba: ["Córdoba", "Villa María", "Río Cuarto"],
      Mendoza: ["Mendoza", "San Rafael", "Luján de Cuyo"]
    }
  },
  México: {
    regiones: {
      "Ciudad de México": ["Coyoacán", "Tlalpan", "Iztapalapa"],
      Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque"],
      "Nuevo León": ["Monterrey", "San Pedro", "Guadalupe"]
    }
  }
};
