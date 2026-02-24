"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginValues) => {
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("¡Bienvenido/a de nuevo!");
                router.push("/");
                router.refresh(); // Update auth state in server components
            }
        } catch (err) {
            toast.error("Ocurrió un error inesperado al intentar iniciar sesión.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" suppressHydrationWarning>
            <div className="space-y-1">
                <Input
                    {...register("email")}
                    type="email"
                    placeholder="Correo electrónico"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                />
                {errors.email && (
                    <p className="text-xs text-red-400 pl-1">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Input
                    {...register("password")}
                    type="password"
                    placeholder="Contraseña"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                />
                {errors.password && (
                    <p className="text-xs text-red-400 pl-1">{errors.password.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
                Iniciar Sesión
            </Button>
        </form>
    );
}
