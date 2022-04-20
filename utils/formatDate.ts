const switchMonth = (month: number) => {
    switch (month) {
        case 0: 
            return 'Ian';
        case 1: 
            return 'Feb';
        case 2: 
            return 'Mar';
        case 3: 
            return 'Apr';
        case 4: 
            return 'Mai';
        case 5: 
            return 'Iun';
        case 6: 
            return 'Iul';
        case 7: 
            return 'Aug';
        case 8: 
            return 'Sep';            
        case 9: 
            return 'Oct';
        case 10: 
            return 'Noi';
        case 11: 
            return 'Dec';
    }
}

const formatDate = (creationDate: Date) => {
    const date = new Date(creationDate)
    const formattedDate = `${date.getDate()} ${switchMonth(date.getMonth())} ${date.getFullYear()}`

    return formattedDate
}

export default formatDate