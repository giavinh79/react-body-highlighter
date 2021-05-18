import styled from 'styled-components';

interface IPolygonProps {
  readonly bodyColor: string;
  readonly hoverColor: string;
}

export const Polygon = styled.polygon<IPolygonProps>`
  cursor: pointer;
  fill: ${props => props.bodyColor || '#B6BDC3'};
  &:hover {
    fill: ${props => props.hoverColor || '#757782'};
  }
`;
