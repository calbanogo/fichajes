import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { UtilsService } from './utils-service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private reloadEmployees$ = new Subject<void>();
  constructor(
    private firestore: Firestore,
    private utilsService: UtilsService
  ) { }

  get reloadEmployees() {
    return this.reloadEmployees$.asObservable();
  }

  public triggerReload() {
    this.reloadEmployees$.next();
  }

  async createEmployee(companyId: string, employee: any) {
    try {
      const employeesCollectionRef = collection(this.firestore, 'employees');

      // Creamos el documento primero
      const docRef = await addDoc(employeesCollectionRef, {
        ...employee,
        companyId: companyId
      });

      // Luego actualizamos el mismo documento con su propio ID
      await updateDoc(docRef, {
        employeeId: docRef.id
      });

    } catch (error) {

    }
  }

  async getEmployees(companyId: string) {
    try {
        const employeesCollectionRef = collection(this.firestore, 'employees');
        const q = query(
          employeesCollectionRef,
          where('companyId', '==', companyId)
        );
        const querySnapshot = await getDocs(q);

        const employees: any[] = [];
        querySnapshot.forEach((doc) => {
          employees.push({ id: doc.id, ...doc.data() });
        });
        employees.sort((a, b) =>
          a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
        );
        return employees;
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
      return [];
    }
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    try {
      const employeeRef = doc(this.firestore, 'employees', employeeId);
      await deleteDoc(employeeRef);
      this.utilsService.showToast('Empleado eliminado con éxito ✅');
    } catch (error) {
      this.utilsService.showToast('Error al eliminar el empleado ❌');
      throw error;
    }
  }
}
