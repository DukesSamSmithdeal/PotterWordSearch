import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { GryffindorPreset, SlytherinPreset, RavenclawPreset, HufflepuffPreset  } from './themes';
export const appConfig: ApplicationConfig = {
	
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: GryffindorPreset,
		    options: {
      		darkModeSelector: '.my-app-dark' // forces light mode, ignores system preference
    		}
      }
    })
  ]
};
