import React from "react";
import ContactCard from "./ContactCard";

interface Contact {
  _id: string;
  email: string;
  message: string;
  IP_Address: string;
  createdAt: string;
}

interface Props {
  contacts: Contact[];
  onDelete: (id: string) => void;
}

const ContactsList: React.FC<Props> = ({ contacts, onDelete }) => {
  if (!contacts || contacts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {contacts.map((c) => (
        <ContactCard key={c._id} contact={c} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ContactsList;