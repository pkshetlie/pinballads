// app/sales/[id]/head.tsx
import { Metadata } from "next";
import config from "@/config";

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = params.id;
console.log('JE suis call !')
    // Appel API côté serveur (pas en client !)
    const res = await fetch(`${config.API_BASE_URL}/public/sales/machine/${id}`, {
        cache: "no-store"
    });
    const pinball = await res.json();

    return {
        title: `${pinball.name} - Pinball for sale`,
        description: pinball.description?.slice(0, 155),

        openGraph: {
            title: pinball.name,
            description: pinball.description?.slice(0, 200),
            type: "article",
            url: `${config.API_BASE_URL}/listings/detail/${id}`,
            images: [
                {
                    url: pinball.images?.[0],
                    width: 1200,
                    height: 630,
                    alt: pinball.name
                }
            ]
        }
    };
}

export default function Head() {
    return null; // Next gère tout via generateMetadata()
}
