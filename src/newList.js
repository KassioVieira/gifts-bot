const fs = require('fs');
const path = require('path');

function showList(chatId, newListName, bot) {
    const listPath = path.join(__dirname, 'lists', `${newListName}.json`);
    const listContent = fs.readFileSync(listPath, 'utf-8');
    const list = JSON.parse(listContent);
    let message = `Lista de presentes "${newListName}":\n`;
    list.gifts.forEach((gift, index) => {
        message += `${index + 1}. ${gift.name} - ${gift.link}\n`;
    });
    bot.sendMessage(chatId, message);
}

module.exports = function(bot) {
    bot.onText(/\/newList/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
    
        bot.sendMessage(chatId, 'Por favor, insira o nome da nova lista de presentes.');
        bot.once('message', (msg) => {
            if (msg.from.id === userId) {
                const newListName = msg.text;
                const listDirectory = path.join(__dirname, 'lists');
                if (!fs.existsSync(listDirectory)) {
                    fs.mkdirSync(listDirectory);
                }
                const newListPath = path.join(listDirectory, `${newListName}.json`);
                if (fs.existsSync(newListPath)) {
                    bot.sendMessage(chatId, 'Já existe uma lista com este nome. Por favor, escolha outro nome.');
                } else {
                    const newList = {
                        name: newListName,
                        gifts: []
                    };
                    fs.writeFileSync(newListPath, JSON.stringify(newList));
    
                    bot.sendMessage(chatId, `Lista "${newListName}" criada com sucesso!`);
                    bot.sendMessage(chatId, 'Deseja adicionar um presente a esta lista?', {
                        reply_markup: {
                            keyboard: [['Sim', 'Não']],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });
                    
                    bot.once('message', (msg) => {
                        if (msg.from.id === userId) {
                            const response = msg.text.toLowerCase();
    
                            if (response === 'sim') {
                                bot.sendMessage(chatId, 'Por favor, insira o nome do presente.');
                                bot.once('message', (msg) => {
                                    if (msg.from.id === userId) {
                                        const giftName = msg.text;
                                        bot.sendMessage(chatId, 'Por favor, insira o link do presente.');
                                        bot.once('message', (msg) => {
                                            if (msg.from.id === userId) {
                                                const giftLink = msg.text;
                                                const listPath = path.join(__dirname, 'lists', `${newListName}.json`);
                                                const listContent = fs.readFileSync(listPath, 'utf-8');
                                                const list = JSON.parse(listContent);
                                                list.gifts.push({ id: list.gifts.length + 1, name: giftName, link: giftLink });
                                                fs.writeFileSync(listPath, JSON.stringify(list));
    
                                                bot.sendMessage(chatId, `Presente "${giftName}" adicionado à lista com sucesso!`);
                                                showList(chatId, newListName, bot);
                                            }
                                        });
                                    }
                                });
                            } else if (response === 'não' || response === 'nao') {
                                bot.sendMessage(chatId, 'Ok, obrigado!');
                            } else {
                                bot.sendMessage(chatId, 'Por favor, responda com "Sim" ou "Não".');
                            }
                        }
                    });
                }
            }
        });
    });
};
