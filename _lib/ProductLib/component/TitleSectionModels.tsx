'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import edit_icon2 from '@public/images/common/edit-icon2.svg';
import searchIcon from '@public/images/landing-page/search-icon.svg';
import gif from '@public/images/models-page/contract-search.gif';
import line from "@public/images/Utils/redline.png";

interface TitleSectionModelsProps {
    professionName: string;
}

const TitleSectionModels: React.FC<TitleSectionModelsProps> = ({ professionName }) => {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [profession, setProfession] = useState<string>(professionName || '');
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [searchString, setSearchString] = useState<string>('');
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (pathname === '/models') {
            setProfession(professionName);
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 832);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [pathname, professionName]);

    useEffect(() => {
        if (isClicked) {
            inputRef.current?.focus();
        }
    }, [isClicked]);

    const handleBlur = () => {
        if (searchString.length === 0) {
            setIsAnimating(false);
            setTimeout(() => {
                setIsClicked(false);
            }, 2000);
        }
    };

    const handleToggleSearch = () => {
        setIsClicked((prevState) => {
            if (!prevState) {
                setTimeout(() => setIsAnimating(true), 500);
            }
            return !prevState;
        });
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`min-h-[350px] sm:min-h-auto flex flex-col justify-center items-start md:ml-10`}>
                <h1 className="text-3xl md:text-4xl font-bold w-full mb-12 md:mb-6 title_section_contrats">
                    {!isMobile ? (
                        <>
                            Des modèles qui correspondent <span className={"relative"}>à vos besoins <Image src={line} alt={"line"} className={"absolute right-0"} /></span>
                        </>
                    ) : (
                        <>
                            Des modèles qui correspondent <br /><span className={"relative"}>à vos besoins <Image src={line} alt={"line"} className={"absolute right-0"} /></span>
                        </>
                    )}
                </h1>
                <p className={`text-lg sm:text-base md:text-lg font-light md:w-2/3 text-center md:text-left`}>
                    Je mets à votre disposition des modèles juridiques prêts à l'emploi, spécialement conçus pour répondre aux exigences uniques de votre secteur professionnel.
                </p>
                <form
                    className={`mt-10 md:mt-6 flex items-center ${isClicked && 'bg-[#F5F5F5] border border-gray-300 rounded-md'} ${isMobile ? 'w-full' : 'max-w-xl'}`}
                >
                    {!isClicked ? (
                        <button
                            type="button"
                            onClick={handleToggleSearch}
                            className={`flex items-center justify-center text-black bg-[#D9D9D9] px-4 py-2 rounded-lg ${isMobile ? 'w-full' : ''}`}
                        >
                            {professionName || 'Prestataire de services'}
                            <Image src={edit_icon2} alt="edit icon" className="w-6 h-6 ml-2" />
                        </button>
                    ) : (
                        <div className="input-container w-full">
                            <input
                                ref={inputRef}
                                className={`input py-1.5 ${isAnimating && !isMobile ? (isClicked ? 'expand' : 'collapse') : ''}`}
                                type="text"
                                name="query"
                                required
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                value={searchString}
                                onBlur={handleBlur}
                                onChange={(e) => setSearchString(e.target.value)}
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className="labelAnimation label-p">
                                Quelle est votre profession ?
                            </label>
                            <button
                                type="submit"
                                className="bg-[#F5F5F5]"
                            >
                                <span>
                                    <Image src={searchIcon} alt="search icon" className="w-10 h-6 bg-[#F5F5F5]" />
                                </span>
                            </button>
                        </div>
                    )}
                </form>
            </div>
            <div className="w-1/4">
                <Image
                    src={gif}
                    alt="gif contract search"
                    className="w-32 h-32 mt-2 gif-models"
                />
            </div>
        </div>
    );
};

export default TitleSectionModels;