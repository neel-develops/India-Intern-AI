import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      {...props}
    >
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm4-40a8,8,0,0,1-8-8V128a8,8,0,0,1,16,0v40A8,8,0,0,1,132,176ZM128,96a12,12,0,1,1-12-12A12,12,0,0,1,128,96Z"></path>
    </svg>
  );
}
