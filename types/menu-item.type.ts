export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  is_popular: boolean;
  category_id: string;
  is_active: boolean;
}

export interface addMenuItemType {
  name: string;
  description?: string;
  price: string;
  is_popular: boolean;
  category_id: string;
  is_active: boolean;
}
