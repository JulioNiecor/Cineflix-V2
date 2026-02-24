"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerUser } from "@/app/actions";
import { toast } from "sonner";

const registerSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterValues) => {
        try {
            // Use Server Action instead of API Route
            const res = await registerUser({
                name: data.name,
                email: data.email,
                password: data.password
            });

            if (res.error) {
                throw new Error(res.error);
            }

            // Login immediately
            const signInRes = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (signInRes?.error) {
                toast.error("Registrado exitosamente, pero no se pudo iniciar sesión automáticamente. Intenta iniciar sesión manualmente.");
            } else {
                toast.success("¡Cuenta creada con éxito! Bienvenido/a.");
                router.push("/");
                router.refresh();
            }
        } catch (err: any) {
            toast.error(err.message || "Ocurrió un error inesperado al registrarse.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" suppressHydrationWarning>
            <div className="space-y-1">
                <Input
                    {...register("name")}
                    type="text"
                    placeholder="Nombre completo"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                />
                {errors.name && <p className="text-xs text-red-400 pl-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
                <Input
                    {...register("email")}
                    type="email"
                    placeholder="Correo electrónico"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                />
                {errors.email && <p className="text-xs text-red-400 pl-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
                <Input
                    {...register("password")}
                    type="password"
                    placeholder="Contraseña"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                />
                {errors.password && <p className="text-xs text-red-400 pl-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
                <Input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Confirmar contraseña"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                />
                {errors.confirmPassword && <p className="text-xs text-red-400 pl-1">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
                Crear Cuenta
            </Button>
        </form>
    );
}
