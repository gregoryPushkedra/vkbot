var frCount = parseInt(Args.count);
var userId = parseInt(Args.userId);
var friends = API.friends.get({ order: "random", count: frCount }).items;
    friends.push(userId);
    
var createChat = API.messages.createChat({ user_ids: friends + "", title: "Рандомная беседа by Чат-бот" });

return createChat;