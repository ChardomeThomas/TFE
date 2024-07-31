// export interface Country {
//     id: number; // ou string, selon votre JSON
//     name: string;
//     population: number;
//     country:string;
//     // ajoutez les autres propriétés que vous attendez dans vos données JSON
//   }

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
  }
  