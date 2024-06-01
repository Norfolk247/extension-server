module.exports = function (dateCreate,dateUpdate,currentDate) {
    if (!dateCreate||!currentDate) return 0.5
    // для годов
    /*const s = Math.floor(new Date(dateCreate).getTime()/(1000*60*60*24*365))
    const u = dateUpdate ? Math.floor(new Date(dateUpdate).getTime()/(1000*60*60*24*365)) : s
    const c = Math.floor(new Date(currentDate).getTime()/(1000*60*60*24*365))

    const x = c-u
    const k = c-s
    const b = 6/k
    if (k===0) return 0
    return (1/(1+Math.exp(-k*(x-b)))).toFixed(2)-0*/
    // для месяцев для точных данных
    const s = Math.floor(new Date(dateCreate).getTime()/(1000*60*60*24*30))
    const u = dateUpdate ? Math.floor(new Date(dateUpdate).getTime()/(1000*60*60*24*30)) : s
    const c = Math.floor(new Date(currentDate).getTime()/(1000*60*60*24*30))

    const x = c-u
    const k = c-s
    const b = 6*(12**2)/k
    if (k===0) return 0
    return (1/(1+Math.exp(-k*(x-b)/(12**2)))).toFixed(2)-0
}