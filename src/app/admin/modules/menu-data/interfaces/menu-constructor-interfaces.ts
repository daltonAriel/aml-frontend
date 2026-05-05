export interface MenuConstructorInterface {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  order: number;
  parentId?: string | null;
  children: MenuConstructorInterface[];
  isExpanded?: boolean;
  status?: boolean;
}

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
