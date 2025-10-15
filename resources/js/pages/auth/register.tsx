import { login } from '@/routes';
import { Form, Head, useForm } from '@inertiajs/react';
import { FaGoogle, FaFacebook, FaGithub, FaApple, FaEnvelope, FaMobile, FaMobileAlt } from "react-icons/fa";
import { LoaderCircle, Mail, Phone, Globe } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';


import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const [method, setMethod] = useState<'email' | 'phone' | 'google' | 'facebook' | 'github' | 'apple'>('phone');

    const { data, setData, post, processing, errors } = useForm({
        fullname: '',
        value: '',
        password: '',
        password_confirmation: '',
        login_method_type: 'phone',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <AuthLayout
            title="Créer un compte"
            description="Choisissez une méthode d'inscription"
        >
            <Head title="Inscription" />
            <Form method="post" className="flex flex-col gap-6 p-6 border rounded-lg shadow-lg">
            
                {/* Type de méthode */}
                <input
                    type="hidden"
                    name="login_method_type"
                    value={method}
                />
                {/* --- Choix de la méthode de connexion --- */}
                <div className="grid grid-cols-2 gap-6">
                    <Button
                        type="button"
                        variant={method === 'phone' ? 'default' : 'outline'}
                        onClick={() => {
                            setMethod('phone');
                            setData('login_method_type', 'phone');
                        }}
                    >
                        <FaMobileAlt />
                        Téléphone
                    </Button>
                    <Button
                        type="button"
                        variant={method === 'email' ? 'default' : 'outline'}
                        onClick={() => {
                            setMethod('email');
                            setData('login_method_type', 'email');
                        }}
                    >
                        <FaEnvelope />
                        E-mail
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* Nom complet */}
                    <div className="grid gap-2">
                        <Label htmlFor="fullname">Nom complet</Label>
                        <Input
                            id="fullname"
                            name="fullname"
                            type="text"
                            value={data.fullname}
                            onChange={e => setData('fullname', e.target.value)}
                            required
                            placeholder="John Doe"
                        />
                        <InputError message={errors.fullname} />
                    </div>

                    {/* Champ dynamique selon méthode */}
                    {method === 'email' && (
                        <div className="grid gap-2">
                            <Label htmlFor="value">Adresse e-mail</Label>
                            <Input
                                id="value"
                                name="value"
                                type="email"
                                value={data.value}
                                onChange={e => setData('value', e.target.value)}
                                required
                                placeholder="exemple@mail.com"
                                autoComplete="email"
                            />
                            <InputError message={errors.value} />
                        </div>
                    )}

                    {method === 'phone' && (
                        <div className="grid gap-2">
                            <Label htmlFor="value">Numéro de téléphone</Label>
                            <Input
                                id="value"
                                name="value"
                                type="tel"
                                value={data.value}
                                onChange={e => setData('value', e.target.value)}
                                required
                                placeholder="+241 07 22 23 344"
                                autoComplete="tel"
                            />
                            <InputError message={errors.value} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirmer le mot de passe
                        </Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="mt-4 w-full"
                >
                    {processing ? 
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> 
                            Inscription en cours...
                        </>
                        : "Créer un compte"
                    }
                    
                </Button>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm mb-3">Ou se connecter avec</p>
                    <div className="flex justify-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setMethod('google');
                                window.location.href = '/google/redirect'
                            }}
                            >
                            <FaGoogle className="text-google" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setMethod('facebook');
                                window.location.href = '/facebook/redirect'
                            }}
                        >
                            <FaFacebook className="text-facebook" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setMethod('github');
                                window.location.href = '/github/redirect'
                            }}
                        >
                            <FaGithub className="text-github" />
                            
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setMethod('apple');
                                window.location.href = '/apple/redirect'
                            }}
                        >
                            <FaApple className="text-apple" />
                        </Button>
                    </div>
                </div>


                <div className="text-center text-sm text-muted-foreground mt-4">
                    Vous avez déjà un compte ? <br></br>
                    <TextLink href={login()}>Se connecter</TextLink>
                </div>
            </Form>
        </AuthLayout>
    );
}