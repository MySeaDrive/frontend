import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function TimeAgo({ timestamp }) {
  const date = parseISO(timestamp);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return (
    <span title={date.toLocaleString()} className="text-sm text-gray-500">
      {timeAgo}
    </span>
  );
};