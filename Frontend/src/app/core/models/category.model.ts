export interface Category {
  id?: number;
  name: string;
  description: string;
  parentId?: number;  // null si es una categoría raíz
}