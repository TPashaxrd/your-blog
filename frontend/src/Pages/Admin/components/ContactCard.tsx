import React from "react";
import { FiTrash2 } from "react-icons/fi";

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
  const formattedDate = new Date(contact.createdAt).toLocaleString();

  return (
    <div className="bg-gray-900/80 rounded-2xl shadow-lg border border-purple-700 p-6 flex flex-col gap-4 relative transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/60">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-purple-400 font-semibold break-words">{contact.email}</span>
          <span className="text-gray-400 text-xs mt-1">{formattedDate}</span>
        </div>
        <button
          onClick={() => onDelete(contact._id)}
          className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 shadow-md hover:shadow-red-500/50"
          title="Delete Contact"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-300 break-words text-sm">{contact.message}</p>

      <span className="text-gray-500 text-xs">IP Address: {contact.IP_Address}</span>
    </div>
  );
};

export default ContactCard;