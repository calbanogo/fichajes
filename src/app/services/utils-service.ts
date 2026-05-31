import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { Toast } from '@capacitor/toast';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export interface Trabajador {
  id: string;
  name: string;
  asistencias: { [fecha: string]: string };
  isDeleted: boolean;
}

export interface ExportOptions {
  includeDeleted?: boolean; // mostrar trabajadores eliminados
  weights?: { [estado: string]: number }; // pesos por estado
  startDate?: string; // inicio del rango YYYY-MM-DD
  endDate?: string; // fin del rango YYYY-MM-DD
}
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private defaultWeights: { [estado: string]: number } = {
    asistencia: 1,
    retraso: 0, // por defecto no cuenta; puedes cambiar a 1 o 0.5 via options
    permiso: 0,
    falta: 0,
  };

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  public async showToast(
    message: string,
    type: 'success' | 'warning' = 'success'
  ) {
    if (Capacitor.getPlatform() === 'web') {
      const toast = await this.toastController.create({
        message,
        duration: 2000,
        position: 'bottom',
        positionAnchor: 'bottom',
        color: type,
      });
      await toast.present();
    } else {
      await Toast.show({
        text: message,
        duration: 'long',
        position: 'bottom',
      });
    }
  }

  public async showLoading(message: string): Promise<any> {
    if (Capacitor.getPlatform() === 'web') {
      const loading = await this.loadingController.create({
        message,
        spinner: 'circles',
      });
      await loading.present();
    } else {
      await SplashScreen.show({
        autoHide: false,
      });
    }
  }

  async stopLoading() {
    // Oculta el splash
    if (Capacitor.getPlatform() === 'web') {
      await this.loadingController.dismiss();
    } else {
      await SplashScreen.hide();
    }
  }

  private getAutoDateRange(data: Trabajador[]): string[] {
    // Obtener todas las fechas
    const fechas: string[] = [];
    data.forEach((t) => fechas.push(...Object.keys(t.asistencias)));

    if (fechas.length === 0) return [];

    // Encontrar la fecha mínima y máxima
    const minDate = fechas.reduce((a, b) => (a < b ? a : b));
    const maxDate = fechas.reduce((a, b) => (a > b ? a : b));

    // Generar todas las fechas entre minDate y maxDate
    const allDates: string[] = [];
    let current = new Date(minDate);
    const last = new Date(maxDate);
    while (current <= last) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      allDates.push(`${y}-${m}-${d}`);
      current.setDate(current.getDate() + 1);
    }
    return allDates;
  }

  public async exportarAsistencias(
    data: Trabajador[],
    hoursPerDay: number,
    nombreArchivo: string = 'asistencias.xlsx'
  ) {
    if (Capacitor.getPlatform() === 'web') {
      const allDates = this.getAutoDateRange(data);

      // Formatear MM-DD
      const formattedDates = allDates.map((d) => {
        const parts = d.split('-');
        return parts.length >= 3 ? `${parts[2]}-${parts[1]}` : d;
      });

      // Cabecera
      const header: string[] = [
        'Trabajador',
        ...formattedDates,
        'Horas Totales',
        '% Asistencia',
      ];

      // Construir filas
      const rows = data.map((t) => {
        const row: Record<string, string | number> = {};
        header.forEach((col) => (row[col] = ''));

        row['Trabajador'] = t.name;

        let horasTotales = 0;

        allDates.forEach((date, idx) => {
          const estado = t.asistencias[date] ?? '';
          row[formattedDates[idx]] = estado;

          const peso = this.defaultWeights[estado?.toLowerCase()] ?? 0;
          horasTotales += peso * hoursPerDay;
        });

        const totalPosibleHoras = allDates.length * hoursPerDay;
        const porcentaje =
          totalPosibleHoras > 0 ? (horasTotales / totalPosibleHoras) * 100 : 0;

        row['Horas Totales'] = Number(horasTotales.toFixed(2));
        row['% Asistencia'] = porcentaje.toFixed(2) + '%';

        return row;
      });

      // Crear worksheet y workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows, {
        header,
        skipHeader: false,
      });
      const workbook: XLSX.WorkBook = {
        Sheets: { Asistencias: worksheet },
        SheetNames: ['Asistencias'],
      };

      // Guardar Excel
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(blob, nombreArchivo);
    } else {
      const allDates = this.getAutoDateRange(data);

      const formattedDates = allDates.map((d) => {
        const parts = d.split('-');
        return parts.length >= 3 ? `${parts[2]}-${parts[1]}` : d;
      });

      const header: string[] = [
        'Trabajador',
        ...formattedDates,
        'Horas Totales',
        '% Asistencia',
      ];

      const rows = data.map((t) => {
        const row: Record<string, string | number> = {};
        header.forEach((col) => (row[col] = ''));

        row['Trabajador'] = t.name;

        let horasTotales = 0;

        allDates.forEach((date, idx) => {
          const estado = t.asistencias[date] ?? '';
          row[formattedDates[idx]] = estado;

          const peso = this.defaultWeights[estado?.toLowerCase()] ?? 0;
          horasTotales += peso * hoursPerDay;
        });

        const totalPosibleHoras = allDates.length * hoursPerDay;
        const porcentaje =
          totalPosibleHoras > 0 ? (horasTotales / totalPosibleHoras) * 100 : 0;

        row['Horas Totales'] = Number(horasTotales.toFixed(2));
        row['% Asistencia'] = porcentaje.toFixed(2) + '%';

        return row;
      });

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows, {
        header,
        skipHeader: false,
      });
      const workbook: XLSX.WorkBook = {
        Sheets: { Asistencias: worksheet },
        SheetNames: ['Asistencias'],
      };

      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });

      // Convertir a base64
      const base64Data = (await this.blobToBase64(blob)) as string;
      const base64Clean = base64Data.split(',')[1]; // eliminar prefijo data:application/octet-stream;base64,

      // Guardar en directorio público (Android) o documentos (iOS)
      const savedFile = await Filesystem.writeFile({
        path: nombreArchivo,
        data: base64Clean,
        directory: Directory.External, // Android: carpeta pública
      });

      // Abrir / compartir el archivo automáticamente
      await Share.share({
        title: 'Asistencias',
        text: 'Aquí tienes el archivo Excel de asistencias',
        url: 'file://' + savedFile.uri,
        dialogTitle: 'Compartir archivo',
      });
    }
  }

  private blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
