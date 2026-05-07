// modal.component.ts
import { OverlayRef } from "@angular/cdk/overlay";
import {
  ApplicationRef,
  Component,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { NgxSonnerToaster } from "ngx-sonner";
import { Subscription } from "rxjs";
import { ModalOptions } from "./admin-modal-options";

@Component({
  selector: "admin-modal-component",
  template: `
    <!-- Contenedor del modal: centrado con flex -->
    <div
      [class.overflow-y-auto]="!options.scrollable"
      [class.items-center]="options.scrollable"
      [class.items-start]="!options.scrollable"
      [class.justify-center]="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Panel del modal: fondo blanco, redondeado, sombra, transición -->
      <div class="bg-white" [class]="modalContainerClasses" role="dialog" aria-modal="true">
        <!-- Cabecera opcional (se puede pasar como contenido) -->
        @if (!options.disableClose) {
          <div class="flex items-center justify-between border-b border-gray-200 p-4">
            @if (title) {
              <h3 class="text-xl font-bold text-slate-900">{{ title }}</h3>
            }

            <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
        }

        <!-- Cuerpo del modal: scrollable opcional -->
        <div [class]="modalBodyClasses">
          <!-- Aquí se inyecta el contenido dinámico (template o componente) -->
          <ng-container #dynamicContent></ng-container>
        </div>

        <!-- Footer opcional: se puede personalizar desde el contenido -->
        @if (showFooter) {
          <div class="flex justify-end space-x-2 border-t border-gray-200 p-4">
            @if (!options.disableClose) {
              <button (click)="closeModal()" class="rounded-md bg-gray-200 px-4 py-2">
                Cancelar
              </button>
              <button (click)="accept()" class="rounded-md bg-blue-600 px-4 py-2 text-white">
                Aceptar
              </button>
            }
          </div>
        }
      </div>
    </div>
    <ngx-sonner-toaster position="bottom-right" richColors duration="5000" />
  `,
  imports: [NgxSonnerToaster],
})
export class ModalComponent implements OnInit, OnDestroy {
  @ViewChild("dynamicContent", { read: ViewContainerRef, static: true })
  dynamicContentContainer!: ViewContainerRef;

  options: ModalOptions = {};
  content!: TemplateRef<any> | Type<any>;
  title?: string;
  showTitle = true;
  showFooter = true;

  // event cuando se cierra el modal
  close = new EventEmitter<any>();

  // Dependencias que llegan desde el servicio
  private overlayRef: OverlayRef | null = null;
  private closeSubscription: Subscription | null = null;
  private backdropSubscription: Subscription | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
  ) {}

  setOverlayRef(overlayRef: OverlayRef): void {
    this.overlayRef = overlayRef;
  }

  setCloseSubscription(subscription: Subscription): void {
    this.closeSubscription = subscription;
  }

get modalContainerClasses(): string {
  const base = "rounded-lg shadow-xl transform translate-y-10 duration-150 ease-in-out";
  const sizeClasses = this.getSizeClass();
  
  if (this.options.scrollable) {
    return `${base} ${sizeClasses} flex flex-col max-h-[calc(100vh-2rem)]`;
  } else {
    return `${base} ${sizeClasses} my-4`;
  }
}

get modalBodyClasses(): string {
  const base = "p-4";
  if (this.options.scrollable) {
    // Scroll interno en el cuerpo
    return `${base} flex-1 overflow-y-auto`;
  }
  // Sin scroll interno: el cuerpo se expande con el contenido
  return base;
}

  private getSizeClass(): string {
    switch (this.options.size) {
      case "sm":
        return "max-w-sm w-full";
      case "lg":
        return "max-w-lg w-full";
      case "xl":
        return "max-w-xl w-full";
      case "fullscreen":
        return "w-screen h-screen rounded-none";
      default:
        return "max-w-md w-full"; // md por defecto
    }
  }

  ngOnInit() {
    this.renderDynamicContent();
    this.setupBackdropClose();
    this.setupEscClose();
  }

  private renderDynamicContent() {
    if (!this.dynamicContentContainer) return;

    this.dynamicContentContainer.clear();

    if (this.content instanceof TemplateRef) {
      console.log("TemplateRef", this.options.data);
      this.dynamicContentContainer.createEmbeddedView(this.content, this.options.data || {});
    } else {
      const componentRef = this.dynamicContentContainer.createComponent(this.content);
      if (this.options.data && componentRef.instance) {
        Object.assign(componentRef.instance, this.options.data);
      }
    }
  }

  private setupBackdropClose() {
    if (
      this.options.closeOnBackdropClick !== false &&
      !this.options.disableClose &&
      this.overlayRef
    ) {
      this.backdropSubscription = this.overlayRef.backdropClick().subscribe(() => {
        this.closeModal();
      });
    }
  }

  private setupEscClose() {
    if (this.options.closeOnEsc !== false && !this.options.disableClose) {
      document.addEventListener("keydown", this.handleEsc);
    }
  }

  private handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.closeModal();
    }
  };

  closeModal(result?: any) {
    this.close.emit(result);
  }

  accept() {
    this.closeModal(true);
  }

  ngOnDestroy() {
    if (this.backdropSubscription) this.backdropSubscription.unsubscribe();
    if (this.options.closeOnEsc !== false) {
      document.removeEventListener("keydown", this.handleEsc);
    }
  }
}
