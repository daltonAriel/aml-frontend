export interface ApiResponse<T> {
	success: boolean;
	message: string;
	code: string;
	status: number;
	timestamp: string; // En JS/TS el LocalDateTime llega como string ISO o array
	data?: T; // Opcional: presente en respuestas de éxito
	technicalDetail?: string; // Opcional: presente en respuestas de error
}
