import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion, getDoc, query, where, setDoc, orderBy } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { Company } from '../interfaces/companiesList';
import { UtilsService } from './utils-service';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private storage: Storage;
  private storageReady = false;
  private selectedCompanySubject = new BehaviorSubject<Company | null>(null);
  private companyCollection;

  constructor(
    private firestore: Firestore,
    private utilsService: UtilsService
  ) {
    this.storage = new Storage();
    this.init();
    this.companyCollection = collection(this.firestore, 'companies');
  }

  private async init() {
    await this.storage.create(); 
    this.storageReady = true;

    // cargar empresa previamente guardada
     const saved = await this.storage.get('selectedCompany');
    if (saved) {
      this.selectedCompanySubject.next(saved);
    }
  }

  async selectCompany(company: any) {
    this.selectedCompanySubject.next(company);
    if (this.storageReady) {
      await this.storage.set('selectedCompany', company);
    }
  }

  getSelectedCompany(): Company | null {
    return this.selectedCompanySubject.value;
  }

  async clearSelectedCompany() {
    this.selectedCompanySubject.next(null);
    if (this.storageReady) {
      await this.storage.remove('selectedCompany');
    }
  }

  async addCompany(company: Company, userId: string) {
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
        }, 
      );
      this.utilsService.showToast('Empresa creada con éxito ✅');
    } catch (error) {
      this.utilsService.showToast('Error al añadir la empresa ❌');
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

  async addAttendance(companyId: string,  attendanceData: any) {
    const docRef = doc(this.firestore, `companies/${companyId}/attendance/${attendanceData.date}`);

    await setDoc(docRef, {
      companyId,
      ...attendanceData
    });
  }

  async getAttendance(companyId: string, dateInit: string, dateEnd: string) {
    const attendanceRef = collection(this.firestore, `companies/${companyId}/attendance`);
    const q = query(
      attendanceRef,
      where('date', '>=', dateInit),
      where('date', '<=', dateEnd),
      orderBy('date')
    );
  }
}