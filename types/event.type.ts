export interface EventDate {
  start: string; // ISO string, örn: "2025-09-01T14:00:00Z"
  end: string; // ISO string, örn: "2025-09-01T16:00:00Z"
}

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
