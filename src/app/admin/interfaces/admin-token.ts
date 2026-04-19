export interface Authority {
  authority: string;
}

export interface AdminTokenInterface {
  sub: string;
  usuarioId: string;
  isSaas: boolean;
  empresaEstado: boolean;
  roles: Authority[];
  usuarioNombre: string;
  usuarioApellido: string;
  usuarioRolDescripcion: string;
  iat: number;
  exp: number;
}
