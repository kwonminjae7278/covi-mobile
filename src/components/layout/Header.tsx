import Image from 'next/image';

export const Header = () => {
  return (
    <header className="flex items-center justify-start py-4">
      <Image
        src="/covi_mobile_logo.jpg?v=2026"
        alt="COVI Mobile Logo"
        width={120}
        height={40}
        style={{ height: 'auto' }}
        className="object-contain"
        priority
      />
    </header>
  );
};
