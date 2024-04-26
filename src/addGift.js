const fs = require('fs');
const path = require('path');

module.exports = function(bot) {
    bot.onText(/\/addGift/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const listDirectory = path.join(__dirname, 'lists');
        const availableLists = fs.readdirSync(listDirectory)
                                .filter(file => file.endsWith('.json'))
                                .map(file => file.slice(0, -5));
    
        if (availableLists.length === 0) {
            bot.sendMessage(chatId, 'Não há nenhuma lista disponível.');
            return;
        }
        const keyboard = {
            reply_markup: {
                remove_keyboard: true,
                keyboard: availableLists.map(listName => [{ text: listName }])
            }
        };
        bot.sendMessage(chatId, 'Por favor, selecione em qual lista deseja adicionar o presente:', keyboard);
        bot.once('message', (msg) => {
            if (msg.from.id === userId) {
                const selectedList = msg.text;
                if (!availableLists.includes(selectedList)) {
                    bot.sendMessage(chatId, 'Opção inválida. Por favor, selecione uma lista da lista de opções.');
                    return;
                }
                bot.sendMessage(chatId, 'Por favor, insira o nome do presente.');
                bot.once('message', (msg) => {
                    if (msg.from.id === userId) {
                        const giftName = msg.text;
                        bot.sendMessage(chatId, 'Por favor, insira o link do presente.');
                        bot.once('message', (msg) => {
                            if (msg.from.id === userId) {
                                const giftLink = msg.text;
                                const listPath = path.join(listDirectory, `${selectedList}.json`);
                                const listContent = fs.readFileSync(listPath, 'utf-8');
                                const list = JSON.parse(listContent);
                                list.gifts.push({ name: giftName, link: giftLink });
                                fs.writeFileSync(listPath, JSON.stringify(list));
    
                                bot.sendMessage(chatId, `Presente "${giftName}" adicionado à lista "${selectedList}" com sucesso!`);
                            }
                        });
                    }
                });
            }
        });
    });
};