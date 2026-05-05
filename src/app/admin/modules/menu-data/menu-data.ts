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
	type WritableSignal,
} from "@angular/core";
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
import type { MenuInterface } from "./interfaces/menu-constructor-interfaces";
import { MenuService } from "./services/menu-service";

@Component({
	standalone: true,
	selector: "app-menu-data",
	templateUrl: "./menu-data.html",
	styleUrl: "./menu-data.scss",
	imports: [
		CdkTreeModule,
		LucideAngularModule,
		CdkDropList,
		CdkDrag,
		CdkDragHandle,
	],
	providers: [MenuService],
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

	MENU_DATA: WritableSignal<MenuInterface[]> = signal([]);

  private menuService = inject(MenuService)

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
		console.log("Nuevo orden aplicado:", list);
	}


  obtenerMenu() {
    return this.menuService.obtenerMenu()
    .subscribe({
      next: (response) => {
		const data = response.data;
		const menuArray = Array.isArray(data) ? data : (data ? [data] : []);
		this.MENU_DATA.set(menuArray);

      },
      error: (error) => {
        console.log(error);
      }
    })
  }

}
