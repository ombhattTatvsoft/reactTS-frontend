import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Dropdown from "../UI/Dropdown";
import socket, { joinUserRoom } from "../../../utils/socket";
import { getUserData } from "../../../utils/manageUserData";

interface Notification {
  _id: string;
  userId: string;
  projectId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NotificationsDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userId = getUserData()._id;

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Join user room and subscribe to new notifications
  useEffect(() => {
    if (!userId) return;

    joinUserRoom(userId);

    socket.on("newNotification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [userId]);

  // Fetch existing notifications from backend
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await fetch("/api/notifications", {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to fetch notifications");
//         const data: Notification[] = await res.json();
//         setNotifications(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchNotifications();
//   }, []);

  // Mark all notifications as read
//   const markAllAsRead = async () => {
//     try {
//       await fetch("/api/notifications/mark-read", {
//         method: "PATCH",
//         credentials: "include",
//       });
//       setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

  const trigger = (
    <div className="flex justify-center">
      <div className="relative p-2 rounded-lg hover:bg-purple-50/80 hover:scale-105 transition-all duration-300 inline-flex backdrop-blur-sm">
        <Bell className="w-6 h-6 text-gray-700 hover:text-purple-600 transition-colors duration-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full px-1.5 py-0.5 font-semibold animate-pulse">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Dropdown trigger={trigger} width="w-80">
      <div className="px-4 py-2 border-b border-purple-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Notifications
        </h3>
        {unreadCount > 0 && (
          <button
            // onClick={markAllAsRead}
            onClick={() => console.log('will mark in future')}
            className="text-xs text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors duration-300"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div>
        {notifications.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm text-center">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 border-b border-purple-50 cursor-pointer hover:bg-purple-50/90 transition-all duration-300 hover:border-l-4 hover:border-l-purple-400 ${
                !n.read ? "bg-purple-300/30" : ""
              }`}
            >
              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                {n.message}
              </p>
              <p className="text-xs text-purple-600 font-medium mt-1.5">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </Dropdown>
  );
};

export default NotificationsDropdown;
