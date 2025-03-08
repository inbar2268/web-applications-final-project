import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { generateRecipe } from '../services/gptGenerator';

export const GPTGeneratorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!prompt.trim()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const content = await generateRecipe(prompt);
      setGeneratedContent(content);
    } catch (error) {
        setGeneratedContent("Error generating content. Please try again.");
        console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const headerHeight = 80; 
  const sectionHeaderHeight = 40; 
  const buttonHeight = 50; 
  
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: 4, 
        mb: 8,
        height: 500, 
        width: 1500, 
        position: 'relative'
      }}
    >
      <Typography 
        variant="h3" 
        component="h1" 
        align="center" 
        sx={{ 
          fontWeight: 700, 
          color: '#B05219',
          height: headerHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Recipe Generator
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          backgroundColor: '#FFF8F3',
          position: 'absolute',
          top: headerHeight,
          bottom: 0,
          left: 0,
          right: 0,
          mx: 3,
          display: 'flex'
        }}
      >
        <Box sx={{ 
          width: '50%', 
          pr: 2,
          height: '100%',
          position: 'relative'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#B05219',
              height: sectionHeaderHeight,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Create Your Prompt
          </Typography>
          
          <form 
            onSubmit={handleSubmit} 
            style={{ 
              position: 'absolute',
              top: sectionHeaderHeight,
              bottom: 0,
              left: 0,
              right: 0,
              paddingRight: 16
            }}
          >
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              bottom: buttonHeight + 16, 
              left: 0, 
              right: 0 
            }}>
              <TextField
                fullWidth
                label="Enter your prompt"
                multiline
                value={prompt}
                onChange={handlePromptChange}
                variant="outlined"
                placeholder="Describe what you'd like the AI to generate..."
                sx={{ 
                  height: '100%',
                  '& .MuiInputBase-root': {
                    height: '100%'
                  },
                  '& .MuiInputBase-input': {
                    height: '100% !important',
                    overflow: 'auto'
                  }
                }}
              />
            </Box>
            
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              height: buttonHeight 
            }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading || !prompt.trim()}
                sx={{
                  height: '100%',
                  backgroundColor: '#E8B08E',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#B05219',
                  },
                  '&:disabled': {
                    backgroundColor: '#E0E0E0',
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  "Generate Content"
                )}
              </Button>
            </Box>
          </form>
        </Box>
        
        <Box sx={{ 
          width: '50%', 
          pl: 2,
          height: '100%',
          position: 'relative'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#B05219',
              height: sectionHeaderHeight,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Generated Content
          </Typography>
          
          <Card 
            variant="outlined" 
            sx={{ 
              position: 'absolute',
              top: sectionHeaderHeight,
              bottom: 0,
              left: 16,
              right: 0,
              borderColor: '#E8B08E',
              borderWidth: '2px'
            }}
          >
            <CardContent sx={{ 
              height: '100%',
              padding: 2,
              "&:last-child": {
                paddingBottom: 2
              }
            }}>
              {isLoading ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%' 
                }}>
                  <CircularProgress sx={{ color: '#E8B08E' }} />
                </Box>
              ) : generatedContent ? (
                <Box sx={{ 
                  height: '100%',
                  overflow: 'auto'
                }}>
                  <Typography 
                    variant="body1" 
                    component="div" 
                    sx={{ 
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {generatedContent}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  color: 'text.secondary'
                }}>
                  <Typography variant="body1" align="center">
                    Your generated content will appear here
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    Enter a prompt and click "Generate Content"
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
};

export default GPTGeneratorPage;