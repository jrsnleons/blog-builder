import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
            <Button variant="primary">Click Me</Button>
        </div>
    );
}
