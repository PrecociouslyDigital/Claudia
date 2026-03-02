/** Format a message time: HH:MM if today, else "Mon DD". */
export function formatTime(date: Date): string {
	const now = new Date();
	const sameDay =
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate();
	if (sameDay) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
	return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
