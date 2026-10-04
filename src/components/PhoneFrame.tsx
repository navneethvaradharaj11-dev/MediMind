import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

const PhoneFrame = ({ children }: PhoneFrameProps) => {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background md:bg-page">
      <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden bg-background">
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame;
