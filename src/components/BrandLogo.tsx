import { Link } from 'react-router-dom';
import logo from '../images/rwc1.png';

interface BrandLogoProps {
  to?: string;
  iconClassName?: string;
  textClassName?: string;
  className?: string;
}

export default function BrandLogo({
  to,
  iconClassName = 'w-11 h-11',
  textClassName = 'text-lg font-bold text-primary leading-none',
  className = 'inline-flex items-center gap-2',
}: BrandLogoProps) {
  const content = (
    <>
      <img src={logo} alt="" className={`object-contain shrink-0 ${iconClassName}`} aria-hidden />
      <span className={textClassName}>RouteWander</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${className} hover:opacity-90 transition-opacity`}>
        {content}
      </Link>
    );
  }

  return <span className={className}>{content}</span>;
}
