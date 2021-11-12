import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from '../ui-components/inputs/Button';

export function AppNavigation() {
  const [file, setFile] = useState('');

  function handleSayHello() {
    try {
      const fs = window.api.fs;
      setFile(
        fs.readFileSync(
          '/Users/zuccha/Development/personal/bazar/prettier.config.js',
          'utf-8',
        ),
      );
    } catch (error) {
      setFile('error');
    }
  }

  return (
    <Container>
      <Image
        src='https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg'
        alt='ReactJS logo'
      />
      <Button onClick={handleSayHello}>Send message to main process</Button>
      <Text>{file}</Text>
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
