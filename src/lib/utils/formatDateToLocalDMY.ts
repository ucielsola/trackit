export function formatDateToLocalDMY(dateInput: string | Date): string {
	const date = new Date(dateInput);
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
}