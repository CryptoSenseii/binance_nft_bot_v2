import readlineSync from 'readline-sync'

// Try deafult readline idk
export const inputStart = () => {
    readlineSync.keyInSelect(['', ''], 'Choose the action')
}

export const inputSetConfig = () => {

}