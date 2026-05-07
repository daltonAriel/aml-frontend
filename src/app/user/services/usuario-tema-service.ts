import { isPlatformBrowser } from "@angular/common";
import { afterNextRender, computed, inject, Injectable, PLATFORM_ID, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UsuarioTemaService {
  constructor() {
    // Inicializar desde variable CSS
    afterNextRender(() => {
      this.loadFromCssVariable();
    });
  }

  private platformId = inject(PLATFORM_ID);

  isLightColor(hexColor: string): boolean {
    // Normalizar hex (acepta #CCC, #CCCCCC, sin #)
    let hex = hexColor.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length !== 6) {
      // Si no es válido, asumir oscuro por seguridad
      return false;
    }

    // Convertir hex a valores sRGB (0-1)
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Linealizar (corrección gamma sRGB)
    const linearize = (c: number): number =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    const rLin = linearize(r);
    const gLin = linearize(g);
    const bLin = linearize(b);

    // Luminancia relativa según WCAG
    const luminance = 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;

    // Contraste con blanco (luminance = 1) y negro (luminance = 0)
    const contrastWithWhite = (1 + 0.05) / (luminance + 0.05);
    const contrastWithBlack = (luminance + 0.05) / (0 + 0.05);

    // Si el contraste con negro es mayor que con blanco, el fondo es claro
    return contrastWithBlack > contrastWithWhite;
  }

  primaryVarColorTheme = signal("#1E293B"); // slate-800 por defecto

  isLight = computed(() => this.isLightColor(this.primaryVarColorTheme()));

  private loadFromCssVariable(): void {
    if (isPlatformBrowser(this.platformId)) {
      const styles = getComputedStyle(document.documentElement);
      const cssColor = styles.getPropertyValue("--primary-var-color-theme").trim();
      if (cssColor && cssColor !== "") {
        console.log(cssColor);
        this.primaryVarColorTheme.set(cssColor);
      }
    }
  }
}
