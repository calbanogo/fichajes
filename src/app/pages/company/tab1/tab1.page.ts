import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonToolbar, IonButtons, IonBackButton, IonFab, IonFabButton, IonIcon, IonTitle, IonList, IonItem, IonLabel, IonText, IonAvatar, IonButton, IonFabList, IonPopover } from '@ionic/angular/standalone';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";
import { CompanyService } from 'src/app/services/company';
import { EmployeeService } from 'src/app/services/employee';
import { ActionSheetController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonButton, IonAvatar, IonText, IonLabel, IonItem, IonList, IonTitle, IonIcon, IonFabButton, IonFab, IonBackButton, IonButtons, IonToolbar, IonContent, CustomHeaderComponent],
})
export class Tab1Page implements OnInit {

  employees: any = [];
  popoverOpen = false;
  popoverEvent: any;
  selectedEmployee: any;
  @ViewChild('popoverContent') popoverTemplate!: TemplateRef<any>;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private actionSheetController: ActionSheetController,
    private utilsService: UtilsService,
  ) {}

  ngOnInit(): void {
    this.employeeService.reloadEmployees.subscribe(() => {
      const companyId = this.companyService.getSelectedCompany()?.companyId ?? '';
      this.employeeService.getEmployees(companyId).then(employees => {
        this.employees = employees;
        console.log('Employees reloaded:', this.employees);
      });
    });
  }

  ionViewWillEnter() {
    const companyId = this.companyService.getSelectedCompany()?.companyId ?? '';
    this.employeeService.getEmployees(companyId).then(employees => {
      this.employees = employees;
      console.log('Employees loaded:', this.employees);
    });
  }

  public addEmployee() {
    this.router.navigate(['create-employee'], { relativeTo: this.route });
  }

  public getInitials(name: string, surname: string): string {
    const first = name?.charAt(0).toUpperCase() ?? '';
    const last = surname?.charAt(0).toUpperCase() ?? '';
    return `${first}${last}`;
  }

  public editEmployee(employee: any) {
    console.log('Icono clicado para:', employee);
    // Aquí puedes abrir un modal, navegar, mostrar un toast, etc.
  }

  public deleteEmployee(employee: any) {
    console.log('Icono clicado para:', employee);
    this.employeeService.deleteEmployee(employee.id).then(() => {
      const companyId = this.companyService.getSelectedCompany()?.companyId ?? '';
        this.utilsService.showToast('Empleado eliminado con éxito ✅');
      this.employeeService.getEmployees(companyId).then(employees => {
        this.employees = employees;
        console.log('Employees reloaded after deletion:', this.employees);
        });
      }).catch(error => {
        console.error('Error al eliminar el empleado:', error);
        this.utilsService.showToast('Error al eliminar el empleado ❌');
      });
    // Aquí puedes abrir un modal, navegar, mostrar un toast, etc.
  }


  async presentEmployeeActions(employee: any) {
    const actionSheet = await this.actionSheetController.create({
      header: `${employee.name} ${employee.surname}`,
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => {
            this.editEmployee(employee);
          }
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.deleteEmployee(employee);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }
}
