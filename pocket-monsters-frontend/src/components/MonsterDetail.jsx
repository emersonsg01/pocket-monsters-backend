import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MonsterForm from './MonsterForm';

const DetailContainer = styled.div`
  padding: 1rem 0;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: rgba(30, 30, 60, 0.5);
  border: 1px solid rgba(100, 100, 255, 0.2);
  color: #64f0ff;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(40, 40, 80, 0.7);
    border-color: rgba(100, 240, 255, 0.4);
    transform: translateX(-5px);
  }
`;

const MonsterCard = styled(motion.div)`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 100, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;

const MonsterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const MonsterName = styled(motion.h1)`
  font-size: 2.5rem;
  background: linear-gradient(90deg, #64f0ff, #8a64ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

const MonsterType = styled.div`
  font-size: 1rem;
  color: #a0a0ff;
  background: rgba(100, 100, 255, 0.1);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  display: inline-block;
`;

const MonsterDescription = styled.p`
  font-size: 1.1rem;
  color: #c0c0ff;
  line-height: 1.6;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(20, 20, 40, 0.3);
  border-radius: 8px;
  border-left: 3px solid rgba(100, 240, 255, 0.4);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditButton = styled(ActionButton)`
  background: rgba(100, 240, 255, 0.1);
  border: 1px solid rgba(100, 240, 255, 0.3);
  color: #64f0ff;
  
  &:hover {
    background: rgba(100, 240, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled(ActionButton)`
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  color: #ff6464;
  
  &:hover {
    background: rgba(255, 100, 100, 0.2);
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid rgba(100, 100, 255, 0.1);
  border-top: 3px solid #64f0ff;
`;

const ErrorMessage = styled.div`
  color: #ff6464;
  text-align: center;
  padding: 2rem;
  background: rgba(255, 100, 100, 0.1);
  border-radius: 12px;
  margin: 2rem 0;
`;

const ConfirmDialog = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 26, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const DialogContent = styled(motion.div)`
  background: rgba(30, 30, 60, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 100, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

const DialogTitle = styled.h3`
  font-size: 1.5rem;
  color: #ff6464;
  margin-bottom: 1rem;
`;

const DialogText = styled.p`
  font-size: 1rem;
  color: #e0e0ff;
  margin-bottom: 1.5rem;
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled(ActionButton)`
  background: rgba(100, 100, 255, 0.1);
  border: 1px solid rgba(100, 100, 255, 0.3);
  color: #a0a0ff;
  
  &:hover {
    background: rgba(100, 100, 255, 0.2);
  }
`;

const ConfirmButton = styled(ActionButton)`
  background: rgba(255, 100, 100, 0.2);
  border: 1px solid rgba(255, 100, 100, 0.4);
  color: #ff6464;
  
  &:hover {
    background: rgba(255, 100, 100, 0.3);
  }
`;

const MonsterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [monster, setMonster] = useState(null);
  const [typeName, setTypeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    const fetchMonsterData = async () => {
      try {
        setLoading(true);
        
        // Fetch monster data
        const monsterResponse = await axios.get(`http://localhost:3000/pocket-monster/${id}`);
        const monsterData = monsterResponse.data[0];
        
        if (!monsterData) {
          throw new Error('Monster not found');
        }
        
        setMonster(monsterData);
        
        // Fetch type data
        const typeResponse = await axios.get(`http://localhost:3000/type/${monsterData.type_id}`);
        const typeData = typeResponse.data[0];
        
        if (typeData) {
          setTypeName(typeData.type);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching monster data:', err);
        setError('Failed to load monster details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMonsterData();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(`http://localhost:3000/pocket-monster/${id}`);
      navigate('/monsters');
    } catch (err) {
      console.error('Error deleting monster:', err);
      setError('Failed to delete monster. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const handleEditSuccess = () => {
    setIsEditing(false);
    // Refresh monster data
    const fetchUpdatedMonster = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pocket-monster/${id}`);
        setMonster(response.data[0]);
      } catch (err) {
        console.error('Error fetching updated monster data:', err);
      }
    };
    
    fetchUpdatedMonster();
  };
  
  return (
    <DetailContainer>
      <BackButton 
        onClick={() => navigate('/monsters')}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        ← Back to Monsters
      </BackButton>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : isEditing ? (
        <>
          <MonsterForm 
            monsterId={id} 
            onSuccess={handleEditSuccess} 
          />
          <ButtonGroup>
            <CancelButton 
              onClick={() => setIsEditing(false)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel Editing
            </CancelButton>
          </ButtonGroup>
        </>
      ) : monster ? (
        <>
          <MonsterCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MonsterHeader>
              <div>
                <MonsterName
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {monster.name}
                </MonsterName>
                <MonsterType>{typeName || 'Unknown Type'}</MonsterType>
              </div>
              
              <ButtonGroup>
                <EditButton 
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Edit
                </EditButton>
                <DeleteButton 
                  onClick={() => setShowDeleteConfirm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </DeleteButton>
              </ButtonGroup>
            </MonsterHeader>
            
            <MonsterDescription>
              {monster.desc || 'No description available for this monster.'}
            </MonsterDescription>
          </MonsterCard>
        </>
      ) : (
        <ErrorMessage>Monster not found</ErrorMessage>
      )}
      
      {showDeleteConfirm && (
        <ConfirmDialog
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DialogContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle>Delete Monster</DialogTitle>
            <DialogText>
              Are you sure you want to delete "{monster?.name}"? This action cannot be undone.
            </DialogText>
            <DialogButtons>
              <CancelButton 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </CancelButton>
              <ConfirmButton 
                onClick={handleDelete}
                disabled={deleteLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </ConfirmButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmDialog>
      )}
    </DetailContainer>
  );
};

export default MonsterDetail;