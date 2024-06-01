module.exports = function (dateStart,dateEnd,currentDate) {
    if (!dateStart||!dateEnd||!currentDate) return 0.5
    const a = Math.floor((new Date(dateEnd).getTime()-new Date(dateStart).getTime())/3600000)
    if (a<=0) return 0.5
    const x = Math.floor((new Date(currentDate).getTime()-new Date(dateStart).getTime())/3600000)
    if ((x>a)||(x<0)) return 0
    return (4*x/a*(1-x/a)).toFixed(2)-0
}