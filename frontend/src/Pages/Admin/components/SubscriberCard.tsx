import React from "react";

interface Subscriber {
  _id: string;
  email: string;
  IP_Address: string;
}

interface Props {
  subscriber: Subscriber;
  onDelete: (id: string) => void;
}

const SubscriberCard: React.FC<Props> = ({ subscriber, onDelete }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300 border border-gray-700 hover:border-purple-600 flex flex-col gap-2">
      <span className="text-gray-400 text-sm">Email:</span>
      <p className="text-white font-medium break-words">{subscriber.email}</p>

      <span className="text-gray-400 text-sm mt-2">IP Address:</span>
      <p className="text-white font-medium">{subscriber.IP_Address}</p>

      <button
        onClick={() => onDelete(subscriber._id)}
        className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition-colors duration-300"
      >
        Delete
      </button>
    </div>
  );
};

export default SubscriberCard;
