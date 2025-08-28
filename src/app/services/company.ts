import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {

  
  private companyCollection;

  constructor(private firestore: Firestore) {
    this.companyCollection = collection(this.firestore, 'companies');
  }

  async addCompany(company: any, userId: string) {
    try {
      const docRef = await addDoc(this.companyCollection, company);
      const userRef = doc(this.firestore, `users/${userId}`);
      await updateDoc(userRef, { 
        companies:  arrayUnion(
          {
            companyId: docRef.id, 
            companyName: company.companyName, 
            description: company.description
          }),
      }
      );
      console.log('Empresa añadida con ID:', docRef.id);
    } catch (error) {
      console.error('Error al añadir la empresa:', error);
    }
  }

  async getCompanies() {
    try {
      const querySnapshot = await getDocs(this.companyCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener las empresas:', error);
      return [];
    }
  }
}