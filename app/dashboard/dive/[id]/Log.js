'use client'

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Switch } from "@heroui/react";
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
// import FaEdit from 'react-icons/fa/faEdit'
// import FaSave from 'react-icons/fa/faSave'
// import FaTimes from 'react-icons/fa/faTimes'
import { fetchWithAuth } from '@/app/utils/api';
import toast from 'react-hot-toast';
import {TimeInput} from "@heroui/react";
import {Time} from "@internationalized/date";

const Log = ({ diveId, diveDate }) => {
  const [log, setLog] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchLog();
  }, [diveId]);

  const fetchLog = async () => {
    try {
      const data = await fetchWithAuth(`/dives/${diveId}/log`);
      setLog(data);
      setFormData(data);
    } catch (error) {
        if(error.message === '404') {
            return;
        }
      toast.error('Failed to fetch log');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleTimeChange = (e) => {
    
    if (formData.dive_start_time) {
        const diveDateTime = diveDate? new Date(diveDate): new Date();

        diveDateTime.setHours(e.hour, e.minute);
        let dateTimeString = diveDateTime.toISOString();

        handleInputChange({
            target: {
                name: 'dive_start_time',
                value:dateTimeString,
                type: 'date'
            }
        });
    }
    
  };

  const handleSave = async () => {
    try {
      await fetchWithAuth(`/dives/${diveId}/log`, {
        method: 'POST',
        body: formData
      });
      setLog(formData);
      toast.success('Log updated successfully');
    } catch (error) {
      console.error('Error updating log:', error);
      toast.error('Failed to updating log');
    }
  };

  const getDiveStartTime = () => {
    const diveStartTime = new Date(formData.dive_start_time);
    return new Time(diveStartTime.getHours(), diveStartTime.getMinutes());
  }

  const renderEditMode = () => (
    <form className="space-y-4">
      <Input
        label="Starting Air (bar)"
        name="starting_air"
        type="number"
        value={formData.starting_air || ''}
        onChange={handleInputChange}
      />
      <Input
        label="Ending Air (bar)"
        name="ending_air"
        type="number"
        value={formData.ending_air || ''}
        onChange={handleInputChange}
      />
      {/* <Input
        label="Dive Start Time"
        name="dive_start_time"
        type="time"
        value={formData.dive_start_time ? new Date(formData.dive_start_time).toTimeString().slice(0, 5) : ''}
        onChange={handleInputChange}
      /> */}

      <TimeInput 
        label="Entry Time" 
        name="dive_start_time"
        value={formData.dive_start_time ? getDiveStartTime() : null}
        onChange={handleTimeChange}
      />
      <Input
        label="Duration (minutes)"
        name="dive_duration"
        type="number"
        value={formData.dive_duration || ''}
        onChange={handleInputChange}
      />
      <Input
        label="Max Depth (meters)"
        name="max_depth"
        type="number"
        value={formData.max_depth || ''}
        onChange={handleInputChange}
      />
      <Input
        label="Visibility (meters)"
        name="visibility"
        type="number"
        value={formData.visibility || ''}
        onChange={handleInputChange}
      />
      <Input
        label="Water Temperature (°C)"
        name="water_temperature"
        type="number"
        value={formData.water_temperature || ''}
        onChange={handleInputChange}
      />
      <Input
        label="Wetsuit Thickness (mm)"
        name="wetsuit_thickness"
        type="number"
        value={formData.wetsuit_thickness || ''}
        onChange={handleInputChange}
      />
      <Input
        label="Wetsuit Type"
        name="wetsuit_type"
        value={formData.wetsuit_type || ''}
        onChange={handleInputChange}
      />
      <Input
        label="Weights (kg)"
        name="weights"
        type="number"
        value={formData.weights || ''}
        onChange={handleInputChange}
      />
      <Input
        label="Fish IDs (comma-separated)"
        name="fish_ids"
        value={formData.fish_ids?.join(', ') || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, fish_ids: e.target.value.split(',').map(id => id.trim()) }))}
      />
      <Textarea
        label="Notes"
        name="notes"
        value={formData.notes || ''}
        onChange={handleInputChange}
      />
    </form>
  );

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold"> log</h3>

          <Button size="sm" color="primary" onClick={handleSave}>
            <FaEdit /> Update
          </Button>
      </div>
      {renderEditMode()}
    </Card>
  );
};

export default Log;