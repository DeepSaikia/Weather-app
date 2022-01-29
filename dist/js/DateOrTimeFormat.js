const dateOrTimeFormatting = (dateOrTime, date) => {

    date = date.split('T');

    if(dateOrTime === 'date') {
        const daysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
        let month, year, day;
        date = date[0];
        date = date.split('-');
        [year, month, day] = date;
        date = new Date(`${year}, ${month}, ${day}`);
        return `${daysArray[date.getDay()]} ${date.getDate()}`;
    }
    else {
        return `${date[1].slice(0, 5)}`;  //can be a seperate function
    }
}

export default dateOrTimeFormatting;