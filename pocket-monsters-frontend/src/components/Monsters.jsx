import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MonstersContainer = styled.div`
  padding: 1rem 0;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #64f0ff, #8a64ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  text-align: center;
`;

const MonsterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const MonsterCard = styled(motion.div)`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 100, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(100, 100, 255, 0.2);
    border-color: rgba(100, 240, 255, 0.4);
  }
`;

const MonsterName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #64f0ff;
`;

const MonsterDescription = styled.p`
  font-size: 1rem;
  color: #c0c0ff;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const MonsterType = styled.div`
  font-size: 0.9rem;
  color: #a0a0ff;
  background: rgba(100, 100, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  margin-top: auto;
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

const AddButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #64f0ff, #8a64ff);
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(100, 240, 255, 0.4);
  border: none;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 25px rgba(100, 240, 255, 0.6);
  }
`;

const Monsters = () => {
  const [monsters, setMonsters] = useState([]);
  const [types, setTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch types first
        const typesResponse = await axios.get('http://localhost:3000/type');
        const typesMap = {};
        typesResponse.data.forEach(type => {
          typesMap[type.id] = type.type;
        });
        setTypes(typesMap);
        
        // Then fetch monsters
        const monstersResponse = await axios.get('http://localhost:3000/pocket-monster');
        setMonsters(monstersResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load monsters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <MonstersContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Pocket Monsters Collection
      </Title>

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          <MonsterGrid
            as={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {monsters.map((monster) => (
              <MonsterCard 
                key={monster.id} 
                variants={itemVariants}
                onClick={() => navigate(`/monsters/${monster.id}`)}
              >
                <MonsterName>{monster.name}</MonsterName>
                <MonsterDescription>{monster.desc || 'No description available.'}</MonsterDescription>
                <MonsterType>{types[monster.type_id] || 'Unknown Type'}</MonsterType>
              </MonsterCard>
            ))}
          </MonsterGrid>
          
          <AddButton
            onClick={() => navigate('/monsters/new')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            +
          </AddButton>
        </>
      )}
    </MonstersContainer>
  );
};

export default Monsters;