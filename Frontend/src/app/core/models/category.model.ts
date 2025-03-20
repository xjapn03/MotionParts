export interface Category {
  id: number;
  name: string;
  description: string;
  parent?: Category;  // `?` indica que puede ser null si es una categoría raíz
}
