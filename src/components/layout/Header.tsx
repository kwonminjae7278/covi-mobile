import Image from 'next/image';

export const Header = () => {
  return (
    <header className="flex items-center justify-start py-4">
      <Image
        src="/covi_mobile_logo.png"
        alt="COVI Mobile Logo"
        width={100}
        height={32}
        className="h-8 w-auto object-contain"
        priority
      />
    </header>
  );
};
