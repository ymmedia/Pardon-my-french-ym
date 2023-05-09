
import styled from 'styled-components'

export const WaveformContianer = styled.div`
  display: flex;  
  flex-direction: row;  
  align-items: center;
  justify-content: center;
  height: 200px;  width: 100%;
  filter: drop-shadow(0px 0px 14px rgba(0, 0, 0, 0.66));
  font-weight:600;
  background: transparent;
`;

export const Wave = styled.div`
  width: 100%;
  height: 180px;
`;

export const PlayButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: #EFEFEF;
  font-weight:600;
  border-radius: 50%;
  text-transform:uppercase;
  font-size:1rem;
  border: none;
  outline: none;
  filter: drop-shadow(0px 0px 14px rgba(0, 0, 0, 0.66));
  font-weight:600;
  cursor: pointer;
  padding-bottom: 3px;
  &:hover {
    background-color: #f9e66e;
  }
`;

/* small */

export const WaveformContianerSmall = styled.div`
  display: flex;  
  flex-direction: row;  
  align-items: center;
  justify-content: center;
  height: auto; 
  width: 100%;
  filter: drop-shadow(0px 0px 14px rgba(0, 0, 0, 0.66));
  font-weight:600;
  background: transparent;
`;

export const WaveSmall = styled.div`
  width: 100%;
  height: 100px;
`;

export const PlayButtonSmall = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  min-width:50px;
  background-color: #EFEFEF;
  font-weight:600;
  border-radius: 50%;
  text-transform:uppercase;
  font-size:1rem;
  border: none;
  outline: none;
  filter: drop-shadow(0px 0px 14px rgba(0, 0, 0, 0.66));
  font-weight:600;
  cursor: pointer;
  padding-bottom: 3px;
  &:hover {
    background-color: #f9e66e;
  }
`;
