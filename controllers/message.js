const MessageModel = require('../models/MessageModel')


exports.addMessage = async (req, res) => {
    const { senderId, text, chatId } = req.body.message
    console.log(chatId);
    const message = new MessageModel({
        chatId,
        senderId,
        text
    });
    try {
        const result = await message.save();
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)

    }
}

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    console.log(chatId, 'iddd');
    try {
        const result = await MessageModel.find({ chatId })
        console.log(result, 'result');
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)

    }
}