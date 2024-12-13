export interface Starship {
  _id: string;
  name: string;
  description: string;
  image: string;
  imageUrl?: string; 
}

export interface StarshipResponse {
  info: {
    total: number;
    page: number;
    limit: number;
    next: string | null;
    prev: string | null;
  };
  data: Starship[];
}
