import { Component, inject, Input, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CustomValidators } from "@validators/custom-validators";
import { toast } from "ngx-sonner";
import { finalize } from "rxjs";
import { AdminForm } from "../../../shared/admin-form/admin-form";
import { AdminModalService } from "../../../shared/admin-modal/admin-modal-service";
import { AdminSelectState } from "../../../shared/admin-select-state/admin-select-state";
import { SpinnerComponent } from "../../login/components/spiner-loader";
import { MenuInterface, MenuRequestInterface } from "../interfaces/menu-constructor-interfaces";
import { MenuService } from "../services/menu-service";

@Component({
    standalone: true,
    selector: 'admin-crear-menu',
    templateUrl: './admin-crear-menu.html',
    imports: [AdminForm, ReactiveFormsModule, AdminSelectState, SpinnerComponent],
    providers: [MenuService]
})
export class AdminCrearMenu implements OnInit {

    ngOnInit(): void {
        if (this.menuData && this.menuId) {
            this.menuFrom.patchValue(this.menuData);
        }
    }

    private menuService = inject(MenuService);

    private readonly toast = toast;
    private modalService: AdminModalService = inject(AdminModalService);
    isLoading = signal<boolean>(false);

    private fb = inject(FormBuilder);
    @Input() menuId: string | null = null;
    @Input() menuIdPadre: string | null = null;
    @Input() menuData: MenuInterface | null = null;

    menuFrom: FormGroup = this.fb.nonNullable.group({
        menuLabel: [this.menuData?.menuLabel, [Validators.required, CustomValidators.isNotEmpty]],
        menuUrl: [this.menuData?.menuUrl, [Validators.required, CustomValidators.isNotEmpty]],
        menuIcon: [this.menuData?.menuIcon],
        menuEstado: [true, [Validators.required]],
    });

    guardarMenu(){
        if(this.menuFrom.invalid && this.menuId == null){
            return
        }
        this.isLoading.set(true);
        const menuData: MenuRequestInterface = this.menuFrom.getRawValue();
        menuData.menuIdPadre = this.menuIdPadre;
        this.menuService.guardarMenu(menuData)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
            next: (response) => {
                this.modalService.close(true);
            },
            error: (error) => {
                this.toast.dismiss();
                this.toast.error("Error al crear el menu");
            }
        })
    }

    actualizarMenu(){
        if(this.menuFrom.invalid || this.menuId == null){
            return
        }
        this.isLoading.set(true);
        const menuData: MenuRequestInterface = this.menuFrom.getRawValue();
        menuData.menuIdPadre = this.menuData?.menuIdPadre!;
        console.log("new data:", menuData);
        this.menuService.actualizarMenu(this.menuId, menuData)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
            next: (response) => {
                this.modalService.close(true);
            },
            error: (error) => {
                this.toast.dismiss();
                this.toast.error("Error al actualizar el menu");
            }
        })
    }

    guardar(){
        if(this.menuId == null && this.menuData == null){
            this.guardarMenu();
        }else{
            this.actualizarMenu();
        }
    }

    cerrarModal(){
        
    }

}