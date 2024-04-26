const fs = require('fs');
const path = require('path');

module.exports = function(bot) {
    bot.onText(/\/list/, (msg) => {
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
    
        bot.sendMessage(chatId, 'Por favor, selecione de qual lista deseja ver os presentes:', keyboard);
    
        bot.once('message', (msg) => {
            if (msg.from.id === userId) {
                const selectedList = msg.text;
                if (!availableLists.includes(selectedList)) {
                    bot.sendMessage(chatId, 'Opção inválida. Por favor, selecione uma lista da lista de opções.');
                    return;
                }
                const listPath = path.join(listDirectory, `${selectedList}.json`);
                const listContent = fs.readFileSync(listPath, 'utf-8');
                const list = JSON.parse(listContent);
                if (list.gifts.length === 0) {
                    bot.sendMessage(chatId, `A lista "${selectedList}" está vazia.`);
                    return;
                }
                let message = `Lista de presentes da lista "${selectedList}":\n`;
                list.gifts.forEach((gift, index) => {
                    message += `${index + 1}. Nome: ${gift.name}, Link: ${gift.link}\n`;
                });
                bot.sendMessage(chatId, message);
            }
        });
    });
};