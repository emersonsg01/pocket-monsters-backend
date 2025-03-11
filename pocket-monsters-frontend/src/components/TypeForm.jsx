import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import axios from 'axios';

const FormContainer = styled.div`
  padding: 2rem;
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 100, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  margin: 0 auto;
  margin-top: 2rem;
`;

const Title = styled(motion.h2)`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #64f0ff, #8a64ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #a0a0ff;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  background: rgba(20, 20, 40, 0.6);
  border: 1px solid rgba(100, 100, 255, 0.2);
  border-radius: 8px;
  color: #e0e0ff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(100, 240, 255, 0.6);
    box-shadow: 0 0 0 2px rgba(100, 240, 255, 0.2);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, rgba(100, 240, 255, 0.2), rgba(138, 100, 255, 0.2));
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 8px;
  color: #e0e0ff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(90deg, rgba(100, 240, 255, 0.3), rgba(138, 100, 255, 0.3));
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6464;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  background: rgba(255, 100, 100, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
`;

const SuccessMessage = styled(motion.div)`
  color: #64ff8a;
  font-size: 0.9rem;
  margin-top: 1rem;
  background: rgba(100, 255, 138, 0.1);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  text-align: center;
`;

const TypeForm = ({ typeId = null, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    type: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch type data if editing
  useEffect(() => {
    const fetchData = async () => {
      if (typeId) {
        try {
          const typeResponse = await axios.get(`http://localhost:3000/type/${typeId}`);
          const type = typeResponse.data[0];
          if (type) {
            setFormData({
              type: type.type
            });
          }
        } catch (err) {
          console.error('Error fetching type data:', err);
          setError('Failed to load type data. Please try again.');
        }
      }
    };
    
    fetchData();
  }, [typeId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validate form
      if (!formData.type.trim()) {
        throw new Error('Type name is required');
      }
      
      const payload = {
        type: formData.type.trim()
      };
      
      let response;
      
      if (typeId) {
        // Update existing type
        response = await axios.put(`http://localhost:3000/type/${typeId}`, payload);
      } else {
        // Create new type
        response = await axios.post('http://localhost:3000/type', payload);
      }
      
      setSuccess(true);
      
      // Reset form if creating new type
      if (!typeId) {
        setFormData({
          type: ''
        });
      }
      
      // Call success callback
      onSuccess(response.data);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to save type. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <FormContainer>
      <Title
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {typeId ? 'Edit Type' : 'Add New Type'}
      </Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="type">Type Name</Label>
          <Input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Enter type name"
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SubmitButton
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? 'Saving...' : typeId ? 'Update Type' : 'Create Type'}
        </SubmitButton>
        
        {success && (
          <SuccessMessage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {typeId ? 'Type updated successfully!' : 'Type created successfully!'}
          </SuccessMessage>
        )}
      </Form>
    </FormContainer>
  );
};

export default TypeForm;