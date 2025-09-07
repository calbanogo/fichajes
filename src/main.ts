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
import { add, airplaneOutline, arrowBack, barChartOutline, calendarOutline, closeOutline, createOutline, ellipsisVertical, logoGoogle, peopleCircleOutline, personCircleOutline, settingsOutline, timeOutline, trashOutline } from 'ionicons/icons';
import { setLogLevel, LogLevel } from '@angular/fire';


setLogLevel(LogLevel.SILENT);

addIcons({
  'logo-google': logoGoogle,
  'people-circle-outline': peopleCircleOutline,
  'calendar-outline': calendarOutline,
  'settings-outline': settingsOutline,
  'add': add,
  'close-outline': closeOutline,
  'bar-chart-outline': barChartOutline,
  'arrow-back': arrowBack,
  'ellipsis-vertical': ellipsisVertical,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'person-circle-outline': personCircleOutline,
  'airplane-outline': airplaneOutline,
  'time-outline': timeOutline
});

initializeApp(environment.firebase);

bootstrapApplication(AppComponent, {
  providers: [
    { 
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy 
    },
    provideIonicAngular({mode: 'md'}),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    {
    provide: Storage,
    useFactory: () => new Storage(),
  }
  ],
});
