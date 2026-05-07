export interface MenuInterface {
  menuId: string;
  menuIdPadre: string | null;
  subMenus: MenuInterface[];

  menuLabel: string;
  menuUrl: string;
  menuIcon: string;
  menuOrden: number;
  menuEstado: boolean;
  isExpanded?: boolean;
}

export interface MenuRequestInterface {
  menuLabel: string;
  menuIdPadre: string | null;

  menuUrl: string;
  menuIcon: string;
  menuOrden: number;
  menuEstado: boolean;
}

export interface MenuReordenarInterface {
  listaMenuId: string[];
}