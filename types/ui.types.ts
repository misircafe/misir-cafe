export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number | null; // bazı item'larda fiyat yok
  is_popular: boolean;
  is_active: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  description: string;
  image_url: string;
  items: MenuItem[];
}
