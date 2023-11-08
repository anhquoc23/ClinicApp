const Shift = [{
    'id': 1,
    'name': 'Ca 1',
    'shiftStart': '07:00:00',
    'shiftEnd': '11:00:00'
}, {
    'id': 2,
    'name': 'Ca 2',
    'shiftStart': '13:00:00',
    'shiftEnd': '17:00:00'
}, {
    'id': 3,
    'name': 'Ca 3',
    'shiftStart': '18:00:00',
    'shiftEnd': '22:00:00'
}]


export const getShiftById = (id) => {
    for (let i = 0; i < Shift.length; i++) {
        if(Shift[i]['id'] === id)
            return Shift[i]
    }
    return null
}

export default Shift