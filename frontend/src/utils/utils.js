export default function toTimeAgo(dateString) {
    try {
        // Create a Date object from the input string
        const date = new Date(dateString)

        // Get today's date
        const today = new Date()

        // Calculate the difference in milliseconds
        const diffInMs = today.getTime() - date.getTime()

        // Convert milliseconds to days and round down to the nearest whole number
        const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        // Return the number of days ago
        return days
    }
    catch (error) {
        return 0
    }
}