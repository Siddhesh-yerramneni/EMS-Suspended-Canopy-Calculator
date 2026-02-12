import CSlogo from "../assets/logo-300x123(1).png";
export default function Header() {
  return (
    <header className="bg-black text-white px-4 py-2 sm:px-6 sm:py-4 shadow-md">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">

          {/* Left: Logo */}
          <div className="flex justify-center lg:justify-start gap-4">
            <img
              src="https://www.engineeringexpress.com/wp-content/uploads/2022/10/EX23-stacked-white-LG-1575wT2.png"
              alt="Company Logo"
              className="h-10 sm:h-14 w-auto object-contain"
            />
            <h2 className="flex justify-center pt-4">X</h2>
            <img
              src="https://www.easternmetal.com/ASSETS/IMAGES/LOGOS/CLIENT/21/EMS-Dark-RGB-min.png"
              alt="Company Logo"
              className="h-10 sm:h-14 w-auto object-contain"
            />
          </div>

          {/* Center: Title + Version Info */}
          <div className="flex flex-col items-center text-center flex-1">
            <h1 className="text-lg sm:text-2xl font-['Chiron Sung HK'] leading-tight">
              Host Mounted Suspended Canopy Calculator
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm mt-2 text-gray-300">
              <p>Version: 1.0</p>
              <p>Updated: February 12, 2026</p>
            </div>
          </div>

          {/* Right: Help Link */}
          <div className="text-xs sm:text-sm text-right self-center lg:self-auto">
            <a
              href="https://www.engineeringexpress.com/"
              className="hover:underline hover:text-gray-300 transition-colors duration-200"
            >
              Help – Glossary
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
