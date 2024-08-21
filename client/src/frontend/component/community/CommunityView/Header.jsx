import React, { useState } from 'react';
import CustomModal from './CustomModal';

function Header({ name, status, memberCount, isAdmin, onLeaveCommunity, onDeleteCommunity }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleOpenModal = (type) => {
    setActionType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActionType('');
  };

  const handleConfirmAction = () => {
    if (actionType === 'delete') {
      onDeleteCommunity();
    } else if (actionType === 'leave') {
      onLeaveCommunity();
    }
    handleCloseModal();
  };

  return (
    <div className="header-component flex w-full mx-auto bg-gray-100 text-gray-800 font-sans p-4 rounded-lg shadow-md">
      <div className="group-info flex-1 flex-col justify-start">
        <h1 className="flex text-2xl">{name}</h1>
        <div className="group-title-info flex space-x-2 text-sm">
          <p className="group-status">{status} group</p>  
          <p className="group-members">{memberCount} Members</p>
        </div>
      </div>
      <div className="header-buttons flex space-x-2">
        {isAdmin ? (
          <button 
            onClick={() => handleOpenModal('delete')}
            className="delete-button bg-red-500 text-white px-2 h-9 rounded-xl hover:bg-red-600"
          >
            Delete Community
          </button>
        ) : (
          <button 
            onClick={() => handleOpenModal('leave')}
            className="leave-button bg-indigo-500 text-white px-2 h-9 rounded-xl hover:bg-red-600"
          >
            Leave Community
          </button>
        )}
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={actionType === 'delete' ? 'Confirm Delete Community' : 'Confirm Leave Community'}
        message={actionType === 'delete' ? 'Are you sure you want to delete this community? This action cannot be undone.' : 'Are you sure you want to leave this community?'}
      />
    </div>
  );
}

export default Header;
