
  export interface Country2 {
    countryId: number;
    name: string;
    flag: string;
  }
  export interface Jour2{
    id_day: number;
    day_number: number;
    id_city: number;
    description:string;
  }
  export interface Photo2 {
    id_photo: number;
    id_day: number;
    title: string;
    url: string;
    description: string;
    isPrivate: boolean; // Modifier le type en boolean
    loaded: boolean;
  }
  
  
  

  //ancienne interface
  export interface Country {
    country: string;
    villes: { [key: string]: any };
    jours: Jour[];
    drapeau: string;
  }
  export interface Jour {
    jour: number;
    date: string;
    titre: string;
    description: string;
    photos: Photo[];
  }
  
  export interface Photo {
    url: string;
    description: string;
    loaded?: boolean;
  }
  // photo.interface.ts
