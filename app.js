const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res)  => {
    res.send("We don't serve that here. Never call again!");
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
        Base URL: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
        App: ${req.app}
        Body: ${req.body}
        `;
        res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end();
});

app.get('/greetings', (req, res) => {
    const name = req.query.name;
    const race = req.query.race;

    if(!name) {
        return res.status(400).send('Please provide a name');
    }

    if(!race) {
        return res.status(400).send('Please provide a race');
    }

    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

    res.send(greeting);
});

app.get('/sum', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    const c = a + b;
    const response = `The sum of ${a} and ${b} is ${c}`;
    res.send(response);
});

app.get('/cipher', (req, res) => {
    const text = req.query.text;
    const shift = req.query.shift;

    if(!text) {
        return res
            .status(400)
            .send('text is required');
    }
    
    if(!shift) {
        return res
            .status(400)
            .send('shift is required');
    }

    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {
        return res
            .status(400)
            .send('shift must be a number');
    }


    
    const base = 'A'.charCodeAt(0);

    const cipher = text
        .toUpperCase()
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);

            if(code < base || code > (base + 26)) {
                return char;
            }

            let diff = code - base;
            diff = diff + numShift;

            diff = diff % 26;

            return String.fromCharCode(base + diff);
        })
        .join('');

    res.status(200).send(cipher);
});

app.get('/lotto', (req, res) => {
    const numbers = req.query.arr;

    if(!numbers) {
        return res
            .status(400)
            .send('Numbers are required');
    }

    if(!Array.isArray(numbers)) {
        return res
            .status(400)
            .send('Numbers must be an array');
    }

    const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    if(guesses.length != 6) {
        return res
            .status(400)
            .send('Numbers must contain integers between 1 and 20');
    }

    let stockNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];


    const winningNumbers = [];
    for (let i = 0; i < 6; i++) {
        const random = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[random]);
        stockNumbers.splice(random, 1);
    }
    console.log(winningNumbers);
    console.log(guesses);

    let count = 0;
    winningNumbers.forEach(num => {
        if(guesses.includes(num)) {
            count++;
        }
    });

    switch(count) {
        case 0 :
        case 1 :
        case 2 :
        case 3 :
            res.send('Sorry, you lose.');
            break;
        case 4 :
            res.send('Congratulations, you win a free ticket');
            break;
        case 5 :
            res.send('Congratulations! You win $100!');
        case 6 :
            res.send('Wow! Unbelievable! You could have won the mega millions!');
    };
});