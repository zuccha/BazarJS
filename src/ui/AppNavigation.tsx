import styled, { keyframes } from 'styled-components';
import { Button } from '../ui-components/inputs/Button';

export function AppNavigation() {
  function handleSayHello() {
    window.Main.sendMessage('Hello World');
    console.log('Message sent! Check main process log in terminal.');
  }

  return (
    <Container>
      <Image
        src='https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg'
        alt='ReactJS logo'
      />
      <Text>A tool for hacking SMW.</Text>
      <Button onClick={handleSayHello}>Send message to main process</Button>
    </Container>
  );
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  height: 100vh;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    margin-top: 24px;
  }
`;

export const Image = styled.img`
  width: 240px;
  animation: ${rotate} 15s linear infinite;
`;

export const Text = styled.p`
  margin-top: 24px;
  font-size: 18px;
`;
