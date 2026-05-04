import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { SeedService } from './app/core/services/seed.service';

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const seedService = appRef.injector.get(SeedService);
    seedService.seedData();
  })
  .catch((err) => console.error(err));
