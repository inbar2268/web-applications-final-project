import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { selectLoggedUser } from '../Redux/slices/loggedUserSlice';
import apiClient from "../services/apiClient";
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  CircularProgress,
  GlobalStyles
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import IMessage from '../interfaces/message.ts'
import IChat from '../interfaces/chat.ts'
import IUser from '../interfaces/user.ts'
import { getUserChats, getUserById, sendMessage } from '../services/chatService';


const ChatPage: React.FC = () => {
  const location = useLocation();
  const { chatId } = useParams<{ chatId: string }>();
  const currentUser = useSelector(selectLoggedUser);
  const navigate = useNavigate();
  const [chat, setChat] = useState<IChat | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<IUser | null>(null);
  const [otherUserId] = useState<string>(location.state?.otherUserId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const primaryColor = '#E8B08E'; 
  const secondaryColor = '#B05219'; 
  const backgroundColor = '#f5f5f5'; 

  useEffect(() => {
    if (!currentUser || !currentUser._id) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const socketUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      console.log('Socket.IO connected');
      socketRef.current?.emit('userConnected', currentUser._id);
    });

    socketRef.current.on('message', (data) => {
      if (data.chatId === chatId) {
        setMessages(prevMessages => [...prevMessages, data.message]);
      }
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setError('Failed to connect to the chat server.');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser, chatId]);

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;
    
    fetchChatData();
  }, [currentUser, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatData = () => {
    setLoading(true);
    setError('');

    if (!chatId || chatId === 'null') {
      setError('No chat selected. Please try again.');
      setLoading(false);
      return;
    }
    
    getUserChats(String(currentUser._id))
      .then((chatData) => {
        if (!chatData) {
          setError('Chat not found');
          setLoading(false);
          return;
        }

        const currentChat = chatData.find(chat => chat._id === chatId);

        if (!currentChat) {
          setError('Chat not found');
          setLoading(false);
          return;
        }

        setChat(currentChat);
        setMessages(currentChat.messages || []);

        if (otherUserId) {
          getUserById(otherUserId)
            .then((userData) => {
              setOtherUser(userData);
            })
            .catch((userErr) => {
              console.error('Error fetching other user:', userErr);
            });
        } else {
          console.error('Invalid participants data:');
          setError('No participants found in this chat.');
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching chat data:', err);
        setError('Failed to load chat data. Please try again later.');
        setLoading(false);
      });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatId || !currentUser?._id || !otherUser?._id) return;
    
    try {
      const messageToSend = {
        senderId: currentUser._id,
        receiverId: otherUser._id,
        message: newMessage
      };
  
      sendMessage(chatId, messageToSend)
      .then((response) => {
        setMessages(prev => [...prev, response]);
        setNewMessage("")
      }) 

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentUser) {
    return null; 
  }

  return (
    <>
      <GlobalStyles styles={{
        'html, body, #root, #app': {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }
      }} />
      
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          width: '100vw',
          m: 0,
          p: 0,
          bgcolor: backgroundColor,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}>
          <CircularProgress sx={{ color: secondaryColor }} />
        </Box>
      ) : error ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          width: '100vw',
          m: 0,
          p: 0,
          bgcolor: backgroundColor,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}>
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          <IconButton
            onClick={() =>navigate(`/profile/${otherUser?._id}`, { state: {  user: otherUser } })}
            sx={{
              bgcolor: primaryColor,
              color: 'white',
              '&:hover': {
                bgcolor: secondaryColor,
              },
              p: 1.5
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ 
          height: '100vh', 
          width: '100vw',
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: backgroundColor,
          m: 0,
          p: 0,
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}>
          <Box sx={{ 
            bgcolor: 'white', 
            boxShadow: 1, 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            width: '100%'
          }}>
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <IconButton 
                onClick={() =>navigate(`/profile/${otherUser?._id}`, { state: { user: otherUser } })}
                aria-label="Back to chats"
                sx={{ 
                  color: secondaryColor,
                  mr: 2
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              
              {otherUser && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: primaryColor, 
                      width: 40, 
                      height: 40, 
                      mr: 1.5,
                      color: 'white'
                    }}
                  >
                    {otherUser.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 500 }}>
                      {otherUser.username || 'User'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            width: '100%',
            m: 0,
            p: 0
          }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              p: 3
            }}>
              {messages.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%', 
                  color: 'text.secondary' 
                }}>
                  <Typography>No messages yet. Start a conversation!</Typography>
                </Box>
              ) : (
                messages.map((message, index) => {
                  const isCurrentUser = message.senderId === currentUser?._id;
                  return (
                    <Box 
                      key={message._id || `msg-${index}`} 
                      sx={{
                        display: 'flex',
                        justifyContent: isCurrentUser ? 'flex-start' : 'flex-end',
                      }}
                    >
                      {isCurrentUser && (
                        <Avatar
                          sx={{ 
                            bgcolor: secondaryColor,
                            width: 32,
                            height: 32,
                            mr: 1.5,
                            mt: 0.5,
                            color: 'white'
                          }}
                        >
                          {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                      )}
                      <Box sx={{ maxWidth: { xs: '70%', sm: '60%' } }}>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: 3,
                            bgcolor: isCurrentUser ? primaryColor : 'white',
                            color: isCurrentUser ? 'white' : 'text.primary',
                            border: isCurrentUser ? 'none' : `1px solid ${primaryColor}`,
                            display: 'inline-block'
                          }}
                        >
                          <Typography variant="body1">{message.content}</Typography>
                        </Paper>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block', 
                            mt: 0.5, 
                            color: 'text.secondary',
                            textAlign: isCurrentUser ? 'left' : 'right'
                          }}
                        >
                          {formatTime(message.timestamp)}
                        </Typography>
                      </Box>
                      {!isCurrentUser && (
                        <Avatar
                          sx={{ 
                            bgcolor: primaryColor,
                            width: 32,
                            height: 32,
                            ml: 1.5,
                            mt: 0.5,
                            color: 'white'
                          }}
                        >
                          {otherUser?.username?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                      )}
                    </Box>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Box>
          
          <Box 
            component="form"
            onSubmit={handleSendMessage}
            sx={{ 
              bgcolor: 'white', 
              borderTop: 1, 
              borderColor: 'divider', 
              p: 2,
            }}
          >
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center'
            }}>
              <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type something..."
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 6,
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />
              <IconButton 
                type="submit"
                disabled={!newMessage.trim()}
                sx={{ 
                  ml: 1.5,
                  bgcolor: primaryColor,
                  color: 'white',
                  '&:hover': {
                    bgcolor: secondaryColor,
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(232, 176, 142, 0.5)',
                  },
                  p: 1.25
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatPage;