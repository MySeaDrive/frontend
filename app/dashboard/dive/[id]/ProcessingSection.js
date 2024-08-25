'use client'

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import TimeAgo from '@/app/components/TimeAgo';

export default function  ProcessingSection({ processingItems }) {
    
    if (processingItems.length === 0) {
      return null;
    }
  
    return (
      <div className="mt-8 mb-8">
        <h3 className="text-xl font-bold mb-4">Uploads being processed</h3>
        <Table aria-label="Processing media items">
          <TableHeader>
            <TableColumn>FILENAME</TableColumn>
            <TableColumn>TIME</TableColumn>
          </TableHeader>
          <TableBody>
            {processingItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.filename}</TableCell>
                <TableCell><TimeAgo timestamp={item.created_at} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };