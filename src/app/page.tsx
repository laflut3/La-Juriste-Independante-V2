import ProductSection from "@lib/ProductLib/component/ProductsSection";
import NewsLetterSection from "@lib/NewsLetterLib/component/NewsLetterSection";
import TestimonialsSection from "@lib/testimonialLib/component/TestimonialsSection";
import FirstSection from "@/components/home/FirstSection";
import SecondSection from "@/components/home/SecondSection";
import BubbleBackground from "@/components/utils/décors/BubbleBackground";
import React from "react";
import "@/styles/index.css";

export default function Home() {
    return (
        <main className="relative items-center justify-between">
            <FirstSection/>
            <SecondSection/>
            {/*<ProductSection/>*/}
            <TestimonialsSection/>
            <BubbleBackground page="landing"/>
        </main>
    );
}
