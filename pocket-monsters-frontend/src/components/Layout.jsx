import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link, Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #0a0a1a;
  color: #e0e0ff;
  position: relative;
  overflow: hidden;
`;

const Header = styled.header`
  padding: 1.5rem;
  background-color: rgba(20, 20, 40, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(100, 100, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const Logo = styled(motion.div)`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(90deg, #64f0ff, #8a64ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #a0a0ff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
  
  &:hover {
    color: #64f0ff;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, #64f0ff, #8a64ff);
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const Footer = styled.footer`
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(160, 160, 255, 0.7);
  background-color: rgba(20, 20, 40, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(100, 100, 255, 0.2);
  z-index: 10;
`;

const BackgroundEffect = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Circle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 100, 255, 0.2) 0%, rgba(100, 100, 255, 0) 70%);
`;

const Layout = () => {
  const [circles] = useState([
    { size: '40vw', top: '10%', left: '10%', duration: 120 },
    { size: '35vw', top: '60%', left: '70%', duration: 100 },
    { size: '25vw', top: '40%', left: '30%', duration: 80 },
  ]);

  return (
    <LayoutContainer>
      <BackgroundEffect>
        {circles.map((circle, index) => (
          <Circle
            key={index}
            style={{
              width: circle.size,
              height: circle.size,
              top: circle.top,
              left: circle.left,
            }}
            animate={{
              x: [0, 30, 0, -30, 0],
              y: [0, 20, 0, -20, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: circle.duration,
              ease: 'linear',
            }}
          />
        ))}
      </BackgroundEffect>
      
      <Header>
        <Logo
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          POCKET MONSTERS
        </Logo>
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/monsters">Monsters</NavLink>
          <NavLink to="/types">Types</NavLink>
        </Nav>
      </Header>
      
      <Main>
        <Outlet />
      </Main>
      
      <Footer>
        &copy; {new Date().getFullYear()} Pocket Monsters Database | Futuristic Tech Interface
      </Footer>
    </LayoutContainer>
  );
};

export default Layout;