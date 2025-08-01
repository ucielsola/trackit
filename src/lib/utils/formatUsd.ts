export function formatUSD(value: number | string) {
	const number = typeof value === 'string' ? Number(value) : value;
	if (isNaN(number)) return '';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(number);
}
