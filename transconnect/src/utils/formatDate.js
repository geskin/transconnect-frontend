export function formatDate(dateString) {
    if (!dateString) return "Invalid date"; // Handle null/undefined values

    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
        // second: "2-digit",
        // timeZoneName: "short",
    });
}
