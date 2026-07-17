import * as signalR from "@microsoft/signalr";

// Khởi tạo kết nối tới endpoint đã map ở Program.cs
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:44312/notificationHub")
    .withAutomaticReconnect() // Tự động kết nối lại nếu mất mạng
    .build();

// Lắng nghe sự kiện "ReceiveMessage" từ Server gửi về
connection.on("ReceiveMessage", (user, message) => {
    console.log(`${user}: ${message}`);
});

// Bắt đầu kết nối
async function start() {
    try {
        await connection.start();
        console.log("SignalR đã kết nối thành công!");
    } catch (err) {
        console.error("Lỗi kết nối: ", err);
        setTimeout(start, 5000);
    }
}

// Hàm để gửi tin nhắn lên Server
function sendMessage(user: any, message: any) {
    connection.invoke("SendMessage", user, message).catch(err => console.error(err));
}

export default { start, sendMessage, connection };