import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #64f0ff, #8a64ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  max-width: 800px;
  margin-bottom: 2rem;
  color: #a0a0ff;
  line-height: 1.6;
`;

const FeaturesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 100, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(100, 100, 255, 0.2);
    border-color: rgba(100, 240, 255, 0.4);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #64f0ff;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: #c0c0ff;
  line-height: 1.5;
`;

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <HomeContainer>
      <Title
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Welcome to Pocket Monsters Database
      </Title>
      
      <Subtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        Explore the fascinating world of Pocket Monsters with our futuristic interface. 
        Browse, search, and discover detailed information about various monsters and their types.
      </Subtitle>
      
      <FeaturesContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <FeatureCard variants={itemVariants}>
          <FeatureTitle>Comprehensive Database</FeatureTitle>
          <FeatureDescription>
            Access detailed information about all pocket monsters, including their types, descriptions, and more.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard variants={itemVariants}>
          <FeatureTitle>Type Classification</FeatureTitle>
          <FeatureDescription>
            Explore monsters by their types and learn about the characteristics of each type category.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard variants={itemVariants}>
          <FeatureTitle>Futuristic Interface</FeatureTitle>
          <FeatureDescription>
            Experience a sleek, modern interface with smooth animations and a dark theme for comfortable viewing.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesContainer>
    </HomeContainer>
  );
};

export default Home;