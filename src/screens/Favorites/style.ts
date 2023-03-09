import styled from "styled-components";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.View`
  flex: 1;
  background-color: #0D0D0D;
`;

export const Header = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 40px 20px;
`;

export const TitleFavorites = styled.Text`
  color: #FFFFFF;
  font-size: ${RFValue(20)}px;
  font-weight: bold;
`;