const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

//return a random word from a list of words
function getWord(){
    words = ['hello', 'world', 'these', 'chess'];
    return words[Math.floor(Math.random()* words.length)];
}


// return function of wordle bot
function getResponse(input,word){
    let output = '⬜⬜⬜⬜⬜';
    let output_l = output.split('');
    let word_l = word.split('');
    let input_l = input.split('');

    for (let i =0; i <5; i++){
        if(word_l[i] == input_l[i]){
            output_l[i] ='🟩';
            input_l[i] = '*';
            word_l[i] ='#';
        }
    }

    for (let i =0; i <5; i++){
        for(let j = 0; j <5; j++){
            if(input_l[i] == word_l[j]){
                output_l[i] ='🟧';
                input_l[i] = '*';
                word_l[j] ='#';
            }

        }
    }

    return output_l.join('');
}
word = getWord();
chances = 0;
client.on('message', msg => {
    guess = msg.body;
    response = getResponse(guess,word);
    if(guess.length != 5){
        client.sendMessage(msg.from,"Enter a word that is 5 charcters long");
    } else if(chances == 5){
        client.sendMessage(msg.from,'You have no more chances');
    } else{
        response = getResponse(guess,word);
        client.sendMessage(msg.from,response);
        chances += 1;
    }
})

client.initialize();
