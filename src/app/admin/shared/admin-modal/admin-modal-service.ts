// modal.service.ts
import { Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import {
  ApplicationRef,
  ComponentRef,
  Injectable,
  Injector,
  OnDestroy,
  TemplateRef,
  Type,
} from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { ModalComponent } from "./admin-modal-component";
import { ModalOptions } from "./admin-modal-options";

@Injectable()
export class AdminModalService implements OnDestroy {
  private currentOverlayRef: OverlayRef | null = null;
  private currentCloseSubscription: Subscription | null = null;
  private routerSubscription: Subscription;

  private isClosing = false;

  private currentModalComponentRef: ComponentRef<ModalComponent> | null = null;

  private currentResolve: ((value?: any) => void) | null = null;

  constructor(
    private overlay: Overlay,
    private router: Router,
    private appRef: ApplicationRef,
    private injector: Injector,
  ) {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.close();
      });
  }
  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  open(content: TemplateRef<any> | Type<any>, options: ModalOptions = {}): Promise<any> {
    this.close(); // Cierra modal previo si existe

    // opciones de overlay
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: "bg-black/20",
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    });

    const overlayRef = this.overlay.create(overlayConfig);
    const modalPortal = new ComponentPortal(ModalComponent, null, this.injector);
    const modalComponentRef = overlayRef.attach(modalPortal);
    this.currentModalComponentRef = modalComponentRef;

    const modalInstance = modalComponentRef.instance;
    modalInstance.setOverlayRef(overlayRef);
    modalInstance.options = options;
    modalInstance.content = content;
    modalInstance.title = options.title;
    modalInstance.showFooter = options.showFooter ?? false;

    // metodos de cierre de suscripcion
    const closeSubscription = modalInstance.close.subscribe((result: any) => {
      this.close(result);
    });
    modalInstance.setCloseSubscription(closeSubscription);

    // Guardar referencias para cerrar después
    this.currentOverlayRef = overlayRef;
    this.currentCloseSubscription = closeSubscription;

    return new Promise((resolve) => {
      this.currentResolve = resolve;
      const closingSubscription = modalInstance.close.subscribe((result) => {
            this.currentResolve = null;
            resolve(result);
            closingSubscription.unsubscribe();
            this.close();
      });
    });
  }

    close(result?: any): void {
        // Resuelve la promesa si existe
        if (this.currentResolve) {
            this.currentResolve(result);
            this.currentResolve = null;
        }
        if (this.currentOverlayRef) {
            this.currentOverlayRef.detach();
            this.currentOverlayRef.dispose();
            this.currentOverlayRef = null;
        }
        if (this.currentCloseSubscription) {
            this.currentCloseSubscription.unsubscribe();
            this.currentCloseSubscription = null;
        }
        this.currentModalComponentRef = null;
    }
}
