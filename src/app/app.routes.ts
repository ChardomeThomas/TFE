import { Routes } from '@angular/router';
import { LeafletMapComponent } from './features/map/leaflet-map/leaflet-map.component';
import { HomeComponent } from './features/home/home.component';
import { CountryListComponent } from './features/page/country-list/country-list.component';
import { CountryCityComponent } from './features/page/country-city/country-city.component';
import { CityDayComponent } from './features/page/city-day/city-day.component';
import { DayDescriptionComponent } from './features/page/day-description/day-description.component';
import { PhotoDescriptionComponent } from './features/page/photo-description/photo-description.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'map', component: LeafletMapComponent },
    { path: 'country-list', component: CountryListComponent },
    { path: ':country/country-city', component: CountryCityComponent },
    { path: ':country/:city', component: CityDayComponent },
    { path: ':country/:city/:day', component: DayDescriptionComponent },
    { path: ':country/:city/:day/photos/:photoIndex', component: PhotoDescriptionComponent },
    { path: '**', redirectTo: '/home' }
];
