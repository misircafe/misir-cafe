export interface Event {
  id: string;
  artist_name: string;
  description?: string;
  image_url: string;
  date: EventDate[];
  is_active: boolean;
}

export interface addEventType {
  artist_name: string;
  description?: string;
  image_url?: string;
  date: EventDate[];
  is_active: boolean;
}

export interface EventDate {
  day: number;
  clock: string;
}
