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

export const RecipeGeneratorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dishName, setDishName] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState('');

  const handleDishNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDishName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!dishName.trim()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const recipe = await generateRecipe(dishName);
      setGeneratedRecipe(recipe);
    } catch (error) {
        setGeneratedRecipe("Error generating recipe. Please try again.");
        console.error("Error generating recipe:", error);
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
        height: 500, // Keeping original fixed height
        width: 1500, // Keeping original fixed width
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
          position: 'absolute', // Keeping original absolute positioning
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
            Enter Dish Name
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
                label="Enter a dish name"
                multiline
                value={dishName}
                onChange={handleDishNameChange}
                variant="outlined"
                placeholder="Enter the name of a dish you'd like a recipe for..."
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
                disabled={isLoading || !dishName.trim()}
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
                  "Generate Recipe"
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
            Your Recipe
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
              borderWidth: '2px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ 
              padding: 2,
              "&:last-child": {
                paddingBottom: 2
              },
              flexGrow: 1,
              display: 'flex',
              height: '100%', // Ensure full height
              overflow: 'hidden' // Prevent overflow from breaking layout
            }}>
              {isLoading ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  width: '100%' 
                }}>
                  <CircularProgress sx={{ color: '#E8B08E' }} />
                </Box>
              ) : generatedRecipe ? (
                <Box sx={{ 
                  width: '100%',
                  height: '100%',
                  overflow: 'auto' // Enable scrolling within the fixed container
                }}>
                  <Typography 
                    variant="body1" 
                    component="div" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word' // Ensure text wraps properly
                    }}
                  >
                    {generatedRecipe}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  flexDirection: 'column',
                  color: 'text.secondary'
                }}>
                  <Typography variant="body1" align="center">
                    Your recipe will appear here
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    Enter a dish name and click "Generate Recipe"
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

export default RecipeGeneratorPage;