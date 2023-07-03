const players = ['Joe', 'Caroline', 'Sabrina'];

players.forEach(player => {
    luckyDraw(player)
        .then(resolvedValue => {
            console.log(resolvedValue);
        })
        .catch(error => {
            console.log(error.message);
        });
});
