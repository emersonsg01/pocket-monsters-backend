import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TypeForm from './TypeForm';

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

const TypeCard = styled(motion.div)`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 100, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;

const TypeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TypeName = styled(motion.h1)`
  font-size: 2.5rem;
  background: linear-gradient(90deg, #64f0ff, #8a64ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

const MonsterCount = styled.div`
  font-size: 1rem;
  color: #a0a0ff;
  background: rgba(100, 100, 255, 0.1);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  display: inline-block;
`;

const MonstersList = styled.div`
  margin-top: 2rem;
`;

const MonstersTitle = styled.h3`
  font-size: 1.3rem;
  color: #64f0ff;
  margin-bottom: 1rem;
`;

const MonsterItem = styled(motion.div)`
  background: rgba(20, 20, 40, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(30, 30, 60, 0.5);
    transform: translateX(5px);
  }
`;

const MonsterName = styled.span`
  font-size: 1rem;
  color: #e0e0ff;
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

const TypeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [type, setType] = useState(null);
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    const fetchTypeData = async () => {
      try {
        setLoading(true);
        
        // Fetch type data
        const typeResponse = await axios.get(`http://localhost:3000/type/${id}`);
        const typeData = typeResponse.data[0];
        
        if (!typeData) {
          throw new Error('Type not found');
        }
        
        setType(typeData);
        
        // Fetch monsters with this type
        const monstersResponse = await axios.get('http://localhost:3000/pocket-monster');
        const typeMonsters = monstersResponse.data.filter(monster => monster.type_id === typeData.id);
        setMonsters(typeMonsters);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching type data:', err);
        setError('Failed to load type details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTypeData();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      
      // Check if there are monsters with this type
      if (monsters.length > 0) {
        throw new Error('Cannot delete this type because it is used by one or more monsters.');
      }
      
      await axios.delete(`http://localhost:3000/type/${id}`);
      navigate('/types');
    } catch (err) {
      console.error('Error deleting type:', err);
      setError(err.message || 'Failed to delete type. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const handleEditSuccess = () => {
    setIsEditing(false);
    // Refresh type data
    const fetchUpdatedType = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/type/${id}`);
        setType(response.data[0]);
      } catch (err) {
        console.error('Error fetching updated type data:', err);
      }
    };
    
    fetchUpdatedType();
  };
  
  return (
    <DetailContainer>
      <BackButton 
        onClick={() => navigate('/types')}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        ← Back to Types
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
          <TypeForm 
            typeId={id} 
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
      ) : type ? (
        <>
          <TypeCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TypeHeader>
              <div>
                <TypeName
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {type.type}
                </TypeName>
                <MonsterCount>{monsters.length} {monsters.length === 1 ? 'Monster' : 'Monsters'}</MonsterCount>
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
            </TypeHeader>
            
            {monsters.length > 0 && (
              <MonstersList>
                <MonstersTitle>Monsters with this type:</MonstersTitle>
                {monsters.map(monster => (
                  <MonsterItem 
                    key={monster.id}
                    onClick={() => navigate(`/monsters/${monster.id}`)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MonsterName>{monster.name}</MonsterName>
                  </MonsterItem>
                ))}
              </MonstersList>
            )}
          </TypeCard>
        </>
      ) : (
        <ErrorMessage>Type not found</ErrorMessage>
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
            <DialogTitle>Delete Type</DialogTitle>
            <DialogText>
              {monsters.length > 0 
                ? `Cannot delete "${type?.type}" because it is used by ${monsters.length} monster(s).`
                : `Are you sure you want to delete "${type?.type}"? This action cannot be undone.`}