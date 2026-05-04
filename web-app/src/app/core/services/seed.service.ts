import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, getDocs, addDoc } from '@angular/fire/firestore';
import hotelsData from '../../../assets/seed-data.json';

@Injectable({
  providedIn: 'root'
})
export class SeedService {
  private injector = inject(EnvironmentInjector);
  private firestore = inject(Firestore);

  private inContext<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }

  async seedData() {
    const isSeeded = localStorage.getItem('seeded');
    if (isSeeded) return;

    const hotelsCol = this.inContext(() => collection(this.firestore, 'hotels'));
    const snapshot = await this.inContext(() => getDocs(hotelsCol));

    if (snapshot.empty) {
      for (const hotel of hotelsData) {
        await this.inContext(() => addDoc(hotelsCol, {
          ...hotel,
          createdAt: new Date()
        }));
      }
      localStorage.setItem('seeded', 'true');
      console.log('Seed data successfully added to Firestore');
    }
  }
}
