'use client';

import useVectorChat from '@/hooks/store/useVectorChat';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from 'react';

export default function ChatSection(props: { storeId: string }) {
  const [inputMessage, setInputMessage] = useState("");
  const { init, messages, sendMessage } = useVectorChat();

  useEffect(() => { 
    init();
  }, []);
  
  const handleInputMessage = (e:any) => {
    setInputMessage(e.target.value);
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    const messageToSend = inputMessage;
    setInputMessage("");
    await sendMessage(props.storeId, messageToSend);

  }

  return (
    <>
      <Box sx={{ pt:2, border: 1, borderColor: 'grey.300', borderRadius: 2, height: '62vh', display: 'flex', flexDirection: 'column', overflowX: 'scroll' }}>
        {messages.map((msg, index) => (
            <Box key={index} sx={{ ml:2, mr:2, mb: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <Box sx={{
                display: 'inline-block', 
                p: 2, 
                borderRadius: 2, 
                bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.200', 
                color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                maxWidth: { xs: '85%', sm: '70%', md: '60%' },
                wordWrap: 'break-word',
                fontSize: '0.95rem',
                lineHeight: 1.4,
                boxShadow: 1
              }}>
                {msg.content}
              </Box>
            </Box>
        ))}
      </Box>
      <Box sx={{ flex: 1, p:1, overflow: 'auto' }}>
      </Box>
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.200' }}>
        <Grid container spacing={1}>
          <Grid size={10}>
            <TextField onChange={handleInputMessage} 
              value={inputMessage}
              fullWidth 
              variant="outlined" 
              placeholder="Type a message..." 
              size="small"/>
          </Grid>
          <Grid size={2}>
            <Button onClick={handleSendMessage} variant="contained" startIcon={<SendIcon/>} fullWidth>
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}