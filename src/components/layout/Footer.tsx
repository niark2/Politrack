import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-zinc-200/50 bg-zinc-50/50 py-3 mt-auto">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs font-medium text-zinc-500">
                <div className="mb-2 md:mb-0">
                    &copy; {new Date().getFullYear()} POLITRACK. Tous droits réservés.
                </div>
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-zinc-900 transition-colors uppercase tracking-widest font-bold">Mentions légales</a>
                    <a href="#" className="hover:text-zinc-900 transition-colors uppercase tracking-widest font-bold">Confidentialité</a>
                    <a href="#" className="hover:text-zinc-900 transition-colors uppercase tracking-widest font-bold">Contact</a>
                </div>
            </div>
        </footer>
    );
}
