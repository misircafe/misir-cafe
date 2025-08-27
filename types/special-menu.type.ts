export interface SpecialMenu {
  id: string;
  name: string;
  price: string;
  image_url: string;
  is_active: boolean;
}

export interface addSpecialMenuType {
  name: string;
  price: string;
  image_url?: string;
  is_active: boolean;
}
