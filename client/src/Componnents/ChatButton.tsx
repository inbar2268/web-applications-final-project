import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLoggedUser } from '../Redux/slices/loggedUserSlice'; // Adjust based on your state management
import apiClient from '../services/apiClient.ts'
import { Button, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

interface ChatButtonProps {
  userId: string;
  className?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ userId, className = '' }) => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectLoggedUser); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartChat = async () => {
    if (!currentUser) {
      return; 
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get(`/chats/${currentUser._id}`);
      
      if (Array.isArray(response.data)) {

        let existingChat = null;
        response.data.forEach(chat => {
          if(chat.participants.includes(currentUser._id) && chat.participants.includes(userId))
            existingChat = chat;
        });

        if (existingChat) {
          navigate(`/chat/${existingChat._id}`, { state: { otherUserId: userId }});
        } else {
            const createChatResponse = await apiClient.post('/chats', {
            userId1: currentUser._id,
            userId2: userId,
          });

          const newChat = createChatResponse.data;
          navigate(`/chat/${newChat._id}`, { state: { otherUserId: userId }});
        }
      } else {
        setError('Unexpected response format from server. Please try again later.');
      }
    } catch (err) {
      console.error('Error starting chat:', err);
      setError('Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = '#E8B08E';
  const secondaryColor = '#B05219';

  return (
    <>
      <Button
        variant="contained"
        onClick={handleStartChat}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ChatIcon />}
        className={className}
        sx={{
          bgcolor: primaryColor,
          color: 'white',
          '&:hover': {
            bgcolor: secondaryColor,
          },
          borderRadius: '8px',
          textTransform: 'none',
          px: 2,
          py: 1,
          fontWeight: 500,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&.Mui-disabled': {
            bgcolor: 'rgba(232, 176, 142, 0.5)',
            color: 'white',
          }
        }}
      >
        {loading ? 'Connecting...' : 'Message'}
      </Button>
      {error && <p style={{ color: 'red', marginTop: '8px', fontSize: '0.75rem' }}>{error}</p>}
    </>
  );
};

export default ChatButton;
