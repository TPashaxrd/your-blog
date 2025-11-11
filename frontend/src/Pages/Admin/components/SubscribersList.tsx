import React from "react";
import SubscriberCard from "./SubscriberCard";

interface Subscriber {
  _id: string;
  email: string;
  IP_Address: string;
}

interface Props {
  subscribers: Subscriber[];
  onDelete: (id: string) => void;
}

const SubscribersList: React.FC<Props> = ({ subscribers, onDelete }) => {
  if (!subscribers || subscribers.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-purple-600 inline-block pb-1">
        Subscribers
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subscribers.map((s) => (
          <SubscriberCard key={s._id} subscriber={s} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default SubscribersList;