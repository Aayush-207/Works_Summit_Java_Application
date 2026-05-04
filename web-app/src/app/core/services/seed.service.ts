import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, addDoc } from '@angular/fire/firestore';
import hotelsData from '../../assets/seed-data.json';

@Injectable({
  providedIn: 'root'
})
export class SeedService {
  private firestore = inject(Firestore);

  async seedData() {
    const isSeeded = localStorage.getItem('seeded');
    if (isSeeded) return;

    const hotelsCol = collection(this.firestore, 'hotels');
    const snapshot = await getDocs(hotelsCol);

    if (snapshot.empty) {
      for (const hotel of hotelsData) {
        await addDoc(hotelsCol, {
          ...hotel,
          createdAt: new Date()
        });
      }
      localStorage.setItem('seeded', 'true');
      console.log('Seed data successfully added to Firestore');
    }
  }
}
