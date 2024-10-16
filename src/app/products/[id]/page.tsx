"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { ProductDetail, ProductPageProps } from "@/../_lib/ProductLib/type/Product";
import { fetchProductById } from "@/../_lib/ProductLib/service/produit";
import { createOrder } from "@/../_lib/OrderLib/service/orders";
import { FaShoppingCart } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { addToCart } from "@/../_lib/CartLib/service/cart";
import left_arrow_icon from '@public/images/common/left-arrow-icon2.svg';
import arrow_right_icon from '@public/images/common/arrow-right-icon.svg';
import card_icon from '@public/images/common/cart-icon.svg';
import BubbleDecoration from "@/../_lib/ProductLib/component/BubbleDecoration";
import BackgroundBubbles from "@/components/utils/décors/BubbleBackground";

export default function ProductPage({ params }: ProductPageProps) {
    const [product, setProduct] = useState<ProductDetail>()
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const loadProduct = async () => {
            const fetchedProduct = await fetchProductById(params.id);
            if (!fetchedProduct) {
                setError(true);
                setLoading(false);
                return;
            }
            setProduct(fetchedProduct);
            setLoading(false);
        };

        loadProduct();
    }, [params.id]);

    const handleCart = async () => {
        if (!product) return;

        try {
            // Utilisateur connecté
            if (session?.user) {
                await addToCart({ userId: session.user.id, productId: product._id, quantity: 1 });
            } else {
                // Utilisateur non connecté - Stocker le panier dans le localStorage
                const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingTemplateIndex = cartItems.findIndex(
                    (item: any) => item.productId === product._id
                );

                if (existingTemplateIndex > -1) {
                    cartItems[existingTemplateIndex].quantity += 1;
                } else {
                    cartItems.push({
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cartItems));
            }

            setIsSuccess(true);
            setMessage('Produit ajouté au panier!');
        } catch (error) {
            console.error('Error adding template to cart:', error);
            setIsSuccess(false);
            setMessage('Échec de l\'ajout au panier.');
        }

        // Clear the message after 3 seconds
        setTimeout(() => {
            setMessage(null);
            setIsSuccess(null);
        }, 3000);
    };

    const handleOrder = async () => {
        if (!product || !session?.user) return;

        try {
            const result = await createOrder({
                userId: session.user.id,
                items: [{
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                }],
                amount: product.price,
            });

            console.log(result);
            router.push(`/paiement?orderId=${result.orderId}`);
        } catch (error) {
            console.error('Order creation failed:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen z-10"></div>;
    }

    if (error || !product) {
        return notFound();
    }

    return (
        <main className="relative min-h-screen flex items-start justify-center">
            <div className="w-full">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center justify-start">
                        <button onClick={() => window.history.back()} className='flex items-center ml-6'>
                            <Image src={left_arrow_icon} alt="left arrow icon" className='w-12 h-12' />
                        </button>
                        <div className="flex flex-col mt-20 ml-3">
                            <h1 className='text-3xl font-semibold text-center mt-10 mb-10 ml-3'>
                                {!product ? (
                                    <span>Modèle</span>
                                ) : (
                                    <span>{product.name}</span>
                                )}
                            </h1>
                            <p className='bg-gray-200 p-2 rounded-lg text-center ml-3 mb-8'>
                                {product && (
                                    <span className='w-full text-center'>
                                        {product.profession && typeof product.profession === 'string' ? product.profession : ''}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <hr className="w-1/4 md:w-[400px] border-[#DA1A32] border-[12px] md:border-l-8 rounded-l-xl border-special-red my-10" />
                </div>
                <div className="flex flex-col md:flex-row items-center h-full w-full justify-between">
                    <div className="w-2/3 flex items-center h-full justify-center">
                        <ModelCart3 product={product} />
                    </div>
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        {!isMobile ? (
                            <p className='max-w-[700px] text-lg xs:text-xl md:text-xl xl:text-xl text-justify'>
                                {product.description || 'Description non disponible'}
                            </p>
                        ) : (
                            <details className='mt-20 mb-5'>
                                <summary className='text-lg font-bold text-center'>Description</summary>
                                <p className='text-center'>
                                    {product.description || 'Description non disponible'}
                                </p>
                            </details>
                        )}
                        
                    </div>
                </div>
                <BackgroundBubbles page='contracts' />
            </div>
        </main>
    );
}

const ModelCart3 = ({ product }: { product: ProductDetail }) => {

    return (
        <div className='relative'>
            <div className="relative flex -z-10 flex-col items-center justify-center w-[300px] p-2 pb-0 bg-[#EAEAEA] rounded-lg cursor-pointer transition shadow-lg hover:shadow-xl overflow-hidden">
                <div className='flex flex-col relative items-center justify-center h-[320px] w-[250px] md:w-[400px]'>
                    <div className={"mt-5"}>
                        <BubbleDecoration size={70} position="-right-5 -bottom-2" opacity={0.5} />
                        <BubbleDecoration size={70} position="right-5 -bottom-6" opacity={0.3} />
                    </div>
                    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden h-full w-full md:w-[400px]">
                        <div className="flex items-center justify-center w-full border-1 border-black h-full">
                            <div className="flex-col items-center justify-center w-full h-full mt-10">
                                <h2 className="text-xl font-bold text-center  mb-[35px]">{product.name}</h2>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className={"shadow-xl flex flex-col bg-[#F8F8F8] rounded-full items-center ml-[18%] justify-center mt-[-7%] z-50 w-[190px]"}>
                <p className='font-bold text-2xl p-2 text-center'>
                    {product.price} €
                </p>
            </div>
        </div>
    )
}