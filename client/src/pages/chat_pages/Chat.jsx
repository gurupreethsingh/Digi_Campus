import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import globalBackendRoute from "../../config/Config";

const Chat = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({});
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setLoggedInUser(decoded);
    }
  }, []);

  useEffect(() => {
    if (!loggedInUser) return;
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${globalBackendRoute}/api/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.filter((u) => u._id !== loggedInUser.id));
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, [loggedInUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (!message || !selectedUser) return;

    const newMessage = {
      from: "me",
      content: message,
      time: new Date(),
    };

    setChats((prev) => ({
      ...prev,
      [selectedUser._id]: [...(prev[selectedUser._id] || []), newMessage],
    }));
    setMessage("");

    setUsers((prev) => [
      selectedUser,
      ...prev.filter((u) => u._id !== selectedUser._id),
    ]);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  return (
    <div className="w-full  flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-72  flex flex-col mr-2">
        <div className="px-4 py-2 text-lg font-semibold border-b bg-gray-100">
          All Users
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 border-b ${
                selectedUser?._id === user._id
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
            >
              {user.name || user.username || user.email}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <div className="px-4  bg-white text-gray-800 font-semibold text-sm sm:text-base">
          {selectedUser
            ? selectedUser.name || selectedUser.email
            : "Select a user"}
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-2">
          {selectedUser ? (
            (chats[selectedUser._id] || []).length > 0 ? (
              <>
                {chats[selectedUser._id].map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[85%] sm:max-w-[60%] px-4 py-2 rounded-xl text-sm ${
                      msg.from === "me"
                        ? "self-end bg-green-100"
                        : "self-start bg-white border"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="text-gray-400 mt-10 text-center w-full">
                No messages yet.
              </div>
            )
          ) : (
            <div className="text-gray-400 mt-10 text-center w-full">
              Select a user to start chatting.
            </div>
          )}
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="bg-white p-3 border-t flex items-center flex-wrap gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 text-sm"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
