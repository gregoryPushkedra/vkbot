var status = Args.s;
var act = Args.act;

API.status.set({ text: status });

if (act == "off") {
    API.account.setOffline();
} else {
    API.account.setOnline();
}

var requests = API.friends.getRequests({ count: 20, sort: 0 }).items;

while (requests.length > 0) {
    API.friends.add({ user_id: requests.shift() });
}

return true;