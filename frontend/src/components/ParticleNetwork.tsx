import { useEffect, useRef } from "react";

export const ParticleNetwork = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particlesArray: Particle[] = [];
        let animationFrameId: number;
        let mouse = { x: null as number | null, y: null as number | null, radius: 150 };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener("mouseout", () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            color: string;

            constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (!canvas) return;
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                // Mouse collision
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius + this.size) {
                        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 10;
                        if (mouse.x > this.x && this.x > this.size * 10) this.x -= 10;
                        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 10;
                        if (mouse.y > this.y && this.y > this.size * 10) this.y -= 10;
                    }
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        const init = () => {
            if (!canvas) return;
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 2 + 1;
                let x = Math.random() * (canvas.width - size * 2) + size * 2;
                let y = Math.random() * (canvas.height - size * 2) + size * 2;
                let directionX = Math.random() * 1 - 0.5;
                let directionY = Math.random() * 1 - 0.5;
                let color = "rgba(99, 102, 241, 0.5)"; // Indigo 500 equivalent

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance =
                        (particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x) +
                        (particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y);
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - distance / 20000;
                        if (!ctx) return;
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue})`; // Violet 500 equivalent
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        };

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-auto"
            style={{ zIndex: 0 }}
        />
    );
};
