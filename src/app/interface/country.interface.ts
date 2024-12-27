export interface Country {
    country: string;
    villes: { [key: string]: any };
    jours: Jour[];
    drapeau: string;
  }
  export interface Country2 {
    countryId: number;
    name: string;
    flag: string;
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
  