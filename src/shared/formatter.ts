export function formatDate(date:Date) {
    const formatDate = new Date(date)
    return formatDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
}