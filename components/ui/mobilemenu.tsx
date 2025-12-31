// /components/ui/MobileMenu.tsx
import { useUserStore } from '@/lib/store';
import { useState, useEffect, useRef} from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';

export const MobileMenu: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { user, isAuthenticated, logout } = useUserStore();
	
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();

	const toggleMenu = () => {
	  setIsOpen(prev => !prev);
	};
	
	// Close menu when clicking outside
	useEffect(() => {
	  if (!user && isAuthenticated) {
		logout()
		router.push('/login');
		return;
	  }
	  if (!isOpen) return; // Don't add listener if menu is closed
	
	  const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as Node;
		
		// Close if click is outside both menu and button
		if (
		  !menuRef.current?.contains(target) &&
		  !buttonRef.current?.contains(target)
		) {
		  setIsOpen(false);
		}
	  };
	
	  // Small delay to prevent immediate closing when opening
	  const timeoutId = setTimeout(() => {
		document.addEventListener('mousedown', handleClickOutside);
	  }, 0);
	
	  return () => {
		clearTimeout(timeoutId);
		document.removeEventListener('mousedown', handleClickOutside);
	  };
	}, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Mobile Menu Burger Icon */}
      <button
        className="cursor-pointer transition duration-300 md:hidden lg:hidden p- bg-background rounded flex flex-col gap-[0.3rem]"
        onClick={toggleMenu}
		ref={buttonRef}
      >
        {/* Burger Icon */}
        <span className="block w-6 h-0.5 bg-white "></span>
        <span className="block w-6 h-0.5 bg-white "></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>

      {/* Mobile Menu Links */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        }   right-0  text-white py-4 px-6 rounded-lg shadow-lg md:hidden lg:hidden

			absolute top-12 w-35 bg-background border border-border hover:border-primary/50 transition-all duration-300
		`}
      >
        <ul>
          <li className='transition duration-300 hover:bg-[#1c1c1ccf] rounded-2xl text-center' onClick={()=> setIsOpen(false)}>
		  	<Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Articles
            </Link>
          </li>
          <li className='transition duration-300 hover:bg-[#1c1c1ccf] rounded-2xl text-center'  onClick={()=> setIsOpen(false)}>
		  	<Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>          
		 </li>
          <li className='transition duration-300 hover:bg-[#1c1c1ccf] rounded-2xl text-center' onClick={()=> setIsOpen(false)}>
		  	<Link href="/authors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Authors
            </Link>          
		  </li>
		  {
			isAuthenticated &&
			<>
				<li className='transition duration-300 hover:bg-[#1c1c1ccf] rounded-2xl text-center' onClick={()=> setIsOpen(false)}>
					<Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Dashboard
					</Link>
				</li>
				<li className='transition duration-300 hover:bg-[#1c1c1ccf] rounded-2xl text-center' onClick={()=> setIsOpen(false)}>
					<Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Settings
					</Link>
				</li>
			</>
		  }
        </ul>
      </div>
    </div>
  );
};
