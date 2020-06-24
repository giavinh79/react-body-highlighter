import styled from 'styled-components';

/* Types for Styled Components */

interface SvgProps {
  readonly responsive: boolean | null | undefined;
}

interface PolygonProps {
  readonly bodyColor: string;
  readonly hoverColor: string;
}

/* Styled Components */

export const Svg = styled.svg<SvgProps>`
  width: ${({ responsive }) => (responsive ? '100%' : '210px')};
  height: auto;
`;

export const Polygon = styled.polygon<PolygonProps>`
  cursor: pointer;
  fill: ${props => props.bodyColor || '#B6BDC3'};
  &:hover {
    fill: ${props => props.hoverColor || '#B6BDC3'};
  }
`;
