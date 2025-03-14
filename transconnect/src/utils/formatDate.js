export function formatDate(dateString) {
    if (!dateString) return "Invalid date";

    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
