const avatars = ['/avatars/robot-1.png', '/avatars/robot-2.png', '/avatars/robot-3.png']

// Convert a string to 32bit integer
function stringToHash(string) {
    // Check that string arg is a string
    if (typeof string != 'string') throw new Error("stringToHash: 'string' must be a string!")

    let hash = 0

    if (string.length == 0) return hash

    for (var i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }

    return hash
}

export function getRandomAvatar(address) {
    const addressHash = Math.abs(stringToHash(address))
    const randomIndex = addressHash % avatars.length
    return avatars[randomIndex]
}
