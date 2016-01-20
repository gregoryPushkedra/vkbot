var longPollParams = API.messages.getLongPollServer();
var longPollLink = "https://" + longPollParams.server + 
                   "?act=a_check&wait=25&mode=2&" + 
                   "key=" + longPollParams.key + 
                   "&ts=" + longPollParams.ts;

return longPollLink;