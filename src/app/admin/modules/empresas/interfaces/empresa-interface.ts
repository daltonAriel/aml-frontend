export interface EmpresaInterface {

	empresaId: string;
	empresaCodigo: string;
	empresaRuc: string;
	empresaNombre: string;
	empresaSiglas: string;

	// --- UBICACIÓN ---
	parroquiaId: string;

	// --- CONTACTO ---
	empresaTelefono: string;
	empresaEmail: string;
	empresaWeb: string;

	// --- ESTADO Y CONTROL ---
	empresaEstado: boolean;
	empresaFechaCreacion: Date;
}



export interface EmpresaDireccionesInterface {

	empresaId: string;
	empresaCodigo: string;
	empresaRuc: string;
	empresaNombre: string;
	empresaSiglas: string;

	// --- UBICACIÓN ---
	provinciaId: string;
	cantonId: string;
	parroquiaId: string;

	// --- CONTACTO ---
	empresaTelefono: string;
	empresaEmail: string;
	empresaWeb: string;

	// --- ESTADO Y CONTROL ---
	empresaEstado: boolean;
	empresaFechaCreacion: Date;
}
