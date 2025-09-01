import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, orderBy, query, where } from '@angular/fire/firestore';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private reloadEmployees$ = new Subject<void>();
  constructor(
    private firestore: Firestore
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
      const newEmployeeData = {
        ...employee,         // Aquí van los datos del empleado
        companyId: companyId // Asociamos el empleado con la empresa
      };

      const docRef = await addDoc(employeesCollectionRef, newEmployeeData);
      console.log('Empleado creado con ID:', docRef.id);
    } catch (error) {
      console.error('Error al añadir el empleado:', error);
    }
  }

  async getEmployees(companyId: string) {
    try {
        console.log('Getting employees for company ID:', companyId);
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
      console.log(`Empleado ${employeeId} eliminado correctamente`);
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      throw error;
    }
  }
}
