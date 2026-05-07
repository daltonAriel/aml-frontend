import {
  CdkDrag,
  type CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { CdkTreeModule } from "@angular/cdk/tree";
import {
  Component,
  inject,
  type OnInit,
  signal,
  TemplateRef,
  ViewChild,
  type WritableSignal,
} from "@angular/core";
import { LucideRatio, provideLucideIcons } from "@lucide/angular";
import {
  ArrowUpRight,
  ChevronRight,
  Folder,
  GripHorizontal,
  GripVertical,
  LucideAngularModule,
  Plus,
  Settings,
  Trash2,
} from "lucide-angular";
import { NgxSonnerToaster, toast } from "ngx-sonner";
import { AdminModalService } from "../../shared/admin-modal/admin-modal-service";
import { AdminCrearMenu } from "./crear-menu/admin-crear-menu";
import type {
  MenuInterface,
  MenuReordenarInterface,
} from "./interfaces/menu-constructor-interfaces";
import { MenuService } from "./services/menu-service";

@Component({
  standalone: true,
  selector: "app-menu-data",
  templateUrl: "./menu-data.html",
  styleUrl: "./menu-data.css",
  imports: [
    CdkTreeModule,
    LucideAngularModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    NgxSonnerToaster,
  ],
  providers: [MenuService, provideLucideIcons(LucideRatio)],
})
export class MenuData implements OnInit {
  ChevronRight = ChevronRight;
  GripHorizontal = GripHorizontal;
  GripVertical = GripVertical;
  Folder = Folder;
  Plus = Plus;
  Trash2 = Trash2;
  ArrowUpRight = ArrowUpRight;
  Settings = Settings;

  private readonly toast = toast;

  MENU_DATA: WritableSignal<MenuInterface[]> = signal([]);

  private menuService = inject(MenuService);
  private modalService: AdminModalService = inject(AdminModalService);
  @ViewChild("customTemplate", { static: true }) customTemplate!: TemplateRef<any>;

  ngOnInit(): void {
    this.obtenerMenu();
  }

  dropPrincipal(event: CdkDragDrop<MenuInterface[]>) {
    // Verificación de seguridad: solo procesar si el origen y destino es la lista principal
    if (event.previousContainer === event.container) {
      const data = [...this.MENU_DATA()];
      moveItemInArray(data, event.previousIndex, event.currentIndex);
      this.updateOrder(data);
      this.MENU_DATA.set(data);
    }
  }

  dropSubitem(event: CdkDragDrop<MenuInterface[]>, parentNode: MenuInterface) {
    // Evitar que el drag del padre dispare esta función
    if (event.previousContainer === event.container) {
      const children = [...(parentNode.subMenus ?? [])];
      moveItemInArray(children, event.previousIndex, event.currentIndex);
      this.updateOrder(children);
      parentNode.subMenus = children;
      this.MENU_DATA.set([...this.MENU_DATA()]);
    }
  }

  private updateOrder(list: MenuInterface[]) {
    list.forEach((item, index) => {
      item.menuOrden = index + 1;
    });
    this.actualizarOrden(list);
  }

  obtenerMenu() {
    return this.menuService.obtenerMenu().subscribe({
      next: (response) => {
        const menuArray: MenuInterface[] = response.data || [];
        menuArray.map((item) => {
          item.isExpanded = true;
        });
        this.MENU_DATA.set(menuArray);
      },
      error: (error) => {
        this.toast.error("Error al obtener el menu");
      },
    });
  }

  actualizarOrden(menuReordenado: MenuInterface[]) {
    const data: MenuReordenarInterface = {
      listaMenuId: menuReordenado.map((item) => item.menuId),
    };

    this.menuService.actualizarOrden(data).subscribe({
      next: (response) => {
        this.toast.success("Orden actualizado exitosamente");
      },
      error: (error) => {
        this.toast.error("Error al actualizar el orden");
      },
    });
  }

  crearMenu(menuIdPadre: string | null) {
    const result = this.modalService
      .open(AdminCrearMenu, {
        size: "lg",
        scrollable: true,
        closeOnBackdropClick: true,
        data: { menuIdPadre: menuIdPadre },
        title: menuIdPadre == null ? "Crear Menú" : "Crear Submenú",
      })
      .then((result) => {
        if (result == true) {
          const _title = menuIdPadre == null ? "Menú Creado correctamente" : "Submenú Creado correctamente";
          this.toast.success(_title);
          this.obtenerMenu();
        }
      });
  }

  actualizarMenu(menuId: string, menuData: MenuInterface) {
    const result = this.modalService
      .open(AdminCrearMenu, {
        size: "lg",
        scrollable: true,
        closeOnBackdropClick: true,
        data: { menuId: menuId, menuData: menuData },
        title: menuData.menuIdPadre == null ? "Actualizar Menú" : "Actualizar Submenú",
      })
      .then((result) => {
        if (result == true) {
          const _title = menuData.menuIdPadre == null ? "Menú actualizado correctamente" : "Submenú actualizado correctamente";
          this.toast.success(_title);
          this.obtenerMenu();
        }
      });
  }
}
