import React from 'react';
import Button from './Button'; 

const EmailReminderControls = ({ onSendReminder, isSending }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Email Reminders</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => onSendReminder('morning')}
          disabled={isSending}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          {isSending ? 'Sending...' : 'Send Morning To-Dos'}
        </Button>
        <Button 
          onClick={() => onSendReminder('evening')}
          disabled={isSending}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          {isSending ? 'Sending...' : 'Send Evening Summary'}
        </Button>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Note: This simulates sending emails. Actual email functionality requires backend setup with your Google Apps Script.
      </p>
    </div>
  );
};

export default EmailReminderControls;