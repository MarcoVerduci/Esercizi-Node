async function getResults() {
    try {
        const results = await Promise.all([
            luckyDraw('Tina'),
            luckyDraw('Jorge'),
            luckyDraw('Julien')
        ]);

        for (const result of results) {
            console.log(result);
        }
    } catch (error) {
        console.error(error);
    }
}

getResults();
