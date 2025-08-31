import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { add, barChartOutline, calendarOutline, logoGoogle, peopleCircleOutline, settingsOutline } from 'ionicons/icons';
import { setLogLevel, LogLevel } from '@angular/fire';

setLogLevel(LogLevel.SILENT);

addIcons({
  'logo-google': logoGoogle,
  'people-circle-outline': peopleCircleOutline,
  'calendar-outline': calendarOutline,
  'settings-outline': settingsOutline,
  'add': add,
  'bar-chart-outline': barChartOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
});
