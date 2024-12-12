import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DialogDataService {
  /**
   * Prepara un conjunto de detalles para mostrarlos en un diálogo, basado en un objeto genérico y un mapeo de claves a etiquetas.
   *
   * @param data Objeto del que se extraerán los datos.
   * @param mappings Mapeo de propiedades del objeto a etiquetas legibles (parcial).
   * @returns Una lista de pares etiqueta-valor para ser mostrados en el diálogo.
   */
  prepareDetails<T>(
    data: T,
    mappings: Partial<Record<keyof T, string>>
  ): { label: string; value: string | number }[] {
    return Object.entries(mappings).map(([key, label]) => {
      const value = data[key as keyof T];
      return {
        label: label as string, 
        value: typeof value === 'string' || typeof value === 'number' ? value : 'N/A',
      };
    });
  }
}
