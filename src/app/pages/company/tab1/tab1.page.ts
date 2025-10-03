import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonAvatar,
  IonButton,
  IonFabList,
  IonPopover,
} from '@ionic/angular/standalone';
import { CustomHeaderComponent } from 'src/app/components/custom-header/custom-header.component';
import { CompanyService } from 'src/app/services/company';
import { EmployeeService } from 'src/app/services/employee';
import { ActionSheetController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils-service';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonButton,
    IonAvatar,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonTitle,
    IonIcon,
    IonFabButton,
    IonFab,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonContent,
    CustomHeaderComponent,
  ],
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
    private utilsService: UtilsService,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit(): void {
    this.employeeService.reloadEmployees.subscribe(() => {
      const companyId =
        this.companyService.getSelectedCompany()?.companyId ?? '';
      this.employeeService.getEmployees(companyId).then((employees) => {
        this.employees = employees;
      });
    });
  }

  ionViewWillEnter() {
    const companyId = this.companyService.getSelectedCompany()?.companyId ?? '';
    this.employeeService.getEmployees(companyId).then((employees) => {
      this.employees = employees;
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
    this.router.navigate(['create-employee', employee.id], {
      relativeTo: this.route,
    });
  }

  public deleteEmployee(employee: any) {
    this.employeeService
      .deleteEmployee(employee.id)
      .then(() => {
        const companyId =
          this.companyService.getSelectedCompany()?.companyId ?? '';
        this.utilsService.showToast('Empleado eliminado con éxito ✅');
        this.employeeService.getEmployees(companyId).then((employees) => {
          this.employees = employees;
        });
      })
      .catch((error) => {
        console.error('Error al eliminar el empleado:', error);
        this.utilsService.showToast('Error al eliminar el empleado ❌');
      });
  }

  async presentEmployeeActions(employee: any) {
    if (Capacitor.getPlatform() === 'web') {
      const actionSheet = await this.actionSheetController.create({
        header: `${employee.name} ${employee.surname}`,
        buttons: [
          {
            text: 'Editar',
            icon: 'create-outline',
            handler: () => {
              this.editEmployee(employee);
            },
          },
          {
            text: 'Eliminar',
            icon: 'trash-outline',
            role: 'destructive',
            handler: () => {
              this.deleteEmployee(employee);
            },
          },
          {
            text: 'Cancelar',
            icon: 'close-outline',
            role: 'cancel',
          },
        ],
      });

      await actionSheet.present();
    } else {
      const actionSheet = await ActionSheet.showActions({
        title: `${employee.name} ${employee.surname}`,
        options: [
          {
            title: 'Editar',
            style: ActionSheetButtonStyle.Default,
          },
          {
            title: 'Eliminar',
            style: ActionSheetButtonStyle.Destructive,
          },
          {
            title: 'Cancelar',
            style: ActionSheetButtonStyle.Cancel,
          },
        ],
      });

      switch (actionSheet.index) {
        case 0:
          this.editEmployee(employee);
          break;
        case 1:
          this.deleteEmployee(employee);
          break;
        case 2:
        case -1:
          break
      }
    }
  }
}
