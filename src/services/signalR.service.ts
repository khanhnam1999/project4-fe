import * as signalR from "@microsoft/signalr";
import { CookieService } from "./cookie.service";

// Khởi tạo kết nối tới endpoint đã map ở Program.cs
const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5207/notificationHub", {
        // Hub có [Authorize], vì vậy phải gửi cùng JWT đang dùng cho các API.
        accessTokenFactory: () => CookieService.get("token") ?? "",
    })
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
