import React from "react";

interface Contact {
  _id: string;
  email: string;
  message: string;
  IP_Address: string;
  createdAt: string;
}

interface Props {
  contact: Contact;
  onDelete: (id: string) => void;
}

const ContactCard: React.FC<Props> = ({ contact, onDelete }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-5 hover:shadow-purple-500/50 transition-all duration-300 flex flex-col gap-3 relative">
      <div className="flex justify-between items-center">
        <span className="text-purple-400 font-semibold">{contact.email}</span>
        <span className="text-gray-400 text-xs">
          {new Date(contact.createdAt).toLocaleString()}
        </span>
      </div>

      <p className="text-gray-300 break-words">{contact.message}</p>

      <span className="text-gray-500 text-sm">IP: {contact.IP_Address}</span>

      <button
        onClick={() => onDelete(contact._id)}
        className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition-colors duration-300"
      >
        Delete
      </button>
    </div>
  );
};

export default ContactCard;