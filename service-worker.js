self.addEventListener("install", function() {
    console.log("Service Worker installed");
});

self.addEventListener("activate", function() {
    console.log("Service Worker activated");
});

self.addEventListener("message", function(event) {
    if (!event.data || event.data.type !== "show-notification") {
        return;
    }

    event.waitUntil(
        self.registration.showNotification(event.data.title, {
            body: event.data.description || "You have a new todo reminder."
        })
    );
});

self.addEventListener("notificationclick", function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: "window" }).then(function(clientList) {
            for (const client of clientList) {
                if ("focus" in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow("/");
            }
        })
    );
});