export default function Card({
  children,
  className = "",
  onClick
}) {

  return (
    <div
      className={`card-default ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}