import styled from "styled-components";
const Wrapper = styled.div`
  min-height: calc(100vh - 40px);
  min-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px;
  margin-bottom: 20px;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #073b4c;
  border-radius: 25px;
`;
export default Wrapper;
