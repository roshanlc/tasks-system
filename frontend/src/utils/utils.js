export function convertDateFormat(dateString) {
    try {
    // Create a Date object from the input string
        const date = new Date(dateString)

        // Format the date according to the desired format
        // Year, month, day, hours, minutes, seconds, and UTC timezone
        const formattedDate = date.toISOString().replace(/\.\d+Z/, 'Z')

        return formattedDate
    } catch (error) {
    // Handle invalid date strings gracefully
        return null
    }
}
