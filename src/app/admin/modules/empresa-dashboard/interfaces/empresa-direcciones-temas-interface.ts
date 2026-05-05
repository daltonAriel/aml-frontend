

export interface EmpresaDireccionesTemaInterface {
    empresaId: string;
    empresaCodigo: string;
    empresaRuc: string;
    empresaNombre: string;
    empresaSiglas: string;

    // Direcciones
    provinciaNombre: string;
    cantonNombre: string;
    parroquiaNombre: string;

    // Logo
    temaLogoUrl: string;

    // --- CONTACTO ---
    empresaTelefono: string;
    empresaEmail: string;
    empresaWeb: string;
    // Estado
    empresaEstado: boolean;
}