/**
 * Returns a random message from the provided array of messages.
 * If the array is empty, returns an empty string.
 * 
 * @param messages - Array of possible feedback messages
 * @returns A randomly selected message from the array
 */
export function getRandomFeedbackMessage(messages: string[]): string {
    if (!messages || messages.length === 0) {
        return '';
    }
    
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
} 