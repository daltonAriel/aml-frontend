export interface UserJWTInterface {
	token: string;
}


export interface Authority {
  authority: string;
}

export interface UserTokenInterface {
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
