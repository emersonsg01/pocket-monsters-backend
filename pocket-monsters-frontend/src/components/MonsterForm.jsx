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

const TextArea = styled.textarea`
  padding: 0.8rem 1rem;
  background: rgba(20, 20, 40, 0.6);
  border: 1px solid rgba(100, 100, 255, 0.2);
  border-radius: 8px;
  color: #e0e0ff;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(100, 240, 255, 0.6);
    box-shadow: 0 0 0 2px rgba(100, 240, 255, 0.2);
  }
`;

const Select = styled.select`
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
  
  option {
    background: rgba(20, 20, 40, 0.9);
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

const MonsterForm = ({ monsterId = null, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    type_id: ''
  });
  
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch types and monster data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch types
        const typesResponse = await axios.get('http://localhost:3000/type');
        setTypes(typesResponse.data);
        
        // If editing, fetch monster data
        if (monsterId) {
          const monsterResponse = await axios.get(`http://localhost:3000/pocket-monster/${monsterId}`);
          const monster = monsterResponse.data[0];
          if (monster) {
            setFormData({
              name: monster.name,
              desc: monster.desc || '',
              type_id: monster.type_id.toString()
            });
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load form data. Please try again.');
      }
    };
    
    fetchData();
  }, [monsterId]);
  
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
      if (!formData.name.trim()) {
        throw new Error('Monster name is required');
      }
      
      if (!formData.type_id) {
        throw new Error('Please select a type');
      }
      
      const payload = {
        name: formData.name.trim(),
        desc: formData.desc.trim(),
        type_id: parseInt(formData.type_id)
      };
      
      let response;
      
      if (monsterId) {
        // Update existing monster
        response = await axios.put(`http://localhost:3000/pocket-monster/${monsterId}`, payload);
      } else {
        // Create new monster
        response = await axios.post('http://localhost:3000/pocket-monster', payload);
      }
      
      setSuccess(true);
      
      // Reset form if creating new monster
      if (!monsterId) {
        setFormData({
          name: '',
          desc: '',
          type_id: ''
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
      setError(err.message || 'Failed to save monster. Please try again.');
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
        {monsterId ? 'Edit Monster' : 'Add New Monster'}
      </Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Monster Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter monster name"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="desc">Description</Label>
          <TextArea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Enter monster description"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="type_id">Type</Label>
          <Select
            id="type_id"
            name="type_id"
            value={formData.type_id}
            onChange={handleChange}
          >
            <option value="">Select a type</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SubmitButton
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? 'Saving...' : monsterId ? 'Update Monster' : 'Create Monster'}
        </SubmitButton>
        
        {success && (
          <SuccessMessage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {monsterId ? 'Monster updated successfully!' : 'Monster created successfully!'}
          </SuccessMessage>
        )}
      </Form>
    </FormContainer>
  );
};

export default MonsterForm;