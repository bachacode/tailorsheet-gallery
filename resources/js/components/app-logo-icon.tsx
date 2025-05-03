import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
      <svg {...props} version="1.0" xmlns="http://www.w3.org/2000/svg"
       width="32.000000pt" height="32.000000pt" viewBox="0 0 32.000000 32.000000"
       preserveAspectRatio="xMidYMid meet">

      <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
      fill="#000000" stroke="none">
      <path d="M0 295 c0 -14 7 -37 16 -50 14 -21 24 -25 69 -25 53 0 53 0 84 50
      l31 50 -100 0 -100 0 0 -25z"/>
      <path d="M205 295 c-8 -14 -22 -36 -30 -50 l-15 -25 63 0 c59 0 64 2 80 29 9
      16 17 39 17 50 0 19 -6 21 -50 21 -42 0 -52 -4 -65 -25z"/>
      <path d="M122 93 l3 -88 38 -3 37 -3 0 59 c0 57 -1 60 -40 91 l-41 33 3 -89z"/>
      </g>
      </svg>

    );
}
