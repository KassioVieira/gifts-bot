
module.exports = function(bot) {
    const supportedCommands = [
        '/newList - Criar uma nova lista de presentes',
        '/list - Visualizar a lista de presentes',
        '/addGift - Adicionar um presente à lista',
        '/deleteList - Remover uma lista de presentes',
        '/deleteGift - Remover um presente da lista',
    ];

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const keyboard = {
            reply_markup: {
                keyboard: supportedCommands.map(command => [{ text: command }]),
                one_time_keyboard: true,
                resize_keyboard: true,
            }
        };
        bot.sendMessage(chatId, 'Seja bem-vindo ao gift bot! Escolha uma opção:', keyboard);
    });
};

